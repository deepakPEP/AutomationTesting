import { test, expect, Page, BrowserContext } from '@playwright/test';
import { PricingMOQPage } from '../../../pages/ProductISell/AddProdPricingMOQPage';
import { getProductByName } from '../../../utils/getProductFromCSV'; 
import { LoginPage } from '../../../pages/LoginPage';
import { ProductInformationPage } from '../../../pages/ProductISell/AddProductInfoPage';
import { AddProductPreviewPage } from '../../../pages/ProductISell/AddProductPreviewPage';
import { AddProdTradeDetails } from '../../../pages/ProductISell/AddProdTradeDetails';
import { AddProdShippingLogisticsDetails } from '../../../pages/ProductISell/AddProdShippingLogisticsDetails';

let product: any;
let page: Page;
let context: BrowserContext;

test.describe('Add Product E2E for Request Quote price without variants in Sales', () => {
  test.beforeAll(async ({ browser }) => {
    test.setTimeout(120000);
    context = await browser.newContext();
    page = await context.newPage();
    const loginPage = new LoginPage(page);
    await page.goto('http://183.82.251.239/en/authenticate');
    //await page.goto('https://sandbox.pepagora.org/en/');
   // await loginPage.login('anusuya2011cse@gmail.com');
    product = getProductByName('Mens Cotton Polo T-Shirt');
    await page.waitForTimeout(30000);
  });

  test('Complete Add Product Flow without variants - AUTO_SAL_ADD_PROD_001_to_006', async () => {
    test.setTimeout(120000);
    const productPage = new ProductInformationPage(page);
    const pricingPage = new PricingMOQPage(page);
    const addProductPreviewPage = new AddProductPreviewPage(page);
    const tradeDetailsPage = new AddProdTradeDetails(page);
    const shippingLogisticsPage = new AddProdShippingLogisticsDetails(page);

    await test.step('Step 1: Add Product Basic Info', async () => {
      await page.locator('div').filter({ hasText: /^Sales$/ }).getByRole('img').click();
      await page.getByRole('link', { name: 'Product I Sell' }).click();
      await page.getByRole('button', { name: /Add Product/ }).click();

      await productPage.fillBasicInfo(product);
      await productPage.browseCategory(product?.product_category || '');
      await productPage.uploadImage();
      await productPage.selectCountry();
      await productPage.submitProduct();

      //await addProductPreviewPage.verifyDetails(product);
      //await addProductPreviewPage.validateProgressBar('12%');
    });

    await test.step('Step 2: Add Pricing and MOQ Info', async () => {
      test.setTimeout(120000);
      await pricingPage.fillPricingMOQ(product);
      await productPage.submitProduct();
      //await addProductPreviewPage.validateProgressBar('25%');
      //await addProductPreviewPage.assertMOQ(page, product?.moq || '1');
      //await addProductPreviewPage.assertPrice(page, product?.unit_price || '100');
    });

    await test.step('Step 3: Skip Variants (no variant flow)', async () => {
      await productPage.submitProduct();
      await productPage.submitProduct(); // Skipping variants
      await page.waitForTimeout(5000);
      //await addProductPreviewPage.validateProgressBar('37%');
    });

    await test.step('Step 4: Add Trade Details', async () => {
      test.setTimeout(120000);
      await page.waitForTimeout(5000);
      await tradeDetailsPage.selectLeadTime(product?.production_lead_time || '2 weeks');
      await tradeDetailsPage.selectProductionCapacityUnit(
        product?.production_capacity_value || 10,
        product?.production_capacity_unit || 'Pieces',
        product?.production_capacity_duration || 'Weekly'
      );
      await tradeDetailsPage.selectAvailableStock(product?.available_stock || true);
      await tradeDetailsPage.checkSampleAvailability(product?.sample_availability || 'Free', null);
      
      //await page.pause();
      // await productPage.submitProduct();
      // await page.waitForTimeout(20000);
      // await tradeDetailsPage.setPaymentTerms(product?.payment_term || '100% Advance', product?.payment_option || 'Credit Card');
    });

    await test.step('Step 5: Add Shipping & Logistics Details', async () => {
      await shippingLogisticsPage.fillShippingAndLogisticsDetails(
        product?.ships_internationally || 'Yes',
        product?.incoterms || 'EXW (Ex Works)',
        product?.port_of_dispatch || 'New York',
        product?.dispatch_lead_time || '5 days',
        product?.units_per_package || 10,
        product?.shipment_identifier || 'SHIP123',
        product?.packaging_type || 'Box'
      );
    });

    await test.step('Step 6: Additional Info & Certificates', async () => {
      await page.getByText('Select Payment TermSelect').click();
      await page.getByRole('option', { name: '100% Advance' }).click();
      await page.locator('label').filter({ hasText: 'Credit Card' }).locator('span').nth(1).click();
      await page.locator('label').filter({ hasText: 'Cash' }).locator('span').nth(1).click();
      await page.getByRole('button', { name: 'Continue', exact: true }).click();

      await page.locator('label').filter({ hasText: 'Sea' }).click();
      await page.getByText('Select IncotermsSelect').click();
      await page.getByRole('option', { name: 'EXW (Ex Works)' }).click();

      await page.getByText('Select Packaging TypeSelect').click();
      await page.getByRole('option', { name: 'Box' }).click();
      await page.getByRole('textbox', { name: 'Enter Numeric' }).fill('10');
      await page.getByRole('button', { name: 'Continue', exact: true }).click();

      await page.getByRole('textbox', { name: 'Enter Any One' }).fill('4576');
      await page.getByRole('button', { name: 'Continue', exact: true }).click();
      await page.getByRole('button', { name: 'Continue', exact: true }).click();

      await page.getByRole('button', { name: 'Select Product Group' }).click();
      await page.getByRole('option', { name: 'group choclate' }).click();

      await page.getByRole('textbox', { name: 'Enter Certificate Title' }).fill('cer1');
      await page.getByRole('button', { name: 'Continue', exact: true }).click();

      await page.getByText('Choose File').click();
      await page.getByRole('button', { name: 'Drag & Drop file from' }).setInputFiles('ISO-9001-2008-Quality-Certificate-Melexis.pdf');
      await page.getByRole('button', { name: 'Continue', exact: true }).click();
    });
  });

  test.afterAll(async () => {
    await context.close();
  });
});
