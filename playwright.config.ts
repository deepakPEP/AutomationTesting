import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'product_I_sell_without_variants',
      grep: /@product_I_sell_without_variants/,
    },
    // {
    //   name: 'regression',
    //   grep: /@regression/,
    // },
     // {
    //   name: 'sanity',
    //   grep: /@sanity/,
    // },
  ],
  testDir: './src/tests',
  
  globalSetup: require.resolve('./playwright.global-setup'),
  // Force single worker execution (no parallel execution)
  //workers: 1,
  workers: process.env.CI ? 3 : 1, // 3 workers in CI, 1 worker locally
  
  // Retry configuration for failed tests
  retries: process.env.CI ? 1 : 0, // 1 retry in CI, 0 retries locally
  
  // Dynamic tag-based test execution
  // grep: process.env.TEST_TAGS ? new RegExp(process.env.TEST_TAGS) : 
  //       process.env.CI ? /@dummy/ : undefined,
  
  reporter: [
    ['html', { 
      outputFolder: 'playwright-report', 
      open: 'never',
      attachments: 'on', // Enable attachments to see console logs
    }],
    ['list'], // Console reporter to see logs during execution
    // ['./src/reporters/ZohoPlaywrightReporter.ts'], // Enhanced Zoho reporting - uncomment when ready
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  timeout: 30000,
  use: {
    // Use headless mode in CI environments, headed mode locally
    headless: !!process.env.CI,
    viewport: { width: 1024, height: 576 },
    baseURL: 'http://localhost:3000',
    // Keep artifacts only on failure (both CI and local)
    video: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    screenshot: 'only-on-failure', 
    trace: 'on-first-retry',
  },
  // Create directories for test results
  outputDir: 'test-results',
});
