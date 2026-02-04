// tests/SellOfferFlowTest.spec.ts

import { test, expect } from '@playwright/test';

import { SellOfferProductPage } from '../../../pages/SellOffer/SellOfferProductPage';
import { AddSellOfferPage } from '../../../pages/ProductISell/AddSellOfferPage'
import { SellOfferPreviewPage } from '../../../pages/SellOffer/SellOfferPreviewPage';
import { SellOfferShippingPage } from '../../../pages/SellOffer/SellOfferShippingPage';
import { getProductByName } from '../../../utils/getProductFromCSV'; 
import { ProductInformationPage } from '../../../pages/ProductISell/AddProductInfoPage';
import { AddProductPreviewPage } from '../../../pages/ProductISell/AddProductPreviewPage';
import { getTodayAndFutureDate} from '../../../utils/Dateutlis';
import { SellDashboardPage } from '../../../pages/SellOffer/SellOfferDashboardPage';
import { LoginPage } from '../../../pages/LoginPage';
import { TestLogger } from '../../../utils/TestLogger';

test.use({ storageState: 'auth-seller.json' });
// Bug - offer price not correct in preview page for Fixed Discount offer type
// 40 testcases covered in this single e2e
test.describe('Fixed Discount Sell Offer Flow',  { tag: ['@critical', '@selloffer_flow'] }, () => {
  test('Sell Offer Flow through add new product', async ({ page }, testInfo) => {
    const addProductPreviewPage = new AddProductPreviewPage(page);
    const previewPage = new SellOfferPreviewPage(page);
    const sellOfferDashboardPage = new SellDashboardPage(page);
    const product = getProductByName('Door Wardrobes')
    const discountPercent = 10;
    const discounted = parseFloat((parseFloat(product?.unit_price || '70000') * (1 - Number(discountPercent) / 100)).toFixed(2));
    const offerMinOrderQty = '20';
    const offerMaxOrderQty = '50';
    const loginPage = new LoginPage(page);

    test.setTimeout(180000);
    let {todayFormatted, futureFormatted } = getTodayAndFutureDate(15);
      
    await test.step('Step 1: Add Product', async () => {
      TestLogger.log('🚀 Starting Step 1: Add Product for Fixed Discount Sell Offer');
      
      const productPage = new SellOfferProductPage(page);
      const productInformationPage = new ProductInformationPage(page);
      
      TestLogger.log('🔐 Logging in with phone number: 9632370046');
      //await loginPage.enterEmailAndContinue('9632370046');
      await page.goto('https://www.sandbox.pepagora.org/app/sales-sell-offer/form');
      await loginPage.acceptCookiesIfPresent();  
      await page.waitForTimeout(1200);

      TestLogger.log('📱 Navigating to Sell Offer section');
      //This method not working dueto locator issue
      //await productPage.navigateToSellOfferSection();
      
      TestLogger.log('📦 Selected product details:', JSON.stringify(product, null, 2));
      await productPage.addNewProduct(product?.name || 'Industrial Hydraulic Pump');
      
      TestLogger.log('🏷️ Setting product category:', product?.product_category || 'Electronics > Mobile Phones > Smartphones');
      await productInformationPage.browseCategory(product?.product_category || 'Electronics > Mobile Phones > Smartphones');
      
      TestLogger.log('📸 Uploading product image');
      await productInformationPage.uploadImage();
      
      TestLogger.log('📝 Filling product details - Description, Brand, Price, MOQ, Unit');
      await productPage.fillProductDetails(product?.short_description||'Test Description',product?.brand || 'Samsung', product?.unit_price || '70000',product?.moq || '5',product?.unit || 'Pieces');
      // product?.'brand' || Samsung
      //await productInformationPage.submitProduct();
      
      TestLogger.log('✅ Submitting product information');
      await productPage.submitProduct();
      //await page.waitForTimeout(5000);
      
      TestLogger.log('📊 Validating progress bar at 33%');
      await addProductPreviewPage.validateProgressBar('33%');
      await productInformationPage.validateProductAddStepCompletion('Product Details');
      TestLogger.success('✅ Step 1 completed: Product successfully added');
});

await test.step('Step 2: Add Offer Info', async () => {
  TestLogger.log('🎯 Starting Step 2: Add Fixed Discount Offer Information');
  
  const addOfferPage = new AddSellOfferPage(page);
  const productInformationPage = new ProductInformationPage(page);
  // Step 3: Add Offer Info
  
  const randomDiscount = Math.floor(Math.random() * 100) + 1;
  
  const offerDetails = {
    offerType: 'Fixed Discount' as const,
    title: 'Test Fixed Discount Offer',
    description: 'Test Description',
    unitPrice: product?.unit_price || '70000',
    unit: product?.unit || 'Pieces',
    discountPercent: 10,
    offerMinOrderQty: offerMinOrderQty,
    offerMaxOrderQty: offerMaxOrderQty,
    startDate: todayFormatted,
    endDate: futureFormatted,
    keywords: ['test', 'offer']
  };
  
  TestLogger.log('💰 Configuring Fixed Discount offer with details:', JSON.stringify(offerDetails, null, 2));
  TestLogger.log(`📅 Offer valid from ${todayFormatted} to ${futureFormatted}`);
  TestLogger.log(`🔢 MOQ range: ${offerMinOrderQty} - ${offerMaxOrderQty} units`);
  TestLogger.log(`💵 Base price: ${product?.unit_price || '70000'}, Discount: 10%`);
  
  await addOfferPage.fillOfferDetailsGeneric(offerDetails);
  
  TestLogger.log('✅ Submitting offer configuration');
  await productInformationPage.submitProduct();
  await page.waitForTimeout(5000);
  
  TestLogger.log('📊 Validating progress bar at 66%');
  await addProductPreviewPage.validateProgressBar('66%');
  await productInformationPage.validateProductAddStepCompletion('Offer Details');
  TestLogger.success('✅ Step 2 completed: Fixed Discount offer configured');
});
await test.step('Step 3: Preview, Shipping & Validate', async () => {
  TestLogger.log('🔍 Starting Step 3: Preview, Shipping & Validation');
  
  const productInformationPage = new ProductInformationPage(page);
  const shippingPage = new SellOfferShippingPage(page);

  TestLogger.log('🚚 Configuring shipping details for the offer');
  await shippingPage.fillShipping(product);
  
  const previewDetails = {
    offerType: 'Fixed Discount' as const,
    price: discounted.toString() || '70000',
    unit: product?.unit || 'Pieces',
    strikedPrice: product?.unit_price,
    discountPercent: discountPercent.toString(),
    offerTitle: 'Test Fixed Discount Offer',
    productName: product?.name || 'Industrial Hydraulic Pump',
    productCategory: product?.product_category || 'Electronics > Mobile Phones > Smartphones'
  };
  
  TestLogger.log('🔍 Validating offer preview with calculated discount price');
  TestLogger.log(`💰 Original price: ${product?.unit_price}, Discounted price: ${discounted.toString()}`);
  TestLogger.log(`📊 Discount: ${discountPercent}%, Final price: ${discounted}`);
  
  await previewPage.assertSellOfferLeftSidePreview(page, previewDetails);
  
  TestLogger.log('✅ Submitting final offer configuration');
  await productInformationPage.submitProduct();
  await page.waitForTimeout(5000);
  
  TestLogger.success('✅ Step 3 completed: Preview validated and offer submitted');
});
  await test.step('Step 4: Sell offer Detail page and Dashboard validations', async () => {
  TestLogger.log('🎯 Starting Step 4: Detailed validation of Fixed Discount offer');
  
  // // Final: Confirm URL
  TestLogger.log('🌐 Verifying navigation to sell offer details page');
  await expect(page).toHaveURL(/.*sales-sell-offer.*/);
  
  const offerValidationData = {
    name: product?.name || 'Industrial Hydraulic Pump',
    category: product?.product_category || 'Industrial Equipment & Machinery > Hydraulic & Pneumatic Equipment > Hand Operated Hydraulic Pumps',
    brand: product?.brand || 'HydroMax',
    productDescription: product?.short_description || 'Test Description',
    currency: product?.currency || '₹ - INR',
    basePrice: product?.unit_price || '₹500',
    moq: product?.moq || '2 pieces',
    offerTitle: 'Test Fixed Discount Offer',
    offerDescription: 'Test Description',
    offerType: 'fixedDiscount',
    offerMinOrderQty: offerMinOrderQty,
    offerMaxOrderQty: offerMaxOrderQty,
    offerPrice: discounted.toString() || '₹500',
    dateCreated: todayFormatted,
    offerValidTill: futureFormatted,
    paymentTerms: product?.payment_terms || '100% Advance',
    paymentMethods: product?.payment_methods || 'Credit Card',
    shippingModes: product?.shipping_modes || 'Sea, Air',
    dispatchLeadTime: product?.dispatch_lead_time || 'Ships in 3-3 Days',
    shipsInternationally: product?.ships_internationally || 'yes'
  };
  
  TestLogger.log('📋 Validating comprehensive offer details');
  TestLogger.log(`💰 Validating discounted price: Original ${product?.unit_price} → Discounted ${discounted}`);
  TestLogger.log(`📅 Validating offer duration: ${todayFormatted} to ${futureFormatted}`);
  
  await previewPage.assertViewDetailsSellOffer(offerValidationData);
  
  TestLogger.log('📊 Validating right panel analytics and progress information');
  await previewPage.assertViewDetailsRightInfoSection({
    analyticsView: '0',
    progressText: 'Completed 100%',
    status: 'pending'
  });

  TestLogger.log('⬅️ Navigating back to dashboard');
  await previewPage.clickPreviousButton();

  const dashboardValidationData = {
    productName: product?.name || 'Industrial Hydraulic Pump',
    offerType: 'Fixed Discount',
    offerTitle: 'Test Fixed Discount Offer',
    offerPrice: '₹ ' + discounted.toString() +' / per Unit'|| '₹500',
    MOQ: offerMinOrderQty,
    display: 'No',
    dateCreated: todayFormatted,
    expiringIn: futureFormatted,
    status: 'pending'
  };
  
  TestLogger.log('📈 Validating offer in dashboard listing');
  TestLogger.log('Dashboard validation data:', JSON.stringify(dashboardValidationData, null, 2));
  
  await sellOfferDashboardPage.validateFirstContactRow(dashboardValidationData);
  
  TestLogger.success('🎉 Step 4 completed: All validations passed successfully!');
  TestLogger.success('✅ Fixed Discount Sell Offer Flow completed end-to-end!');
  
  // Attach all logs to test report
  await TestLogger.attachLogsToTest(testInfo);
});
  });
});

