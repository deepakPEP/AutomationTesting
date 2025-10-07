// tests/SellOfferFlowTest.spec.ts
import { LoginPage } from '../../../pages/LoginPage';
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
//
test.describe('Buy More Get More Sell Offer Flow', { tag: ['@critical'] }, () => {
  test('Sell Offer Flow through add new product', async ({ page }) => {
    const addProductPreviewPage = new AddProductPreviewPage(page);
    const previewPage = new SellOfferPreviewPage(page);
    const sellOfferDashboardPage = new SellDashboardPage(page);
    const productInformationPage = new ProductInformationPage(page);
    const product = getProductByName('Industrial Hydraulic Pump')
    test.setTimeout(180000);
    let {todayFormatted, futureFormatted } = getTodayAndFutureDate(1);
      
    await test.step('Step 1: Add Product', async () => {
      const productPage = new SellOfferProductPage(page);
      
      const loginPage = new LoginPage(page);

      await loginPage.enterEmailAndContinue('9632370046');
      
      await page.waitForTimeout(12000);

      await productPage.navigateToSellOfferSection();
      await console.log('product ',product);
      await productPage.addNewProduct(product?.name || 'Industrial Hydraulic Pump');
      await console.log('product category:', product?.product_category);
      await productInformationPage.browseCategory(product?.product_category || 'Electronics > Mobile Phones > Smartphones');
      await productInformationPage.uploadImage();
      await productPage.fillProductDetails(product?.short_description||'Test Description',product?.brand || 'Samsung', product?.unit_price || '70000',product?.moq || '5',product?.unit || 'Pieces');
      // product?.'brand' || Samsung
      await productPage.submitProduct();
      await page.waitForTimeout(5000);
      await addProductPreviewPage.validateProgressBar('33%');
      await productInformationPage.validateProductAddStepCompletion('Product Details');
});

await test.step('Step 2: Add Offer Info', async () => {
  const addOfferPage = new AddSellOfferPage(page);
  const productInformationPage = new ProductInformationPage(page);
  // Step 3: Add Offer Info
  //await addOfferPage.navigateToOfferDetails();
  const randomDiscount = Math.floor(Math.random() * 100) + 1;
  
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
    await addProductPreviewPage.validateProgressBar('66%');
    await productInformationPage.validateProductAddStepCompletion('Offer Details');
});
await test.step('Step 3: Preview, Shipping & Validate', async () => {
  
  const productInformationPage = new ProductInformationPage(page);
  
  const shippingPage = new SellOfferShippingPage(page);
  

  await shippingPage.fillShipping(product);
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
});
  await test.step('Step 4: Sell offer Detail page and Dashboard validations', async () => {
  // // Final: Confirm URL
   await expect(page).toHaveURL(/.*sales-sell-offer.*/);
   
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
await previewPage.assertViewDetailsRightInfoSection({
  analyticsView: '0',
  progressText: 'Completed 100%',
  status: 'pending'
  });

await previewPage.clickPreviousButton();

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
});
  });
});

