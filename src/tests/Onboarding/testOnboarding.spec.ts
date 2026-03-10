import { test, expect } from '@playwright/test';
import { Onboarding } from '../../pages/Onboarding/OnboardingPage';
import { MyPepagoraPage } from '../../pages/Onboarding/MyPepagoraPage';
import {fetchOtp,fillOtp,acceptCookies} from '../../utils/LoginHelpers';
import {AssertionBusinessProfilePage} from '../../pages/BusinessProfile/AssertionBusinessProfilePage';
const {readAndManageUserMails} = require('../Email_Triggers/readAndDeleteMail');

let onboarding: Onboarding;
let myPepagoraPage: MyPepagoraPage;
let assertionBusinessProfilePage: AssertionBusinessProfilePage;
import { deleteUserByPhone } from '../../utils/ApiHelpers';

let phoneNo = process.env.PHONE_NO || '1400000006';

test('Seller User Onboarding', { tag: ['@onboarding'] }, async ({ page }) => {
  test.setTimeout(120000); // Set timeout to 2 minutes for this test
 deleteUserByPhone(page.request, phoneNo);
 let email = 'automationsellerpepagora@gmail.com';
 let appPassword = process.env.SELLER_EMAIL_APP_PASSWORD || 'jiry lleq qclu rhjl';
  onboarding = new Onboarding(page);
  myPepagoraPage = new MyPepagoraPage(page);
  assertionBusinessProfilePage = new AssertionBusinessProfilePage(page);

  await page.goto('https://sandbox.pepagora.org/en/authenticate');
  await onboarding.fillMobileNumberAndSubmit(phoneNo);
  await page.waitForTimeout(5000); // Wait for OTP to be generated
  const otp = await fetchOtp(phoneNo);

  await fillOtp(page, otp);
  await onboarding.selectServiceOption('Sell');
  await acceptCookies(page);
  await onboarding.fillAboutYourselfForm('John', 'Doe', email, 'Automation Inc');
  await page.waitForTimeout(10000); // Wait for onboarding to complete and navigation to My Pepagora page
  await myPepagoraPage.clickProfileIcon();
   await page.waitForTimeout(2000);
   await myPepagoraPage.assertProfileIconDetails({
    name: 'John Doe',
    company: 'Automation Inc',
    plan: 'Free'
  });
  await myPepagoraPage.closeSidebar();
  // selling mode assertion need to be done
  await myPepagoraPage.clickBusinessProfile();
  await page.waitForTimeout(5000); // Wait for Business Profile page to load
  await assertionBusinessProfilePage.clickGetVerifiedPopup();
  
  await assertionBusinessProfilePage.assertBusinessDetails({
    businessName: 'Automation Inc',
    ownerName: 'John Doe',
    mobile: phoneNo,
    email: email
  });
  await page.waitForTimeout(10000); // Wait for navigation to complete
  await readAndManageUserMails({
    email: 'automationsellerpepagora@gmail.com',
    appPassword:'jiry lleq qclu rhjl',
    subjectSearch: 'Registration Confirmation Welcome to Pepagora',
    expectedValues: [
      "Hi John Doe",
      "Welcome to Pepagora",
      "To Grow Your Sales (Selling)",
      "To Streamline Your Sourcing (Buying):",
      "Add your First Product Now",
      "Find Products to Source",
      "Set Up My Profile",
    ],deleteAfterRead: true
  });
  
});
test('Buyer User Onboarding', { tag: ['@onboarding'] }, async ({ page }) => {
  test.setTimeout(120000); // Set timeout to 2 minutes for this test
 deleteUserByPhone(page.request, phoneNo);
 let email = 'automationsellerpepagora@gmail.com';
 let appPassword = process.env.SELLER_EMAIL_APP_PASSWORD || 'jiry lleq qclu rhjl';
  onboarding = new Onboarding(page);
  myPepagoraPage = new MyPepagoraPage(page);
  assertionBusinessProfilePage = new AssertionBusinessProfilePage(page);

  await page.goto('https://sandbox.pepagora.org/en/authenticate');
  await onboarding.fillMobileNumberAndSubmit(phoneNo);
  await page.waitForTimeout(5000); // Wait for OTP to be generated
  const otp = await fetchOtp(phoneNo);

  await fillOtp(page, otp);
  await onboarding.selectServiceOption('Buy');
  await acceptCookies(page);
  await onboarding.fillAboutYourselfForm('John', 'Doe', email, 'Automation Inc');
  await page.waitForTimeout(10000); // Wait for onboarding to complete and navigation to My Pepagora page
  await myPepagoraPage.clickProfileIcon();
   await page.waitForTimeout(2000);
   await myPepagoraPage.assertProfileIconDetails({
    name: 'John Doe',
    company: 'Automation Inc',
    plan: 'Free'
  });
  await myPepagoraPage.closeSidebar();
  // selling mode assertion need to be done
  await myPepagoraPage.clickBusinessProfile();
  await page.waitForTimeout(5000); // Wait for Business Profile page to load
  await assertionBusinessProfilePage.clickGetVerifiedPopup();
  
  await assertionBusinessProfilePage.assertBusinessDetails({
    businessName: 'Automation Inc',
    ownerName: 'John Doe',
    mobile: phoneNo,
    email: email
  });
  await page.waitForTimeout(10000); // Wait for navigation to complete
  await readAndManageUserMails({
    email: 'automationbuyerpepagora@gmail.com',
    appPassword:'zfpm eruc ygjr tgfr',
    subjectSearch: 'Registration Confirmation Welcome to Pepagora',
    expectedValues: [
      "Hi John Doe",
      "Welcome to Pepagora",
      "To Grow Your Sales (Selling)",
      "To Streamline Your Sourcing (Buying):",
      "Add your First Product Now",
      "Find Products to Source",
      "Set Up My Profile",
    ],deleteAfterRead: true
  });
  
});
test('Both User Onboarding', { tag: ['@onboarding'] }, async ({ page }) => {
  test.setTimeout(120000); // Set timeout to 2 minutes for this test
 deleteUserByPhone(page.request, phoneNo);
 let email = 'automationsellerpepagora@gmail.com';
 let appPassword = process.env.SELLER_EMAIL_APP_PASSWORD || 'jiry lleq qclu rhjl';
  onboarding = new Onboarding(page);
  myPepagoraPage = new MyPepagoraPage(page);
  assertionBusinessProfilePage = new AssertionBusinessProfilePage(page);

  await page.goto('https://sandbox.pepagora.org/en/authenticate');
  await onboarding.fillMobileNumberAndSubmit(phoneNo);
  await page.waitForTimeout(5000); // Wait for OTP to be generated
  const otp = await fetchOtp(phoneNo);

  await fillOtp(page, otp);
  await onboarding.selectServiceOption('Both');
  await acceptCookies(page);
  await onboarding.fillAboutYourselfForm('John', 'Doe', email, 'Automation Inc');
  await page.waitForTimeout(10000); // Wait for onboarding to complete and navigation to My Pepagora page
  await myPepagoraPage.clickProfileIcon();
   await page.waitForTimeout(2000);
   await myPepagoraPage.assertProfileIconDetails({
    name: 'John Doe',
    company: 'Automation Inc',
    plan: 'Free'
  });
  await myPepagoraPage.closeSidebar();
  // selling mode assertion need to be done
  await myPepagoraPage.clickBusinessProfile();
  await page.waitForTimeout(5000); // Wait for Business Profile page to load
  await assertionBusinessProfilePage.clickGetVerifiedPopup();
  
  await assertionBusinessProfilePage.assertBusinessDetails({
    businessName: 'Automation Inc',
    ownerName: 'John Doe',
    mobile: phoneNo,
    email: email
  });
  await page.waitForTimeout(10000); // Wait for navigation to complete
  await readAndManageUserMails({
    email: 'automationbothpepagora@gmail.com',
    appPassword:'flei xqth ysye cqav',
    subjectSearch: 'Registration Confirmation Welcome to Pepagora',
    expectedValues: [
      "Hi John Doe",
      "Welcome to Pepagora",
      "To Grow Your Sales (Selling)",
      "To Streamline Your Sourcing (Buying):",
      "Add your First Product Now",
      "Find Products to Source",
      "Set Up My Profile",
    ],deleteAfterRead: true
  });
  
});
