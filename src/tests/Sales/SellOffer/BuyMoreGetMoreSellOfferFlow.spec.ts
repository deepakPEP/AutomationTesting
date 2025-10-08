// tests/SellOfferFlowTest.spec.ts
import { LoginPage } from '../../../pages/LoginPage';
import { test, expect } from '@playwright/test';
import { TestLogger } from '../../../utils/TestLogger';
import { SellOfferProductPage } from '../../../pages/SellOffer/SellOfferProductPage';
import { AddSellOfferPage } from '../../../pages/ProductISell/AddSellOfferPage'
import { SellOfferPreviewPage } from '../../../pages/SellOffer/SellOfferPreviewPage';
import { SellOfferShippingPage } from '../../../pages/SellOffer/SellOfferShippingPage';
import { getProductByName } from '../../../utils/getProductFromCSV'; 
import { ProductInformationPage } from '../../../pages/ProductISell/AddProductInfoPage';
import { AddProductPreviewPage } from '../../../pages/ProductISell/AddProductPreviewPage';
import { getTodayAndFutureDate} from '../../../utils/Dateutlis';
import { SellDashboardPage } from '../../../pages/SellOffer/SellOfferDashboardPage';
//
test.describe('Buy More Get More Sell Offer Flow', { tag: ['@critical'] }, () => {
  test('Sell Offer Flow through add new product', async ({ page }, testInfo) => {
    // Initialize TestLogger for this test
    TestLogger.info('🚀 Starting Buy More Get More Sell Offer Flow test');
    TestLogger.log(`Test Product: Will load Industrial Hydraulic Pump from CSV`);
    
    const addProductPreviewPage = new AddProductPreviewPage(page);
    const previewPage = new SellOfferPreviewPage(page);
    const sellOfferDashboardPage = new SellDashboardPage(page);
    const productInformationPage = new ProductInformationPage(page);
    const product = getProductByName('Industrial Hydraulic Pump')
    test.setTimeout(180000);
    let {todayFormatted, futureFormatted } = getTodayAndFutureDate(1);
    TestLogger.log(`📅 Date range: ${todayFormatted} to ${futureFormatted}`);
      
    await test.step('Step 1: Add Product', async () => {
      TestLogger.info('📦 Step 1: Adding Product for Sell Offer');
      const productPage = new SellOfferProductPage(page);
      
      const loginPage = new LoginPage(page);

      TestLogger.log('🔐 Logging in with phone number: 9632370046');
      await loginPage.enterEmailAndContinue('9632370046');
      
      await page.waitForTimeout(12000);

      TestLogger.log('🛍️ Navigating to Sell Offer section');
      await productPage.navigateToSellOfferSection();
      TestLogger.log(`📋 Product details loaded: ${product?.name || 'Industrial Hydraulic Pump'}`);
      await productPage.addNewProduct(product?.name || 'Industrial Hydraulic Pump');
      TestLogger.log(`🏷️ Product category: ${product?.product_category}`);
      await productInformationPage.browseCategory(product?.product_category || 'Electronics > Mobile Phones > Smartphones');
      
      TestLogger.log('📸 Uploading product image');
      await productInformationPage.uploadImage();
      
      TestLogger.log(`💰 Filling product details - Price: ${product?.unit_price || '70000'}, MOQ: ${product?.moq || '5'}, Brand: ${product?.brand || 'Samsung'}`);
      await productPage.fillProductDetails(product?.short_description||'Test Description',product?.brand || 'Samsung', product?.unit_price || '70000',product?.moq || '5',product?.unit || 'Pieces',product?.currency || 'INR');
      // product?.'brand' || Samsung
      await productPage.submitProduct();
      await page.waitForTimeout(5000);
      
      TestLogger.log('📊 Validating progress and step completion');
      await addProductPreviewPage.validateProgressBar('33%');
      await productInformationPage.validateProductAddStepCompletion('Product Details');
      TestLogger.success('Step 1 completed: Product added successfully');
});

await test.step('Step 2: Add Offer Info', async () => {
  TestLogger.info('🏷️ Step 2: Adding Buy More Get More Offer Information');
  const addOfferPage = new AddSellOfferPage(page);
  const productInformationPage = new ProductInformationPage(page);
  // Step 3: Add Offer Info
  //await addOfferPage.navigateToOfferDetails();
  const randomDiscount = Math.floor(Math.random() * 100) + 1;
  TestLogger.log(`🎯 Generated random discount: ${randomDiscount}%`);
  
  TestLogger.log('📝 Filling offer details - Type: Buy More Get More, Buy: 2, Get: 3 free');
  await addOfferPage.fillOfferDetailsGeneric({
    offerType: 'Buy More Get More',
    title: 'Test Offer',
    description: 'Test Description',
    buyQty: '2',
    freeQty: '3',
    startDate: todayFormatted,
    endDate: futureFormatted,
    keywords: ['test', 'offer']
  });
  await productInformationPage.submitProduct();
  await page.waitForTimeout(5000);
  
  TestLogger.log('📊 Validating offer progress');
  await addProductPreviewPage.validateProgressBar('66%');
  await productInformationPage.validateProductAddStepCompletion('Offer Details');
  TestLogger.success('Step 2 completed: Offer details added successfully');
});
await test.step('Step 3: Preview, Shipping & Validate', async () => {
  TestLogger.info('🔍 Step 3: Preview and Shipping Configuration');
  
  const productInformationPage = new ProductInformationPage(page);
  
  const shippingPage = new SellOfferShippingPage(page);
  

  TestLogger.log('🚚 Filling shipping information');
  await shippingPage.fillShipping(product);
  
  TestLogger.log('✅ Validating sell offer preview details');
  await previewPage.assertSellOfferLeftSidePreview(page, {
    offerType: 'Buy More Get More',
    price: product?.unit_price || '70000',
    unit: product?.unit || 'Pieces',
    buyQty: '2',  
    freeQty: '3',
    offerTitle: 'Test Offer',
    productName: product?.name || 'Industrial Hydraulic Pump',
    productCategory: product?.product_category || 'Electronics > Mobile Phones > Smartphones'
  });
  await productInformationPage.submitProduct();
  await page.waitForTimeout(5000);
  TestLogger.success('Step 3 completed: Preview and shipping validated');
});
  await test.step('Step 4: Sell offer Detail page and Dashboard validations', async () => {
  TestLogger.info('📋 Step 4: Final Validations - Detail Page and Dashboard');
  // // Final: Confirm URL
  TestLogger.log('🔗 Validating URL navigation');
   await expect(page).toHaveURL(/.*sales-sell-offer.*/);
   
   TestLogger.log('🔍 Validating sell offer details page');
    await previewPage.assertViewDetailsSellOffer({
   name: product?.name || 'Industrial Hydraulic Pump',
   category: product?.product_category || 'Industrial Equipment & Machinery > Hydraulic & Pneumatic Equipment > Hand Operated Hydraulic Pumps',
   brand: product?.brand || 'HydroMax',
   productDescription: product?.short_description || 'Test Description',
   currency: product?.currency || '₹ - INR',
   basePrice: product?.unit_price || '₹500',
   moq: product?.moq || '2 pieces',
   offerTitle: 'Test Offer',
   offerDescription: 'Test Description',
   offerType: 'buyMore',
    offerPrice: 'NA',
   dateCreated: todayFormatted,
   offerValidTill: futureFormatted,
   paymentTerms: product?.payment_terms || '100% Advance',
   paymentMethods: product?.payment_methods || 'Credit Card',
   shippingModes:   product?.shipping_modes || 'Sea, Air',
   dispatchLeadTime: product?.dispatch_lead_time || 'Ships in 3-3 Days',
   shipsInternationally: product?.ships_internationally || 'yes'
});

TestLogger.log('📊 Validating right info section analytics');
await previewPage.assertViewDetailsRightInfoSection({
  analyticsView: '0',
  progressText: 'Completed 100%',
  status: 'pending'
  });

TestLogger.log('⬅️ Navigating back to dashboard');
await previewPage.clickPreviousButton();

TestLogger.log('📋 Validating dashboard listing');
await sellOfferDashboardPage.validateFirstContactRow({
  productName: product?.name || 'Industrial Hydraulic Pump',
  offerType: 'Buy More Get More',
  offerTitle: 'Test Offer',
  offerPrice: 'NA',
  MOQ: '',
  display: 'No',
  dateCreated: todayFormatted,
  expiringIn: futureFormatted,
  status: 'pending'
});
TestLogger.success('Step 4 completed: All validations passed successfully');
});
    
    // Attach all test logs to the HTML report
    await TestLogger.attachLogsToTest(testInfo);
    TestLogger.success('✅ Buy More Get More Sell Offer Flow test completed successfully');
  });
});

