
import { chromium,expect } from '@playwright/test';
import { request } from '@playwright/test';
import { getOtpFromApi, GetOtpOptions } from './src/utils/GetOTPFromAPI';
import {deleteUserData} from './src/utils/ApiHelpers' // Assuming you have an OTP fetcher function

async function globalSetup() {
  const phoneNo = process.env.PHONE_NO || '9591603604';
   if (!phoneNo) {
    throw new Error('PHONE_NO is not set');
  }
  await deleteUserData(phoneNo);
  //const browser = await chromium.launch();
   const browser = await chromium.launch({
    headless: !!process.env.CI ? true : false, // 👈 THIS is mandatory
    slowMo: process.env.CI ? 0 : 100,
  });
  // Seller login
  const sellerPage = await browser.newPage();
 // await sellerPage.goto('/login');
   await sellerPage.goto('https://sandbox.pepagora.org/en/authenticate');
   await sellerPage.waitForTimeout(12000);
  
  await console.log('Current URL:', sellerPage.url());
await sellerPage.screenshot({ path: 'setup-failure.png' });

  // Wait for welcome text
   await expect(sellerPage.getByText('Welcome to Pepagora')).toBeVisible();
   await console.log('✓ Welcome page loaded');

   await sellerPage.locator('.selected-flag').click();  // Click on the arrow button

  // Step 2: Wait for the country list to be visible
  const countryList = sellerPage.locator('.country-list');
  await expect(countryList).toBeVisible();  // Wait for the dropdown to be visible
  
  // Step 3: Select India from the dropdown
  await sellerPage.locator('.country[data-country-code="in"]').click();  // Click on the India option
  
  // Step 4: Validate if India was selected by checking the selected flag or the dial code
  const selectedFlag = await sellerPage.locator('.selected-flag[title="India: + 91"]');
  await expect(selectedFlag).toBeVisible();  // Verify India is selected

      // Get phone input field
      const phoneInput = sellerPage.locator('div.react-tel-input input[type="tel"]');
      await phoneInput.waitFor({ state: 'visible', timeout: 5000 });

      
      // Enter phone number
      await phoneInput.click();
      await phoneInput.type(phoneNo);
      await phoneInput.press('End');
      console.log(`✓ Phone number entered: ${phoneNo}`);

      // Click Continue with Phone button
      const continuePhoneBtn = sellerPage.locator('button:has-text("Continue with Phone")');
      await continuePhoneBtn.click({timeout:60000});
      await sellerPage.waitForTimeout(10000);
      console.log('✓ Continue clicked');

      // Fetch OTP from API
      const apiRequest = await request.newContext();
      const opts: GetOtpOptions = {
        url: 'http://13.234.126.192:4000/findOtp/sandbox',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          phoneNo: phoneNo,
        },
      };

      const otp = await getOtpFromApi(apiRequest, opts);
      console.log(`✓ OTP fetched: ${otp}`);

      // Fill OTP into input fields
      for (let i = 0; i < otp.length; i++) {
        await sellerPage.locator('.forms-otp').nth(i).fill(otp[i]);
        await sellerPage.waitForTimeout(200);
      }
      console.log('✓ OTP filled successfully');

      await sellerPage.waitForTimeout(5000);
      await acceptCookiesIfPresent(sellerPage);

      console.log('✅ Login successful with OTP');
    
  await sellerPage.context().storageState({ path: 'auth-seller.json' });

  await browser.close();
}
async function acceptCookiesIfPresent(page: any) {
  try {
    const acceptCookiesButton = await page.getByRole('button', { name: 'Accept cookies' });
    await acceptCookiesButton.waitFor({ state: 'visible', timeout: 5000 });
    await acceptCookiesButton.click();
    console.log('✅ Cookies accepted');
  } catch (error) {
    console.log('ℹ️ Cookie banner not present or already dismissed');
  }
  const acceptButton = await page.locator('#zcb-banner .zcb-button-primary#zc-manage');

// Check if the accept button is visible before clicking
if (await acceptButton.isVisible()) {
  await acceptButton.click();
} else {
  console.log("Accept button is not visible.");
}

}

export default globalSetup;
