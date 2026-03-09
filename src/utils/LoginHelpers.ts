import { Page, request } from '@playwright/test';
import { getOtpFromApi, GetOtpOptions } from './GetOTPFromAPI';


// Select Country
export async function selectCountry(page: Page) {
  await page.locator('.custom-country-selector').click();
  await page.getByPlaceholder('Search country').fill('India');
  await page.locator('span.country-name', { hasText: 'India (+91)' }).click();
}


// Enter Phone Number
export async function enterPhoneNumber(page: Page, phoneNo: string) {

  await page.getByPlaceholder('Enter mobile number').fill(phoneNo);

  const continueBtn = page.getByRole('button', {
    name: 'Continue with Phone',
  });

  await continueBtn.click({ timeout: 60000 });

  console.log('✓ Continue clicked');
}


// Fetch OTP from API
export async function fetchOtp(phoneNo: string): Promise<string> {

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

  return otp;
}


// Fill OTP in UI
export async function fillOtp(page: Page, otp: string) {

  await page.locator('.forms-otp').first().waitFor({ state: 'visible' });

  for (let i = 0; i < otp.length; i++) {
    await page.locator('.forms-otp').nth(i).fill(otp[i]);
  }

  console.log('✓ OTP filled successfully');
}


// Accept Cookies if banner appears
export async function acceptCookies(page: Page) {

  try {

    const acceptCookiesButton = page.getByRole('button', {
      name: 'Accept cookies'
    });

    await acceptCookiesButton.waitFor({
      state: 'visible',
      timeout: 5000
    });

    await acceptCookiesButton.click();

    console.log('✓ Cookie banner accepted');

  } catch {
    console.log('ℹ Cookie banner not present');
  }

  const bannerBtn = page.locator('#zcb-banner .zcb-button-primary#zc-manage');

  if (await bannerBtn.isVisible()) {
    await bannerBtn.click();
  }
}