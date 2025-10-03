import { test, expect } from '@playwright/test';
import { Onboarding } from '../../pages/Onboarding/OnboardingPage';
import { PersonalDetailsPage } from '../../pages/Settings/PersonalDetailsPage';
import { SettingsPage } from '../../pages/Settings/SettingsDashboard';
import { AssertionBusinessProfilePage } from '../../pages/BusinessProfile/AssertionBusinessProfilePage';
let onboarding: Onboarding;
let personalDetailsPage: PersonalDetailsPage;
let settingsPage: SettingsPage;
let assertionBusinessProfilePage: AssertionBusinessProfilePage;

test.beforeEach(async ({ page }) => {
  // Navigate to the onboarding page before each test
  onboarding = new Onboarding(page);
  personalDetailsPage = new PersonalDetailsPage(page);
  settingsPage = new SettingsPage(page);
  assertionBusinessProfilePage = new AssertionBusinessProfilePage(page);
  test.setTimeout(120000);
  await page.goto('https://sandbox.pepagora.org/en/authenticate');
  await page.waitForTimeout(60000);
}); // optional: increase if OTP delays

test('Buyer User Onboarding with unregistered business', async ({ page }) => {
 await onboarding.assertOnboardingOptions();
 await onboarding.selectServiceOption('Buy Products');
  await onboarding.selectBusinessType('unregister');
  await onboarding.assertSourcingDetailsStep();
  await onboarding.fillSourcingDetailsForm({
    firstName: 'AutoFirstName',
    middleName: '',
    lastName: 'AutoLastName',
    workEmail: 'auto@example.com',
    industry: 'Apparel & Fashion',
    productsISource: ['Lcd Tv', 'Electric Screwdriver'],
    website: '',
    businessName: 'AutoTestBusinessName'
  });
  await onboarding.assertBuyerDashboard('AutoFirstName'+' '+'AutoLastName');
  await settingsPage.clickSettingsSidebarIcon();
  //await settingsPage.assertSettingsCards();
  await settingsPage.clickSettingsCard('Profile');
  expect(await personalDetailsPage.getFirstNameValue()).toBe('AutoFirstName');
  expect(await personalDetailsPage.getLastNameValue()).toBe('AutoLastName');

});
// test('Buyer User Onboarding with registered business', async ({ page }) => {
//   await onboarding.assertOnboardingOptions();
//   await onboarding.selectServiceOption('Buy Products');
//   await onboarding.selectBusinessType('register');
//   await onboarding.assertSourcingDetailsStep();
//   await onboarding.fillSourcingDetailsForm({
//     firstName: 'AutoFirstName',
//     middleName: '',
//     lastName: 'AutoLastName',
//     workEmail: 'auto@example.com',
//     industry: 'Apparel & Fashion',
//     productsISource: ['Lcd Tv', 'Electric Screwdriver'],
//     website: 'https://autoexample.com',
//     businessName: 'AutoBusinessName'
//   });
//   await onboarding.assertBuyerDashboard();
// });
// test('Buyer User Onboarding with nonprofit organization', async ({ page }) => {
//   await onboarding.assertOnboardingOptions();
//   await onboarding.selectServiceOption('Buy Products');
//   await onboarding.selectBusinessType('nonprofit');
//   await onboarding.assertSourcingDetailsStep();
//   await onboarding.fillSourcingDetailsForm({
//     firstName: 'AutoFirstName',
//     middleName: '',
//     lastName: 'AutoLastName',
//     workEmail: 'auto@example.com',
//     industry: 'Apparel & Fashion',
//     productsISource: ['Lcd Tv', 'Electric Screwdriver'],
//     website: 'https://autoexample.com',
//     businessName: 'AutoBusinessName'
//   });
//   await onboarding.assertBuyerDashboard();
// });
// test('Seller User Onboarding with registered user', async ({ page }) => {
//       await onboarding.assertOnboardingOptions();
//   await onboarding.selectServiceOption('Sell Products');
//   await onboarding.selectBusinessType('register');
//   await onboarding.assertBusinessInformationStep();
//   await onboarding.fillBusinessInformationFormWithRegisteredUser({
//     firstName: 'AutoFirstName',
//     middleName: '',
//     lastName: 'AutoLastName',
//     workEmail: '
//     businessName: 'AutoBusinessName',
//     website: 'https://autoexample.com',
//     industry: 'Apparel & Fashion',
//     productsISell: ['Lcd Tv', 'Electric Screwdriver']
//   });
//   await onboarding.assertSellerDashboard();
// });


  
// });
// test('Seller User Onboarding with Unregistered business', async ({ page }) => {
//     const onboarding = new Onboarding(page);
//   test.setTimeout(120000);
//   await page.goto('http://183.82.251.239/en/authenticate');

//   await page.waitForTimeout(10000); // optional: increase if OTP delays

  
// });
// test('Seller User Onboarding with registered business', async ({ page }) => {
//     const onboarding = new Onboarding(page);
//   test.setTimeout(120000);
//   await page.goto('http://183.82.251.239/en/authenticate');

//   await page.waitForTimeout(10000); // optional: increase if OTP delays

  
// });
// test('Seller User Onboarding with non profit organisation', async ({ page }) => {
//     const onboarding = new Onboarding(page);
//   test.setTimeout(120000);
//   await page.goto('http://183.82.251.239/en/authenticate');

//   await page.waitForTimeout(10000); // optional: increase if OTP delays

  
// });
// test('Buyer and Seller both User Onboarding with registered business', async ({ page }) => {
//     const onboarding = new Onboarding(page);
//   test.setTimeout(120000);
//   await page.goto('http://183.82.251.239/en/authenticate');

//   await page.waitForTimeout(10000); // optional: increase if OTP delays

  
// });
// test('Buyer and Seller both User Onboarding with Unregistered business', async ({ page }) => {
//     const onboarding = new Onboarding(page);
//   test.setTimeout(120000);
//   await page.goto('http://183.82.251.239/en/authenticate');

//   await page.waitForTimeout(10000); // optional: increase if OTP delays

  
// });
// test('Buyer and Seller both User Onboarding with non profit organisation', async ({ page }) => {
//     const onboarding = new Onboarding(page);
//   test.setTimeout(120000);
//   await page.goto('http://183.82.251.239/en/authenticate');

//   await page.waitForTimeout(10000); // optional: increase if OTP delays

  
// });

