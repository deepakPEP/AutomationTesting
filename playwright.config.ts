import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  
  // Retry configuration for failed tests
  retries: process.env.CI ? 1 : 0, // 1 retry in CI, 0 retries locally
  
  // Dynamic tag-based test execution
  grep: process.env.TEST_TAGS ? new RegExp(process.env.TEST_TAGS) : 
        process.env.CI ? /@critical/ : undefined,
  
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    // ['./src/reporters/ZohoPlaywrightReporter.ts'], // Enhanced Zoho reporting - uncomment when ready
    // ['json', { outputFile: 'test-results/results.json' }]
  ],
  timeout: 30000,
  use: {
    // Use headless mode in CI environments, headed mode locally
    headless: !!process.env.CI,
    baseURL: 'http://localhost:3000',
    video: 'retain-on-failure', // Only keep videos for failures
    screenshot: 'only-on-failure', // Only take screenshots on failure
    trace: 'retain-on-failure', // Only keep traces for failures
  },
  // Create directories for test results
  outputDir: 'test-results',
});
// import { defineConfig } from '@playwright/test';

// export default defineConfig({
//   testDir: './src/tests',
//   reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],  // HTML Reporter
//   timeout: 30000,
//   use: {
//     headless: false,
//     baseURL: 'http://localhost:3000',
//     video: { 
//       mode: 'on',  // Ensures video is recorded
//       size: '1280x720',  // Optional: Set video size
//     },
//     screenshot: 'on',
//     trace: 'on',
//   },
//   outputDir: 'playwright-report',  // Ensure output directory is correct
// });
