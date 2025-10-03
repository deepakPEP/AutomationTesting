import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
  timeout: 30000,
  use: {
    headless: false,
    baseURL: 'http://localhost:3000',
    video: 'on',
    screenshot: 'on',
    trace: 'on',
  },
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
