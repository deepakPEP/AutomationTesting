import { getOtpFromApi, GetOtpOptions } from '../utils/GetOTPFromAPI'; // Assuming you have an OTP fetcher function
import { Page, Locator, expect,APIRequestContext } from '@playwright/test';
import { request } from '@playwright/test';

export class LoginPage {
   readonly page: Page;
   readonly emailInput: Locator;
   readonly continueButton: Locator;
   readonly otpInputs: Locator;
   readonly acceptCookiesButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.continueButton = page.getByRole('button', { name: 'Continue with Email' });
    this.otpInputs = page.locator('input.forms-otp[type="text"][maxlength="1"][inputmode="numeric"]'); // Assumes OTP inputs are textboxes
    this.acceptCookiesButton = page.getByRole('button', { name: 'Accept cookies' });
  }

  // Step 1: Enter email and continue
  async enterEmailAndContinue(phoneNo:string) {
    
    
     await this.page.goto('https://sandbox.pepagora.org/en/authenticate');
    await this.page.waitForTimeout(12000); // increase this if needed
  // Focus the react-tel-input and type your number
  await expect(this.page.getByText('Welcome to Pepagora')).toBeVisible();
  const phoneInput = this.page.locator('div.react-tel-input input[type="tel"]');

  // Option 1: append after the +91 (common for IN)
  await phoneInput.click();
  //await phoneInput.press('End');          // move cursor to end
  await phoneInput.type(phoneNo);
  await phoneInput.press('End');
      // <-- your test number

  // (Optional) If you prefer to fully replace value:
 //  await phoneInput.fill(phoneNo);

  // Click the Continue with Phone button
  await this.page.locator('button:has-text("Continue with Phone")').click();
  await this.page.waitForTimeout(10000); // wait for 2 seconds
  
  const apiRequest = await request.newContext();

  // Set options for OTP API call
  const opts: GetOtpOptions = {
    url: 'http://13.234.126.192:4000/findOtp', // replace with your actual endpoint
    method: 'POST', // or 'GET' if needed
    headers: {
      'Content-Type': 'application/json',
      // add other headers if required
    },
    body: {
      phoneNo: phoneNo // example body, adjust as needed
    }
  };

  // Call the function
  const otp = await getOtpFromApi(apiRequest, opts);

  console.log('OTP:', otp);
   // Fill OTP digits into the 6 input fields (adjust as needed)
    for (let i = 0; i < otp.length; i++) {
      await this.otpInputs.nth(i).fill(otp[i]);
    }
    
     // wait for 5 seconds to ensure OTP is processed
    console.log('OTP filled successfully');
    await this.page.waitForTimeout(5000);
    await this.acceptCookiesIfPresent();
    
  }
  

async acceptCookiesIfPresent() {
  try {
    await this.acceptCookiesButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.acceptCookiesButton.click();
    console.log('✅ Cookies accepted');
  } catch (error) {
    console.log('ℹ️ Cookie banner not present or already dismissed');
  }
}
}

