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
import { PriceFormatter, formatDashboardPrice } from '../../../utils/PriceFormatter';
import { TestLogger } from '../../../utils/TestLogger';
import { off } from 'process';

// Bug - offer price not correct in preview page for Fixed Discount offer type
test.describe('LOW MOQ Sell Offer Flow', { tag: ['@critical']},() => {
  test('Sell Offer Flow through add new product', async ({ page }, testInfo) => {
    const addProductPreviewPage = new AddProductPreviewPage(page);
    const previewPage = new SellOfferPreviewPage(page);
    const sellOfferDashboardPage = new SellDashboardPage(page);
    const product = getProductByName('Door Wardrobes')
    const discountPercent = 25;
    const discounted = parseFloat((parseFloat(product?.unit_price || '70000') * (1 - Number(discountPercent) / 100)).toFixed(2));
    const offerMinOrderQty = '5';
    const offerMaxOrderQty = '500';
    const offerTitle = 'Test LOW MOQ Discount Offer';
    
    test.setTimeout(180000);
    let {todayFormatted, futureFormatted } = getTodayAndFutureDate(1);
      
    await test.step('Step 1: Add Product', async () => {
      TestLogger.log('🚀 Starting Step 1: Add Product for LOW MOQ Discount Sell Offer');
      
      const productPage = new SellOfferProductPage(page);
      const productInformationPage = new ProductInformationPage(page);
      const loginPage = new LoginPage(page);

      TestLogger.log('🔐 Logging in with phone number: 9632370046');
      await loginPage.enterEmailAndContinue('9632370046');
      
      await page.waitForTimeout(12000);

      TestLogger.log('📱 Navigating to Sell Offer section');
      await productPage.navigateToSellOfferSection();
      
      TestLogger.log('📦 Selected product details:', JSON.stringify(product, null, 2));
      await productPage.addNewProduct(product?.name || 'Industrial Hydraulic Pump');
      
      TestLogger.log('🏷️ Setting product category with AI selection:', product?.product_category || 'Electronics > Mobile Phones > Smartphones');
      await productInformationPage.selectAICategory(product?.product_category || 'Electronics > Mobile Phones > Smartphones');
      
      TestLogger.log('📸 Uploading product image');
      await productInformationPage.uploadImage();
      
      TestLogger.log('📝 Filling product details - Description, Brand, Price, MOQ, Unit, Currency');
      TestLogger.log(`💰 Price: ${product?.unit_price || '70000'}, MOQ: ${product?.moq || '5'}, Unit: ${product?.unit || 'Pieces'}, Currency: ${product?.currency || 'INR'}`);
      await productPage.fillProductDetails(product?.short_description||'Test Description',product?.brand || 'Samsung', product?.unit_price || '70000',product?.moq || '5',product?.unit || 'Pieces',product?.currency || 'INR');
      // product?.'brand' || Samsung
      //await productInformationPage.submitProduct();
      
      TestLogger.log('✅ Submitting product information');
      await productPage.submitProduct();
      //await page.waitForTimeout(5000);
      
      TestLogger.log('📊 Validating progress bar at 33%');
      await addProductPreviewPage.validateProgressBar('33%');
      
      TestLogger.success('✅ Step 1 completed: Product successfully added for LOW MOQ offer');
});

await test.step('Step 2: Add Offer Info', async () => {
  TestLogger.log('🎯 Starting Step 2: Add LOW MOQ Discount Offer Information');
  
  const addOfferPage = new AddSellOfferPage(page);
  const productInformationPage = new ProductInformationPage(page);
  // Step 3: Add Offer Info
  //await addOfferPage.navigateToOfferDetails();
  const randomDiscount = Math.floor(Math.random() * 100) + 1;
  
  const offerDetails = {
    offerType: 'LOW MOQ Discount' as const,
    title: offerTitle,
    description: 'Test Description',
    unitPrice: product?.unit_price || '70000',
    unit: product?.unit || 'Pieces',
    discountPercent: discountPercent,
    offerMinOrderQty: offerMinOrderQty,
    offerMaxOrderQty: offerMaxOrderQty,
    moq: product?.moq || '5',
    startDate: todayFormatted,
    endDate: futureFormatted,
    keywords: ['test', 'offer']
  };
  
  TestLogger.log('📉 Configuring LOW MOQ Discount offer with details:', JSON.stringify(offerDetails, null, 2));
  TestLogger.log(`📅 Offer valid from ${todayFormatted} to ${futureFormatted}`);
  TestLogger.log(`🔢 Original MOQ: ${product?.moq || '5'}, Offer MOQ: ${offerMinOrderQty} - ${offerMaxOrderQty} units`);
  TestLogger.log(`💵 Base price: ${product?.unit_price || '70000'}, Discount: ${discountPercent}%`);
  TestLogger.log(`🎯 Offer Title: ${offerTitle}`);
  
  await addOfferPage.fillOfferDetailsGeneric(offerDetails);
  
  TestLogger.log('✅ Submitting LOW MOQ offer configuration');
  await productInformationPage.submitProduct();
  await page.waitForTimeout(5000);
  
  TestLogger.log('📊 Validating progress bar at 66%');
  await addProductPreviewPage.validateProgressBar('66%');
  
  TestLogger.success('✅ Step 2 completed: LOW MOQ Discount offer configured');
});
await test.step('Step 3: Preview, Shipping & Validate', async () => {
  TestLogger.log('🔍 Starting Step 3: Preview, Shipping & Validation for LOW MOQ offer');
  
  const productInformationPage = new ProductInformationPage(page);
  const shippingPage = new SellOfferShippingPage(page);

  TestLogger.log('🚚 Configuring shipping details for the LOW MOQ offer');
  await shippingPage.fillShipping(product);
  
  const previewDetails = {
    offerType: 'Low MOQ Discount' as const,
    price: product?.unit_price || '70000',
    unit: product?.unit || 'Pieces',
    lowMOQ: offerMinOrderQty,
    actualMOQ: product?.moq || '5',
    offerTitle: 'Test LOW MOQ Discount Offer',
    productName: product?.name || 'Industrial Hydraulic Pump',
    productCategory: product?.product_category || 'Electronics > Mobile Phones > Smartphones'
  };
  
  TestLogger.log('🔍 Validating LOW MOQ offer preview');
  TestLogger.log(`📊 Original MOQ: ${product?.moq || '5'}, LOW MOQ offer: ${offerMinOrderQty}`);
  TestLogger.log(`💰 Price maintained at: ${product?.unit_price || '70000'} ${product?.unit || 'Pieces'}`);
  TestLogger.log('Preview validation data:', JSON.stringify(previewDetails, null, 2));
  
  await previewPage.assertSellOfferLeftSidePreview(page, previewDetails);
  
  TestLogger.log('✅ Submitting final LOW MOQ offer configuration');
  await productInformationPage.submitProduct();
  await page.waitForTimeout(5000);
  
  TestLogger.success('✅ Step 3 completed: LOW MOQ offer preview validated and submitted');
});
  await test.step('Step 4: Sell offer Detail page and Dashboard validations', async () => {
  TestLogger.log('🎯 Starting Step 4: Detailed validation of LOW MOQ Discount offer');
  
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
    offerTitle: offerTitle,
    offerDescription: 'Test Description',
    offerType: 'lowMOQ',
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
  
  TestLogger.log('📋 Validating comprehensive LOW MOQ offer details');
  TestLogger.log(`📉 Validating LOW MOQ: Original ${product?.moq || '5'} → Offer ${offerMinOrderQty}`);
  TestLogger.log(`💰 Price with discount: ${discounted} (${discountPercent}% off from ${product?.unit_price})`);
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
    offerType: 'Low MOQ Discount',
    offerTitle: offerTitle,
    offerPrice: formatDashboardPrice(product?.unit_price || '70000',product?.currency || '₹'),  // Use proper formatting
    MOQ: offerMinOrderQty,
    display: 'No',
    dateCreated: todayFormatted,
    expiringIn: futureFormatted,
    status: 'pending'
  };
  
  TestLogger.log('📈 Validating LOW MOQ offer in dashboard listing');
  TestLogger.log('Dashboard validation data:', JSON.stringify(dashboardValidationData, null, 2));
  TestLogger.log(`🎯 Key validation: MOQ reduced from ${product?.moq || '5'} to ${offerMinOrderQty}`);
  
  await sellOfferDashboardPage.validateFirstContactRow(dashboardValidationData);
  
  TestLogger.success('🎉 Step 4 completed: All LOW MOQ validations passed successfully!');
  TestLogger.success('✅ LOW MOQ Discount Sell Offer Flow completed end-to-end!');
  
  // Attach all logs to test report
  await TestLogger.attachLogsToTest(testInfo);
});
  });
});

