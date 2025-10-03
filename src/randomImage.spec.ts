import { test, expect } from '@playwright/test';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

test('Download image and upload it in form', async ({ page }) => {
  // 1. Download the image
  const imageUrl = 'https://random-image-pepebigotes.vercel.app/api/random-image';
  const tempDir = path.resolve(__dirname, '../temp');
  const imagePath = path.join(tempDir, 'random-image.jpg');

// 1. Ensure the temp folder exists
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

// 2. Download image as buffer and write to file
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

  fs.writeFileSync(imagePath, Buffer.from(response.data));

  // 2. Go to your page
  //await page.goto('https://example.com/form'); // Change to your actual page

  // 3. Upload the image
  //await page.setInputFiles('#productImage', imagePath); // use correct selector

  // 4. Optionally verify upload preview or success
  //await expect(page.locator('#uploadPreview')).toBeVisible();

  // 5. Clean up temp file (optional)
  //fs.unlinkSync(imagePath);
});
