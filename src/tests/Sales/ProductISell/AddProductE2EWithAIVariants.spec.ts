import { test, expect, Page,BrowserContext } from '@playwright/test';
import { TestLogger } from '../../../utils/TestLogger';
import { PricingMOQPage } from '../../../pages/ProductISell/AddProdPricingMOQPage';
import { getProductByName } from '../../../utils/getProductFromCSV'; 
import { LoginPage } from '../../../pages/LoginPage';
import { ProductInformationPage } from '../../../pages/ProductISell/AddProductInfoPage';
import { AddProductPreviewPage } from '../../../pages/ProductISell/AddProductPreviewPage';
import { AddProdSpecificationPage } from '../../../pages/ProductISell/AddProdSpecificationPage';
import { AddProdTradeDetails } from '../../../pages/ProductISell/AddProdTradeDetails';
import { AddProdShippingLogisticsDetails } from '../../../pages/ProductISell/AddProdShippingLogisticsDetails';
import { AddProdAdditionalInformationPage } from '../../../pages/ProductISell/AddProdAdditionalInformationPage';
import { ViewProductDetailsPage } from '../../../pages/ProductISell/AddViewProductDetailsPage';
import { ProductISellDashboardPage } from '../../../pages/ProductISell/ProductISellDashboardPage';
let product: any;
test.use({ storageState: 'auth-seller.json' });
test.describe('Add Product E2E with AI variants in Sales', { tag: ['@product_I_sell_with_variants'] }, () => {

// covering 113 testcases in this single e2e
  test('Complete Add Product Flow with variants', async ({page}, testInfo) => {
    test.setTimeout(480000);
    
    // Initialize TestLogger for this test
    TestLogger.info('🚀 Starting Complete Add Product Flow E2E test');
    TestLogger.log(`Test Product: Will be loaded from CSV`);
    
    const productPage = new ProductInformationPage(page);
    const pricingPage = new PricingMOQPage(page);
    const addProductPreviewPage = new AddProductPreviewPage(page);
    const tradeDetailsPage = new AddProdTradeDetails(page);
    const shippingLogisticsPage = new AddProdShippingLogisticsDetails(page);
    const additionalInfoPage = new AddProdAdditionalInformationPage(page);
    const viewProductDetailsPage = new ViewProductDetailsPage(page);
    const productISellDashboardPage = new ProductISellDashboardPage(page);
    const addProdSpecificationPage = new AddProdSpecificationPage(page);  
    const loginPage = new LoginPage(page);
    
    await test.step('Step 1: Add Product Basic Info', async () => {
      TestLogger.info('📝 Step 1: Adding Product Basic Information');
      
      //await page.goto('https://sandbox.pepagora.org/en/authenticate');
      TestLogger.log('🔐 Logging in with phone number: 9591603604');
      //await loginPage.enterEmailAndContinue('9591603604');
    await page.goto('https://www.sandbox.pepagora.org/app/sales-product/form');
       await loginPage.acceptCookiesIfPresent();
      product = getProductByName('Mens Cotton Polo T-Shirt');
      //TestLogger.log(`📦 Loaded product from CSV: ${product?.name || 'Unknown'}`);
      TestLogger.log(`📦 Loaded product from CSV: ${product || 'Unknown'}`);
    await page.waitForTimeout(12000);
      TestLogger.log('🛍️ Navigating to Sales > Product I Sell');
      // await page.locator('div').filter({ hasText: /^Sales$/ }).getByRole('img').click();
      // await page.getByRole('link', { name: 'Product I Sell', exact: true }).click();
      
      // await page.getByRole('button', { name: 'Add Product Add Product' }).click();

      TestLogger.log('📋 Filling basic product information');
      await productPage.fillBasicInfo(product,true);
      await productPage.selectAICategory(product?.product_category || '');
      await productPage.uploadImage();
      await productPage.selectCountry();
      await productPage.submitProduct();

      TestLogger.log('✅ Verifying product details and progress');
      await addProductPreviewPage.verifyDetails(product);
      await addProductPreviewPage.validateProgressBar('12%');
      await productPage.validateProductAddStepCompletion('Product Information');
      TestLogger.success('Step 1 completed: Product Basic Info added');
    });

    await test.step('Step 2: Add Pricing and MOQ Info', async () => {
      TestLogger.info('💰 Step 2: Adding Pricing and MOQ Information');
      test.setTimeout(180000);
      await page.waitForTimeout(2000);
      TestLogger.log(`💵 Setting price: ${product?.unit_price || '100'} and MOQ: ${product?.moq || '1'}`);
      await pricingPage.fillPricingMOQ(product);
     // await page.pause();
      await productPage.submitProduct();
      TestLogger.log('📊 Validating progress and pricing details');
      await addProductPreviewPage.validateProgressBar('25%');
      await addProductPreviewPage.assertMOQ(page, product?.moq || '1',product.unit || 'Pieces');
      await addProductPreviewPage.assertPrice(product?.unit_price || '100');
      await productPage.validateProductAddStepCompletion('Pricing & MOQ');
      TestLogger.success('Step 2 completed: Pricing and MOQ added');
    });

    await test.step('Step 3: Select AI variants', async () => {
      TestLogger.info('🔄 Step 3: Selecting Product AI Variants');
      test.setTimeout(480000);
      await page.waitForTimeout(7000);  
      TestLogger.log('📦 Selecting variants - using variant flow');
      const expectedAttributes = "Color Options:Black,White|Size Range:Small,Medium";
      
    const variantData = {
      unitPrice: "25.99",
      sku: "CTS",
      moq: "10",
      moqUnit: "Pieces"
    };

// This will now validate everything step by step
    await addProdSpecificationPage.processCompleteVariantWorkflow(expectedAttributes, variantData);
      await page.waitForTimeout(3000);
      await productPage.submitProduct(); // Proceeding after variants
      await addProductPreviewPage.validateProgressBar('37%');
      await addProductPreviewPage.validateVariantsPreview({ expectedImageCount: 4 , expectedAttributes :expectedAttributes}); // Validate 4 variant images
      await addProdSpecificationPage.clickWriteWithAIAndAssertDescription(product);
      await addProdSpecificationPage.clickWriteWithAIApplicationsAndAssert(product);
      await productPage.submitProduct();
      await page.waitForTimeout(10000);
      await addProductPreviewPage.validateProgressBar('50%');
      await productPage.validateProductAddStepCompletion('Product Specifications');
      TestLogger.success('Step 3 completed: Variants skipped');
    });

    await test.step('Step 4: Add Trade Details', async () => {
      TestLogger.info('🏪 Step 4: Adding Trade Details');
      test.setTimeout(360000);
      //await page.waitForTimeout(2000);
      TestLogger.log(`⏰ Setting lead time: ${product?.production_lead_time || '2 weeks'}`);
      await tradeDetailsPage.selectLeadTime(product?.production_lead_time || '2 weeks');
      //await page.waitForTimeout(2000);
      TestLogger.log(`🏭 Setting production capacity: ${product?.production_capacity_value || 10} ${product?.production_capacity_unit || 'Pieces'}`);
      await tradeDetailsPage.selectProductionCapacityUnit(
        product?.production_capacity_value || 10,
        product?.production_capacity_unit || 'Pieces',
        product?.production_capacity_duration || 'Weekly'
      );
      await tradeDetailsPage.selectAvailableStock(product?.available_stock || true);
      await tradeDetailsPage.checkSampleAvailability(product?.sample_availability || 'Free', null);
      
      await productPage.submitProduct();
      
      await addProductPreviewPage.validateProgressBar('62%');
      
      await page.waitForTimeout(2000);
      TestLogger.log(`💳 Setting payment terms: ${product?.payment_term || '100% Advance'}`);
      await tradeDetailsPage.setPaymentTerms(product?.payment_term || '100% Advance');
      await tradeDetailsPage.selectPaymentOptions(product?.payment_option || 'Credit Card');
      await productPage.submitProduct();
      await addProductPreviewPage.validateProgressBar('75%');
      await productPage.validateProductAddStepCompletion('Trade Details');
      TestLogger.success('Step 4 completed: Trade Details added');
    });

    await test.step('Step 5: Add Shipping & Logistics Details', async () => {
      TestLogger.info('🚚 Step 5: Adding Shipping & Logistics Details');
      test.setTimeout(360000);
      TestLogger.log(`📦 Setting shipping details - International: ${product?.ships_internationally || 'Yes'}, Incoterms: ${product?.incoterms || 'EXW (Ex Works)'}`);
      await shippingLogisticsPage.fillShippingAndLogisticsDetails(
        product?.ships_internationally || 'Yes',
        product?.incoterms || 'EXW (Ex Works)',
        product?.port_of_dispatch || 'New York',
        product?.dispatch_lead_time || '5 days',
        product?.units_per_package || 10,
        product?.barcode || 'SHIP123',
        product?.packaging_type || 'Box',
        product?.shipping_mode || 'Air'
      );
      await productPage.submitProduct();
      await addProductPreviewPage.validateProgressBar('87%');
      await productPage.validateProductAddStepCompletion('Shipping and Logistics');
      TestLogger.success('Step 5 completed: Shipping & Logistics added');
    });

    await test.step('Step 6: Additional Info & Certificates', async () => {
      TestLogger.info('📋 Step 6: Adding Additional Information and Certificates');
      test.setTimeout(480000);
      TestLogger.log(`🏷️ Setting brand name: ${product.brand || 'Generic Brand'}`);
      //await additionalInfoPage.fillAdditionalInformation({ isCustomizable: false, brandName: product.brand || 'Generic Brand' });
      await productPage.submitProduct();
      TestLogger.success(`Product submitted successfully: ${product?.name || 'Unknown Product'}`);
      await page.waitForTimeout(10000);
      
      TestLogger.log('🔍 Verifying product details on view page');
      await viewProductDetailsPage.assertProductDetails(product,false);
      await viewProductDetailsPage.validateProductSpecifications({
        detailedDescription: product?.description || 'No detailed description',
        applications: product?.applications || 'No applications info',
        expectedAttributes: "Color Options:Black,White|Size Range:Small,Medium",
        variantCounts: { "Black": 2, "White": 2 } // Expecting 4 variants
      });
      
      TestLogger.log('📊 Navigating to dashboard and validating product listing');
      await page.goto('https://sandbox.pepagora.org/en/app/sales-product');
      await productISellDashboardPage.validateFirstContactRow({ 
        productName: product?.name || 'Generic Product',
        noOfVariants: '4',
        category: product?.product_category || 'General',
        stockAvailability: 'In stock',
        display: product?.display || 'No',
        price: product?.unit_price || '100',
        status: product?.status || 'pending',
        sku_code: product?.sku_model || 'SKU123' 
      });
      TestLogger.success('Step 6 completed: Product successfully added and validated on dashboard');
      //await page.pause();
    });
    
    // Attach all test logs to the HTML report
    TestLogger.log(`🛒 Final product details: ${JSON.stringify(product, null, 2)}`);
    await TestLogger.attachLogsToTest(testInfo);
    TestLogger.success('✅ Complete Add Product Flow E2E test completed successfully');
  });

});