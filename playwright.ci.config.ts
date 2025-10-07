import { defineConfig } from '@playwright/test';

/**
 * Lightweight Playwright configuration optimized for CI/CD
 * Generates minimal artifacts - only HTML report (no videos, traces, or screenshots)
 */
export default defineConfig({
  testDir: './src/tests',
  
  // Retry configuration for failed tests
  retries: 1, // 1 retry in CI
  
  // Dynamic tag-based test execution
  grep: process.env.TEST_TAGS ? new RegExp(process.env.TEST_TAGS) : /@critical/,
  
  // Only HTML reporter to minimize file size
  reporter: [
    ['html', { 
      outputFolder: 'playwright-report', 
      open: 'never',
      // Minimize embedded assets in HTML for smallest possible size
      embedAttachments: false,
      embedVideos: false
    }]
  ],
  
  timeout: 60000, // Increased timeout for CI stability
  
  use: {
    headless: true, // Always headless in CI
    baseURL: 'http://localhost:3000',
    
    // Keep failure artifacts for debugging
    video: 'retain-on-failure',
    screenshot: 'only-on-failure', 
    trace: 'retain-on-failure',
    
    // Optimize for speed
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  
  // Minimal output directory
  outputDir: 'test-results-minimal',
  
  // Configure projects for different browsers if needed
  projects: [
    {
      name: 'chromium',
      use: { 
        browserName: 'chromium',
        // Disable animations for faster execution
        launchOptions: {
          args: ['--disable-animations', '--disable-background-timer-throttling']
        }
      },
    },
  ],
});