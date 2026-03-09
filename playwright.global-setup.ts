import { chromium } from '@playwright/test';
import fs from 'fs';

import { deleteUserData } from './src/utils/ApiHelpers';

import {
  selectCountry,
  enterPhoneNumber,
  fetchOtp,
  fillOtp,
  acceptCookies
} from './src/utils/loginHelpers';


async function globalSetup() {

  const phoneNo = process.env.PHONE_NO || '9591603604';

  if (!phoneNo) {
    throw new Error('PHONE_NO is not set');
  }

  // create artifacts folder if not exists
  if (!fs.existsSync('artifacts')) {
    fs.mkdirSync('artifacts', { recursive: true });
  }

  // delete old user data
  await deleteUserData(phoneNo);

  // launch browser
  const browser = await chromium.launch({
    headless: !!process.env.CI,
    slowMo: process.env.CI ? 0 : 100
  });

  const page = await browser.newPage();

  try {

    // open login page
    await page.goto('https://sandbox.pepagora.org/en/authenticate');

    console.log('✓ Login page opened');

    // select country
    await selectCountry(page);

    // enter phone number
    await enterPhoneNumber(page, phoneNo);

    // fetch otp
    const otp = await fetchOtp(phoneNo);

    // fill otp
    await fillOtp(page, otp);

    // accept cookies
    await acceptCookies(page);

    console.log('✅ Login successful');

    // save session
    await page.context().storageState({
      path: 'auth-seller.json'
    });

  } catch (error) {

    console.error('❌ Global setup failed');

    await page.screenshot({
      path: 'artifacts/global-setup-error.png',
      fullPage: true
    });

    throw error;
  }

  await browser.close();
}

export default globalSetup;