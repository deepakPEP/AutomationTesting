import { Page, test } from '@playwright/test';

export class TestLogger {
  private static logs: string[] = []; // Store logs for HTML report

  /**
   * Enhanced console.log that appears in Playwright HTML reports
   */
  static log(message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message} ${args.length > 0 ? args.join(' ') : ''}`;
    
    // Store for HTML report
    this.logs.push(logMessage);
    
    // Output to console
    console.log(logMessage);
  }
  static getCollectedLogs(): string {
    return this.logs.join('\n');
  }

  // Attach per-test logs to Playwright test result so they appear in HTML report
  // Pass the Playwright testInfo object from tests: await TestLogger.attachLogsToTest(testInfo)
  static async attachLogsToTest(testInfo: any, name = 'test-logs.txt') {
    try {
      const content = this.getCollectedLogs() || 'No logs collected';
      // Attach to Playwright test (shown in HTML report as attachment)
      await testInfo.attach(name, {
        body: Buffer.from(content, 'utf-8'),
        contentType: 'text/plain'
      });
    } catch (err) {
      // Fallback: write into repo output so workflow can upload it
      const fs = require('fs');
      const path = require('path');
      const outDir = process.cwd();
      const outFile = path.join(outDir, 'test-output.log');
      try {
        fs.appendFileSync(outFile, '\n' + this.getCollectedLogs(), { encoding: 'utf8' });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to write fallback test-output.log', e);
      }
    }
  }

  /**
   * Enhanced success logging
   */
  static success(message: string): void {
    this.log(`✅ ${message}`);
  }

  /**
   * Enhanced error logging
   */
  static error(message: string): void {
    this.log(`❌ ${message}`);
  }

  /**
   * Enhanced info logging
   */
  static info(message: string): void {
    this.log(`ℹ️ ${message}`);
  }

  /**
   * Warning logging
   */
  static warn(message: string): void {
    this.log(`⚠️ ${message}`);
  }

  /**
   * Debug logging
   */
  static debug(message: string): void {
    this.log(`🐛 ${message}`);
  }

  /**
   * Clear all stored logs
   */
  static clearLogs(): void {
    this.logs = [];
  }

  /**
   * Get current log count
   */
  static getLogCount(): number {
    return this.logs.length;
  }

  /**
   * Enhanced step logging with test.step integration
   */
  static async logStep<T>(stepName: string, stepFunction: () => Promise<T>): Promise<T> {
    this.log(`🔄 Starting step: ${stepName}`);
    
    try {
      // Use Playwright's test.step for HTML report integration
      const result = await test.step(stepName, async () => {
        return await stepFunction();
      });
      
      this.success(`Step completed: ${stepName}`);
      return result;
    } catch (error) {
      this.error(`Step failed: ${stepName} - ${error}`);
      throw error;
    }
  }

  /**
   * Enhanced test wrapper that automatically logs failures with rich context
   */
  static async executeWithLogging<T>(
    page: Page,
    testName: string,
    testFunction: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      this.log(`🏁 Starting test: ${testName}`);
      const result = await testFunction();
      
      // Log successful test
      const duration = Date.now() - startTime;
      this.success(`Test completed successfully: ${testName} (${duration}ms)`);
      
      return result;
    } catch (error) {
      // Log failed test with enhanced context
      const duration = Date.now() - startTime;
      this.error(`Test failed: ${testName} (${duration}ms) - ${error}`);
      
      // Capture screenshot for failed test
      const screenshotPath = await this.captureScreenshot(page, testName);
      if (screenshotPath) {
        this.log(`📸 Screenshot saved: ${screenshotPath}`);
      }
      
      throw error; // Re-throw to maintain test failure
    }
  }

  /**
   * Capture screenshot with timestamp
   */
  private static async captureScreenshot(page: Page, testName: string): Promise<string> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `failure-${testName.replace(/[^a-zA-Z0-9]/g, '-')}-${timestamp}.png`;
      const screenshotPath = `test-results/screenshots/${fileName}`;
      
      await page.screenshot({ 
        path: screenshotPath, 
        fullPage: true 
      });
      
      return screenshotPath;
    } catch (error) {
      console.warn('⚠️ Could not capture screenshot:', error);
      return '';
    }
  }

  /**
   * Wait for element with enhanced error reporting
   */
  static async waitForElementWithLogging(
    page: Page,
    selector: string,
    options: { timeout?: number; stepName?: string } = {}
  ): Promise<void> {
    const stepName = options.stepName || `Wait for element: ${selector}`;
    const timeout = options.timeout || 10000;
    
    try {
      await page.waitForSelector(selector, { timeout });
      this.success(`Element found: ${selector}`);
    } catch (error) {
      // Enhanced error context for missing elements
      const pageInfo = {
        url: page.url(),
        title: await page.title().catch(() => 'Unknown'),
        availableElements: await page.locator('*').count().catch(() => 0)
      };
      
      const enhancedError = new Error(
        `Element not found: ${selector}\n` +
        `Page URL: ${pageInfo.url}\n` +
        `Page Title: ${pageInfo.title}\n` +
        `Total elements on page: ${pageInfo.availableElements}\n` +
        `Original error: ${error}`
      );
      
      // Log the enhanced error
      this.error(`${stepName} failed: ${enhancedError.message}`);
      
      throw enhancedError;
    }
  }
}