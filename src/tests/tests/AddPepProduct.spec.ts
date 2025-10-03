import { test, expect } from '@playwright/test';
import { getProductByName } from '../../utils/getProductFromCSV';
import { fetchOTP } from '../../utils/otp'; // Use relative path from authenticate.spec.ts
import { time } from 'console';


const product = getProductByName('Electric Screwdriver');

test('Authenticate test', async ({ page }) => {
  test.setTimeout(120000);
  await page.goto('http://183.82.251.239/en/authenticate');

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

  await page.getByRole('textbox', { name: 'Enter Product Name' }).click();
  await page.getByRole('textbox', { name: 'Enter Product Name' }).fill(product && product.name ? product.name : 'Electric Screwdriver');
  await page.getByRole('textbox', { name: 'Enter Text' }).click();
  await page.getByRole('textbox', { name: 'Enter Text' }).fill(product && product.description ? product.description : 'automation_test');
  await page.getByRole('textbox', { name: 'Enter SKU/Model number' }).click();
  await page.getByRole('textbox', { name: 'Enter SKU/Model number' }).fill(product && product.sku_model ? product.sku_model : 'SK');
  //await page.getByRole('combobox', { name: 'Select Ai Category' }).click();
  //await page.getByRole('combobox', { name: 'Select Ai Category' }).fill(product && product.department ? product.department : 'Tools & Hardware');
  //await page.getByRole('combobox', { name: 'Select Ai Category' }).press('Enter');
  await page.getByRole('button', { name: 'Browse Category' }).click();
  const rawDept = product?.product_category || '';
  
  const categories = rawDept ? rawDept.split('>').map(item => item.trim()) : [];
  // Example: rawDept = 'Electronics > Laptops > Gaming Laptops'
  //: ['Electronics', 'Laptops', 'Gaming Laptops'];
  //const categories = product?.product_category?.length ? product.product_category.map(item => item.trim()) : [];
  
 

  console.log('categories: ', categories);
  //const categories = rawDept.split('>').map(item => item.trim());
  
  for (const category of categories) {
   await page.locator(`//ul[@class='category-ul']//li[text()='${category}']`).click();
  }
  await page.getByRole('button', { name: 'Choose', exact: true }).click();
  await page.waitForTimeout(2000); // wait for 2 seconds to ensure category selection is processed
  const selectedSpan = page.locator("//span[text()='Selected:']/parent::div//span[2]");
  await expect(selectedSpan).toHaveText(product ? product.product_category : 'Gaming Laptops');
  console.log('actual: ', await selectedSpan.textContent());
  //console.log('expected: ', rawDept);
  
  await page.getByText('Choose File').first().click();
  await page.getByRole('button', { name: 'Drag & Drop file from computer or Choose File Upload JPG, JPEG, PNG (Max 5MB)' }).setInputFiles('images.jpg');
  await page.waitForTimeout(10000); // wait for 10 seconds to ensure file upload is processed

  await page.getByRole('button', { name: 'Select Country' }).click();
  await page.locator('form div').filter({ hasText: 'Country of Origin Select' }).getByRole('textbox').click();
  await page.locator('form div').filter({ hasText: 'Country of Origin Select' }).getByRole('textbox').fill('India');
  await page.getByRole('option', { name: 'India', exact: true }).click();

  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.waitForTimeout(10000);

  await expect(page.locator('h2.product-title-txt')).toHaveText((product && product.name) ? product.name : 'Electric Screwdriver');
  console.log("sku text: ", await page.locator('span.sku-txt').textContent());
  await expect(page.locator('span.sku-txt')).toContainText(product?.sku_model || 'SK');
  //await expect(page.locator('img')).toHaveAttribute('alt', 'assets/71ZeDArp7YVag5QVBSL6Z.jpg');
  //await expect(page.locator('img')).toHaveAttribute('src', 'https://pepagora.s3.ap-south-1.amazonaws.com/assets/71ZeDArp7YVag5QVBSL6Z.jpg');
  await expect(page.locator('img[width="380"][height="360"]')).toBeVisible();
  await expect(page.locator('img[width="64"][height="64"]')).toBeVisible();
  await expect(page.locator('span.preview-txt')).toHaveText('Main Thumbnail');

});

