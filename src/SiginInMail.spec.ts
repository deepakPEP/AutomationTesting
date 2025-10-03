import { test, expect } from '@playwright/test';
import { getProductByName } from './utils/getProductFromCSV';
import { fetchOTP } from './utils/otp'; // Use relative path from authenticate.spec.ts


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
  await page.waitForTimeout(50000); // wait for 50 seconds
  //await page.waitForTimeout(3000); // wait for 3 seconds
  console.log('OTP filled successfully'); 
  // Proceed to rest of flow
 // await page.pause() // wait for 3 seconds
  await page.waitForTimeout(10000);
  await page.locator('div').filter({ hasText: /^Sales$/ }).getByRole('img').click();
  await page.getByRole('link', { name: 'Product I Sell' }).click();
  await page.getByRole('button', { name: /Add Product/ }).click();
});

//getByRole('heading', { name: 'Welcome to Pepagora Dashboard' })
//getByRole('textbox', { name: 'Enter text' })
// import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//   await page.goto('http://183.82.251.239/en/authenticate');
//   await page.getByRole('textbox', { name: 'Email' }).click();
//   await page.getByRole('textbox', { name: 'Email' }).fill('anusuya');
//   await page.getByRole('textbox', { name: 'Email' }).click();
//   await page.getByRole('textbox', { name: 'Email' }).fill('anusuya2011cse@gmail.com');
//   await page.getByRole('button', { name: 'Continue with Email' }).click();
//   await page.locator('.forms-otp').first().click();
//   await page.getByRole('textbox', { name: '1 (702) 123-' }).click();
//   await page.getByRole('textbox', { name: '1 (702) 123-' }).fill('+91 96323-70046');
//   await page.getByRole('button', { name: 'Continue' }).click();
//   await page.locator('.forms-otp').first().click();
//   await page.locator('.forms-otp').first().fill('1');
//   await page.locator('input:nth-child(2)').first().fill('9');
//   await page.locator('input:nth-child(3)').first().fill('1');
//   await page.locator('div:nth-child(3) > input').first().fill('5');
//   await page.locator('div:nth-child(3) > input:nth-child(2)').fill('07');
//   await page.locator('div:nth-child(3) > input:nth-child(2)').click();
//   await page.locator('div:nth-child(3) > input:nth-child(2)').press('ArrowRight');
//   await page.locator('div:nth-child(3) > input:nth-child(2)').press('Tab');
//   await page.locator('div:nth-child(3) > input:nth-child(3)').fill('7');
//   await page.locator('div:nth-child(3) > input:nth-child(2)').click();
//   await page.locator('div:nth-child(3) > input:nth-child(2)').fill('0');
//   await page.getByRole('heading', { name: 'Welcome to Pepagora Dashboard' }).click({
//     button: 'right'
//   });
//   await page.getByRole('heading', { name: 'Welcome to Pepagora Dashboard' }).click();
//   await page.locator('span').filter({ hasText: 'Sales' }).first().click();
//   await page.getByRole('link', { name: 'Product I Sell' }).click();
//   await page.getByRole('button', { name: 'Add Product Add Product' }).click();
//   await page.getByRole('textbox', { name: 'Enter Product Name' }).click();
//   await page.getByRole('textbox', { name: 'Enter Product Name' }).fill('Electric Screwdriver');
//   await page.getByRole('textbox', { name: 'Enter Text' }).click();
//   await page.getByRole('textbox', { name: 'Enter Text' }).fill('automation_test');
//   await page.getByRole('textbox', { name: 'Enter SKU/Model number' }).click();
//   await page.getByRole('textbox', { name: 'Enter SKU/Model number' }).fill('SK');
//   await page.getByRole('textbox', { name: 'Enter SKU/Model number' }).click();
//   await page.getByRole('textbox', { name: 'Enter SKU/Model number' }).click();
//   await page.getByRole('textbox', { name: 'Enter SKU/Model number' }).press('Shift+ArrowLeft');
//   await page.getByRole('textbox', { name: 'Enter SKU/Model number' }).press('Shift+ArrowLeft');
//   await page.getByRole('textbox', { name: 'Enter SKU/Model number' }).fill('ESD-1001');
//   await page.getByRole('combobox', { name: 'Select Ai Category' }).click();
//   await page.getByRole('combobox', { name: 'Select Ai Category' }).fill('Tools & Hardware');
//   await page.getByRole('combobox', { name: 'Select Ai Category' }).press('Enter');
//   await page.getByText('Save & Continue LaterContinue').click();
//   await page.getByRole('button', { name: 'Continue', exact: true }).click();
//   await page.getByRole('button', { name: 'Continue', exact: true }).click();
//   await page.getByRole('button', { name: 'Continue', exact: true }).click();
//   await page.getByText('Choose File').first().click();
//   await page.getByText('Choose File').first().click();
//   await page.getByRole('button', { name: 'Drag & Drop file from computer or Choose File Upload JPG, JPEG, PNG (Max 5MB)' }).setInputFiles('images.jpg');
//   await page.getByRole('button', { name: 'Select Country' }).click();
//   await page.locator('form div').filter({ hasText: 'Country of Origin Select' }).getByRole('textbox').click();
//   await page.locator('form div').filter({ hasText: 'Country of Origin Select' }).getByRole('textbox').fill('India');
//   await page.getByRole('option', { name: 'India', exact: true }).click();
//   await page.getByRole('button', { name: 'Continue', exact: true }).click();
//   await page.getByRole('button', { name: 'Browse Category' }).click();
//   await page.getByText('Electronics').click();
//   await page.getByText('Laptops').click();
//   await page.getByText('Gaming Laptops').click();
//   await page.getByRole('button', { name: 'Choose', exact: true }).click();
//   await page.getByRole('button', { name: 'Continue', exact: true }).click();
// });

