import { test, expect, Page,BrowserContext } from '@playwright/test';
import { PricingMOQPage } from '../../../pages/ProductISell/AddProdPricingMOQPage';
import { getProductByName } from '../../../utils/getProductFromCSV'; 
import { LoginPage } from '../../../pages/LoginPage';
import { ProductInformationPage } from '../../../pages/ProductISell/AddProductInfoPage';
import { AddProductPreviewPage } from '../../../pages/ProductISell/AddProductPreviewPage';
import { AddProdTradeDetails } from '../../../pages/ProductISell/AddProdTradeDetails';
import { AddProdShippingLogisticsDetails } from '../../../pages/ProductISell/AddProdShippingLogisticsDetails';
import { AddProdAdditionalInformationPage } from '../../../pages/ProductISell/AddProdAdditionalInformationPage';
import { ViewProductDetailsPage } from '../../../pages/ProductISell/AddViewProductDetailsPage';
import { ProductISellDashboardPage } from '../../../pages/ProductISell/ProductISellDashboardPage';
let product: any;

test.describe('Add Product E2E for Fixed Price without variants in Sales', { tag: ['@critical', '@product'] }, () => {

// covering 113 testcases in this single e2e
  test('Complete Add Product Flow without variants - AUTO_SAL_ADD_PROD_001_to_006', async ({page}) => {
    test.setTimeout(480000);
    const productPage = new ProductInformationPage(page);
    const pricingPage = new PricingMOQPage(page);
    const addProductPreviewPage = new AddProductPreviewPage(page);
    const tradeDetailsPage = new AddProdTradeDetails(page);
    const shippingLogisticsPage = new AddProdShippingLogisticsDetails(page);
    const additionalInfoPage = new AddProdAdditionalInformationPage(page);
    const viewProductDetailsPage = new ViewProductDetailsPage(page);
    const productISellDashboardPage = new ProductISellDashboardPage(page);
    const loginPage = new LoginPage(page);
    await test.step('Step 1: Add Product Basic Info', async () => {
      
      
      //await page.goto('https://sandbox.pepagora.org/en/authenticate');
      await loginPage.enterEmailAndContinue('9632370046');
    //  await page.pause();
      product = getProductByName('Lcd Tv');
    await page.waitForTimeout(12000);
      await page.locator('div').filter({ hasText: /^Sales$/ }).getByRole('img').click();
      await page.getByRole('link', { name: 'Product I Sell', exact: true }).click();
      await page.getByRole('button', { name: 'Add Product Add Product' }).click();

      await productPage.fillBasicInfo(product);
      await productPage.browseCategory(product?.product_category || '');
      await productPage.uploadImage();
      await productPage.selectCountry();
      await productPage.submitProduct();

      await addProductPreviewPage.verifyDetails(product);
      await addProductPreviewPage.validateProgressBar('12%');
      await productPage.validateProductAddStepCompletion('Product Information');
    });

    await test.step('Step 2: Add Pricing and MOQ Info', async () => {
      test.setTimeout(120000);
      await page.waitForTimeout(2000);
      await pricingPage.fillPricingMOQ(product);
     // await page.pause();
      await productPage.submitProduct();
      await addProductPreviewPage.validateProgressBar('25%');
      await addProductPreviewPage.assertMOQ(page, product?.moq || '1',product.unit || 'Pieces');
      await addProductPreviewPage.assertPrice(page, product?.unit_price || '100');
      await productPage.validateProductAddStepCompletion('Pricing & MOQ');
    });

    await test.step('Step 3: Skip Variants (no variant flow)', async () => {
      test.setTimeout(240000);
      await productPage.submitProduct();
      await page.waitForTimeout(60000);
      //await addProductPreviewPage.validateProgressBar('37%');
      await productPage.submitProduct(); // Skipping variants
      await page.waitForTimeout(5000);
      //await addProductPreviewPage.validateProgressBar('50%');
      await productPage.validateProductAddStepCompletion('Product Specifications');
    });

    await test.step('Step 4: Add Trade Details', async () => {
      test.setTimeout(240000);
      //await page.waitForTimeout(2000);
      await tradeDetailsPage.selectLeadTime(product?.production_lead_time || '2 weeks');
      //await page.waitForTimeout(2000);
      await tradeDetailsPage.selectProductionCapacityUnit(
        product?.production_capacity_value || 10,
        product?.production_capacity_unit || 'Pieces',
        product?.production_capacity_duration || 'Weekly'
      );
      await tradeDetailsPage.selectAvailableStock(product?.available_stock || true);
      await tradeDetailsPage.checkSampleAvailability(product?.sample_availability || 'Free', null);
      await productPage.submitProduct();
      await addProductPreviewPage.validateProgressBar('62%');
      //await productPage.submitProduct();
      await page.waitForTimeout(2000);
      await tradeDetailsPage.setPaymentTerms(product?.payment_term || '100% Advance');
      await tradeDetailsPage.selectPaymentOptions(product?.payment_option || 'Credit Card');
      await productPage.submitProduct();
      await addProductPreviewPage.validateProgressBar('75%');
      await productPage.validateProductAddStepCompletion('Trade Details');
    });

    await test.step('Step 5: Add Shipping & Logistics Details', async () => {
      test.setTimeout(240000);
      await shippingLogisticsPage.fillShippingAndLogisticsDetails(
        product?.ships_internationally || 'Yes',
        product?.incoterms || 'EXW (Ex Works)',
        product?.port_of_dispatch || 'New York',
        product?.dispatch_lead_time || '5 days',
        product?.units_per_package || 10,
        product?.shipment_identifier || 'SHIP123',
        product?.packaging_type || 'Box',
        product?.shipping_mode || 'Air'
      );
      await productPage.submitProduct();
      await addProductPreviewPage.validateProgressBar('87%');
      await productPage.validateProductAddStepCompletion('Shipping and Logistics');
    });

    await test.step('Step 6: Additional Info & Certificates', async () => {
      test.setTimeout(480000);
      await additionalInfoPage.fillAdditionalInformation({ isCustomizable: false, brandName: product.brand || 'Generic Brand' });
      await productPage.submitProduct();
      await console.log('Product submitted', product);
      await page.waitForTimeout(10000);
      await viewProductDetailsPage.assertProductDetails(product);
      await page.goto('https://sandbox.pepagora.org/en/app/sales-product');
      await productISellDashboardPage.validateFirstContactRow({ productName: product?.name || 'Generic Product',
      noOfVariants: 'No Variants',
      category: product?.category || 'General',
      stockAvailability: 'In stock',
      display: product?.display || 'No',
      price: product?.unit_price || '100',
      status: product?.status || 'pending',
      sku_code: product?.sku_model || 'SKU123' });
      //await page.pause();
    });
  });

});
