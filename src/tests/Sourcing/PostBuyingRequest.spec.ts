import { test, expect } from '@playwright/test';
import { getProductByName } from '../../utils/getProductFromCSV';
import { fetchOTP } from '../../utils/otp'; // Use relative path from authenticate.spec.ts
import { time } from 'console';
import { PostBuyingReqPage } from '../../pages/Sourcing/PostBuyingReqPage';
import { RFQDashboardPage } from '../../pages/Sourcing/RFQDashboardPage'; 

const product = getProductByName('Lcd Tv');

test('Sourcing Request test', async ({ page }) => {
    const postBuyingReqPage = new PostBuyingReqPage(page);
    const rfqDashboardPage = new RFQDashboardPage(page);
  test.setTimeout(120000);
  await page.goto('https://sandbox.pepagora.org/en/authenticate');

  await page.waitForTimeout(10000); // optional: increase if OTP delays

  await page.locator('div').filter({ hasText: /^Sales$/ }).getByRole('img').click();
  await page.locator('span').filter({ hasText: 'Sourcing' }).first().click()
  await page.getByRole('link', { name: 'RFQ & Supplier Match' }).click();
  await page.getByRole('button', { name: 'Post Buying Request Post' }).click();


  const rfq = await postBuyingReqPage.fillPostingBuyingReqForm(product);
  await page.waitForTimeout(5000); // Wait for category selection to process
  await page.reload({ waitUntil: 'networkidle' }); // or 'load'

  if (product) {
  console.log('Preferred Min Unit Price:', Object.keys(product));
  rfqDashboardPage.validateFirstContactRow(rfq);
  rfqDashboardPage.validateViewDetails(rfq);
} else {
  console.log('Product not found');
}
//await page.pause(); // Pause to inspect the form after filling it
});

