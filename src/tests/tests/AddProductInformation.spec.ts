// src/tests/AddPepProduct.spec.ts
import { test, expect } from '@playwright/test';
import { getProductByName } from '../../utils/getProductFromCSV'; // Adjust the path based on your project structure
import { ProductInformationPage } from '../../pages/ProductISell/AddProductInfoPage';
import { fetchOTP } from '../../utils/otp'; 

test('Authenticate test with POM', async ({ page }) => {
    test.setTimeout(120000);
  const product = getProductByName('Electric Screwdriver');
  const productPage = new ProductInformationPage(page);

  await page.goto('http://183.82.251.239/en/authenticate');
  // login steps ...

await page.getByRole('textbox', { name: 'Email' }).fill('anusuya2011cse@gmail.com');
  await page.getByRole('button', { name: 'Continue with Email' }).click();

  // 🕐 Wait a bit to allow OTP to arrive
  await page.waitForTimeout(10000); // optional: increase if OTP delays

  // 📨 Fetch OTP from Gmail
  const otp = await fetchOTP();
  if (!otp) throw new Error('OTP not received');

  console.log('Using OTP:', otp);

  // ✍️ Fill OTP digits into 6 fields
  for (let i = 0; i < otp.length; i++) {
    await page.locator(`input`).nth(i).fill(otp[i]);
  }
  //await page.pause();
  await page.waitForTimeout(20000); // wait for 50 seconds
  //await page.waitForTimeout(3000); // wait for 3 seconds
  console.log('OTP filled successfully'); 
  // Proceed to rest of flow
 // await page.pause() // wait for 3 seconds
  await page.waitForTimeout(10000);
  
  await page.locator('div').filter({ hasText: /^Sales$/ }).getByRole('img').click();
  await page.getByRole('link', { name: 'Product I Sell' }).click();
  await page.getByRole('button', { name: /Add Product/ }).click();
  // Assume login & navigation to Product Form already done before this step

  await productPage.fillBasicInfo(product);
  await productPage.selectCategory(product?.product_category || '');
  await productPage.uploadImage();
  await productPage.selectCountry();
  await productPage.submitProduct();
  await productPage.verifyDetails(product);
});
