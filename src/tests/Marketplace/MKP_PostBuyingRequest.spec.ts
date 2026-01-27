import { test, expect } from '@playwright/test';
import { TestLogger } from '../../utils/TestLogger';
import { MKPPostBuyingRequestPage } from '../../pages/Marketplace/MKP_PostBuyingRequestPage';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Marketplace Post Buying Request Tests', {tag: ['@marketplace_pages']}, () => {
  let buyingRequestPage: MKPPostBuyingRequestPage;
  let loginPage : LoginPage;

  test.beforeEach(async ({ page }) => {
    TestLogger.clearLogs();
    loginPage = new LoginPage(page);
    // Navigate to the marketplace post buying request page
    // await page.goto('https://www.sandbox.pepagora.org/en/');
    
    // // Wait for the form to load
    // await page.waitForLoadState('domcontentloaded');
    // await page.locator('button.btn-comp.p-btn-secoundary:has-text("Post Buying Requirement")').click();
    
    
    // Initialize the page object
    buyingRequestPage = new MKPPostBuyingRequestPage(page);

    TestLogger.log('✅ Navigated to Marketplace Post Buying Request page');
  });

  test.afterEach(async ({ page }, testInfo) => {
    await TestLogger.attachLogsToTest(testInfo);
  });

  test('Existing user - already logged in - @marketplace Fill and submit buying request form', async ({ page }) => {
   test.setTimeout(120000);
    const formData = {
      productName: 'Cotton Fabric',
      category: 'Apparel & Fashion > Cotton, Linen, Wool, Silk, Rayon > Cotton Twill Fabric',
      description: 'High quality 100% pure cotton fabric, white color, suitable for apparel manufacturing. GSM: 200, Width: 1.5m',
      orderQuantity: '500',
      unit: 'Meter'
    };
    await loginPage.enterEmailAndContinue('9591603604');
    TestLogger.info('📋 Filling Marketplace Post Buying Request Form');
    TestLogger.log(`Product: ${formData.productName}`);
    TestLogger.log(`Category: ${formData.category}`);
     await page.locator('button.btn-comp.p-btn-secoundary:has-text("Post Buying Requirement")').click();
    // Fill and submit form
    await buyingRequestPage.fillCompleteForm(formData);
    TestLogger.log('✓ Form filled successfully');

    // Verify form is valid before submission
    const hasErrors = await buyingRequestPage.hasValidationErrors();
    expect(hasErrors).toBe(false);

    TestLogger.log('📤 Submitting form...');
    
    await buyingRequestPage.submitForm();

    
    //await buyingRequestPage.clickSuccessMessageOkButton();
    TestLogger.success('✅ Buying request submitted successfully');
  });
  test('Existing user - without log in - @marketplace Fill and submit buying request form', async ({ page }) => {
    test.setTimeout(120000);
    const formData = {
      productName: 'Cotton Fabric',
      category: 'Apparel & Fashion > Cotton, Linen, Wool, Silk, Rayon > Cotton Twill Fabric',
      description: 'High quality 100% pure cotton fabric, white color, suitable for apparel manufacturing. GSM: 200, Width: 1.5m',
      orderQuantity: '500',
      unit: 'Meter'
    };
    await page.goto('https://www.sandbox.pepagora.org/en/');
    
    // Wait for the form to load
    await page.waitForLoadState('domcontentloaded');
    await page.locator('button.btn-comp.p-btn-secoundary:has-text("Post Buying Requirement")').click();
    
    TestLogger.info('📋 Filling Marketplace Post Buying Request Form');
    TestLogger.log(`Product: ${formData.productName}`);
    TestLogger.log(`Category: ${formData.category}`);

    // Fill and submit form
    await buyingRequestPage.fillCompleteForm(formData);
    TestLogger.log('✓ Form filled successfully');

    // Verify form is valid before submission
    const hasErrors = await buyingRequestPage.hasValidationErrors();
    expect(hasErrors).toBe(false);

    TestLogger.log('📤 Submitting form...');
    
    await buyingRequestPage.submitForm();
    await loginPage.enterEmailAndContinue('9632370046',false);
    TestLogger.success('✅ Buying request submitted successfully');
  });

  // test('Existing user - @marketplace Fill and submit buying request form with advanced requirements', async ({ page }) => {
  //   const formData = {
  //     productName: 'Cotton Fabric',
  //     category: 'Apparel & Fashion > Cotton, Linen, Wool, Silk, Rayon > Cotton Twill Fabric',
  //     description: 'High quality 100% pure cotton fabric, white color, suitable for apparel manufacturing. GSM: 200, Width: 1.5m',
  //     orderQuantity: '500',
  //     unit: 'Meter'
  //   };

  //   TestLogger.info('📋 Filling Marketplace Post Buying Request Form');
  //   TestLogger.log(`Product: ${formData.productName}`);
  //   TestLogger.log(`Category: ${formData.category}`);

  //   // Fill and submit form
  //   await buyingRequestPage.fillCompleteForm(formData);
  //   TestLogger.log('✓ Form filled successfully');

  //   // Verify form is valid before submission
  //   const hasErrors = await buyingRequestPage.hasValidationErrors();
  //   expect(hasErrors).toBe(false);

  //   TestLogger.log('📤 Submitting form...');
    
  //   await buyingRequestPage.submitForm();

  //   TestLogger.success('✅ Buying request submitted successfully');
  // });
  // test('Existing user - @marketplace Fill and submit buying request form - mandatory fields validation', async ({ page }) => {
  //   const formData = {
  //     productName: 'Cotton Fabric',
  //     category: 'Apparel & Fashion > Cotton, Linen, Wool, Silk, Rayon > Cotton Twill Fabric',
  //     description: 'High quality 100% pure cotton fabric, white color, suitable for apparel manufacturing. GSM: 200, Width: 1.5m',
  //     orderQuantity: '500',
  //     unit: 'Meter'
  //   };

  //   TestLogger.info('📋 Filling Marketplace Post Buying Request Form');
  //   TestLogger.log(`Product: ${formData.productName}`);
  //   TestLogger.log(`Category: ${formData.category}`);

  //   // Fill and submit form
  //   await buyingRequestPage.fillCompleteForm(formData);
  //   TestLogger.log('✓ Form filled successfully');

  //   // Verify form is valid before submission
  //   const hasErrors = await buyingRequestPage.hasValidationErrors();
  //   expect(hasErrors).toBe(false);

  //   TestLogger.log('📤 Submitting form...');
    
  //   await buyingRequestPage.submitForm();

  //   TestLogger.success('✅ Buying request submitted successfully');
  // });
});