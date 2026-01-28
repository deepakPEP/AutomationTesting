import { Page, Locator,expect } from '@playwright/test';
import { MarketplaceHomePage } from './MarketplaceHomePage';
import { MKP_AllCategoriesPage } from './MKP_AllCategoriesPage';

export class MKP_ProdDetailPage {
  readonly page: Page;
  
  readonly casualWearCard: Locator;
  readonly productLoadingSpinner: Locator;
  readonly universalCapProductCard: Locator;
  readonly marketplaceHomePage: MarketplaceHomePage;
  readonly allCategoriesPage: MKP_AllCategoriesPage;
  constructor(page: Page) {
    this.page = page;
    
    this.casualWearCard = page.locator('[class*="category"], [class*="card"]').filter({ hasText: 'Casual Wear' });
    this.productLoadingSpinner = page.locator('[class*="loader"], [class*="spinner"]');
    this.universalCapProductCard = page.locator('[class*="product"]').filter({ hasText: 'Universal Cap' });
    this.marketplaceHomePage = new MarketplaceHomePage(page);
    this.allCategoriesPage = new MKP_AllCategoriesPage(page);
  }

  /**
   * Navigate to home page
   */
  async navigateToHome() {
    await this.page.goto('https://www.sandbox.pepagora.org/en');
    await this.page.waitForLoadState('domcontentloaded');
  }

  
  /**
   * Click Casual Wear category card
   */
  async clickCasualWearCard() {
    await this.casualWearCard.waitFor({ state: 'visible', timeout: 10000 });
    await this.casualWearCard.click();
    await this.page.waitForTimeout(2000);
  }

  /**
   * Wait for products listing page to load
   */
  async waitForProductsListingPage() {
    // Wait for products to appear
    const productCards = this.page.locator('[class*="product-card"], [class*="product"]').first();
    await productCards.waitFor({ state: 'visible', timeout: 15000 });
    
    // Wait for loading spinner to disappear
    try {
      await this.productLoadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    } catch (error) {
      // Spinner might not be present
    }

    await this.page.waitForTimeout(1000);
  }

  /**
   * Click Universal Cap product
   */
  async clickUniversalCapProduct() {
    await this.universalCapProductCard.waitFor({ state: 'visible', timeout: 10000 });
    await this.universalCapProductCard.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Complete flow: Navigate > Categories > Casual Wear > Wait > Click Universal Cap
   */
  async completeFlow() {
    await this.navigateToHome();
    await this.marketplaceHomePage.clickAllCategories();
    await this.clickCasualWearCard();
    await this.waitForProductsListingPage();
    await this.clickUniversalCapProduct();
  }
  async clickApparelFirstProduct() {
   await this.allCategoriesPage.verifyPageTitle('Apparel & Fashion');
    await this.allCategoriesPage.clickCategoryByName('Formal Wear');

    await this.page.locator('a.p-l-c-c-details').first().click();
    console.log('✓ Clicked Casual Wear category');

    await this.page.waitForLoadState('domcontentloaded');
    console.log('✓ Product detail page loaded');

  }
  async validateProductDetailPage() {
    
    let productTitle = this.page.locator('h1.product-title');
    await expect(productTitle).toBeVisible({ timeout: 10000 });
    console.log('✓ Product title visible');

    const breadcrumbs = this.page.locator('.bread-crumbs-comp');
    await expect(breadcrumbs).toBeVisible();
    console.log('✓ Breadcrumbs visible');

    const gallery = this.page.locator('.preview-thumb-gallery-block');
    await expect(gallery).toBeVisible();
    console.log('✓ Product gallery visible');

    const specifications = this.page.locator('#specifications').first();
    await expect(specifications).toBeVisible();
    console.log('✓ Specifications section visible');

    const shippingDetails = this.page.locator('#shippingLogistics').first();
    await expect(shippingDetails).toBeVisible();
    console.log('✓ Shipping details visible');

    const companyProfile = this.page.locator('.company-profile-box');
    await expect(companyProfile).toBeVisible();
    console.log('✓ Company profile visible');

    // Verify we're on product detail page
    productTitle = this.page.locator('h1, [class*="title"]').first();
    await expect(productTitle).toBeVisible({ timeout: 10000 });

     const productName = this.page.locator('h1.product-title, h1[class*="product"]').first();
    await expect(productName).toBeVisible({ timeout: 10000 });
    console.log('✓ Product name visible');

    const productDescription = this.page.locator('[class*="description"], p[class*="desc"]').first();
    await expect(productDescription).toBeVisible();
    console.log('✓ Product description visible');

    const shippingInfo = this.page.locator('.shipping-detail-comp');
    await expect(shippingInfo).toBeVisible();
    console.log('✓ Shipping information visible');

    const moqInfo = this.page.locator('.product-orders-pairs-block .badge-comp');
    await expect(moqInfo).toBeVisible();
    const moqText = await moqInfo.textContent();
    expect(moqText).toContain('Min. Order Quantity');
    console.log('✓ MOQ information visible:', moqText);

    // ...existing code...
    const companyName = this.page.locator('.c-i-d-title');
    const companyNameElements = await companyName.all();
    
    // Validate both elements
    for (let i = 0; i < companyNameElements.length; i++) {
      await expect(companyNameElements[i]).toBeVisible();
      const isUnderlined = await companyNameElements[i].evaluate((el) => {
        return window.getComputedStyle(el).textDecoration.includes('underline');
      });
      expect(isUnderlined).toBeTruthy();
      const companyText = await companyNameElements[i].textContent();
      console.log(`✓ Company name [${i + 1}] visible and underlined: ${companyText}`);
    }
    console.log('✓ All company names verified');
// ...existing code...
    const contactSupplierBtn = this.page.locator('button:has-text("Contact Supplier"), a:has-text("Contact Supplier"), [class*="contact"]');
    await expect(contactSupplierBtn).toBeVisible();
    console.log('✓ Contact Supplier CTA visible');

    const requestQuoteBtn = this.page.locator('button:has-text("Request Quote"), a:has-text("Request Quote"), [class*="quote"]');
    await expect(requestQuoteBtn).toBeVisible();
    console.log('✓ Request Quote CTA visible');

    console.log('✅ All right-side panel elements verified successfully!');

  }
  async validateProductDetailPageInMKP(product : any) {
    await this.validateProductDetailPage();
    await this.validateTradeDetailsSectionInPDP(product);
    await this.validatePaymentTermsSectionInPDP(product);
    await this.validateShippingLogisticsSectionInPDP(product);
    await this.validateAdditionalInfoInPDP(product);
    await this.assertRightSidePanelInPDP(this.page, product);
  }
  async validatePaymentTermsSectionInPDP(product : any) {
    const payment_methods = product.payment_methods.toLowerCase().replace('credit card', 'credit')
    await this.validateAccordionSection('Payment Terms', {
    
 'Payment Terms': product.payment_terms,
'Payment Methods': payment_methods
  });
  }
   async validateShippingLogisticsSectionInPDP(product : any) {
   const shipping_modes = product.shipping_modes.toLowerCase()
    await this.validateAccordionSection('Shipping & Logistics', {

 'Shipping Internationally': product.ships_internationally,
'Methods': product.shipping_modes,
'IncoTerms': product.incoterms,
'Port of Dispatch': product.port_of_dispatch,
'Packaging Type': product.packaging_type,
'Units per Package': product.units_per_package,
'Barcode / HSN / GTIN / UPC': product.barcode,
//'Dispatch Lead time': product.dispatch_lead_time
});
  }
  async validateAdditionalInfoInPDP(product : any) {
   const shipping_modes = product.shipping_modes.toLowerCase()
    await this.validateAccordionSection('Specifications', {

 'Brand': product.brand,
'SKU': product.sku_model,
'Country of Origin': product.country_of_origin,
'Customisable': product.customisable,
});
  }
  async validateTradeDetailsSectionInPDP(product : any) {
 let availableStock = product.available_stock === 'TRUE' ? 'In stock' : 'Out of stock';
   let prodction_capacity = product.production_capacity_value + ' ' + product.production_capacity_unit + '/' + product.production_capacity_duration;
   let sample_availablity = product.sample_availablity === 'Free Sample' ? 'yes - free' : 'No';  
   const productionLeadTimeExpected =
  product.production_lead_time.replace(/\s*-\s*/g, '-').replace(/\s*days?/i, '').trim();
 await this.validateAccordionSection('Trade Details', {
     
  'Production Lead Time': productionLeadTimeExpected,
  'Available Stock': availableStock,
  'Production Capacity': prodction_capacity,
  'Sample Availability': sample_availablity});
  }

async validateAccordionSection(
  sectionName: string,
  expectedData: Record<string, string | string[]>
) {
  const section = this.page
    .locator('.p-accordion-tab')
    .filter({
      has: this.page.locator('h4', { hasText: sectionName }),
    });

  await expect(
    section,
    `Accordion section not found: ${sectionName}`
  ).toBeVisible();

  // Ensure accordion is expanded
  const header = section.locator('.p-accordion-header');
  if ((await header.getAttribute('data-p-highlight')) !== 'true') {
    await header.click();
  }

  const tables = section.locator('table.variants-table');
  const tableCount = await tables.count();

  expect(
    tableCount,
    `No tables found inside ${sectionName}`
  ).toBeGreaterThan(0);

  // Utility to normalize UI text
  const normalize = (text: string): string =>
    text
      .replace(/\s+/g, ' ')
      .replace(/\s*\/\s*/g, '/')
      .trim()
      .toLowerCase();

  for (const [label, expected] of Object.entries(expectedData)) {
    const row = tables.locator('tr').filter({
      has: this.page.locator('td', {
        hasText: new RegExp(label, 'i'),
      }),
    });

    await expect(
      row,
      `Row not found for label: ${label}`
    ).toHaveCount(1);

    // IMPORTANT: read only the value cell
    const valueCell = row.locator('td').nth(1);
    const actualText = normalize(await valueCell.textContent() || '');

    // 🔥 GENERIC enhancement:
    // array → as-is
    // comma-separated string → split
    // single string → wrap as array
    const expectedValues = Array.isArray(expected)
      ? expected
      : typeof expected === 'string' && expected.includes(',')
        ? expected.split(',').map(v => v.trim())
        : [expected];

    for (const val of expectedValues) {
      expect(
        actualText,
        `Missing value "${val}" for ${label}`
      ).toContain(normalize(val));
    }
  }
}

async  assertRightSidePanelInPDP(
  page: Page,
  product: any
) {
  const productBlock = page.locator('.product-detail-block');

  await expect(productBlock).toBeVisible();

  if (product.sku) {
    await expect(productBlock.locator('.sku-txt')).toContainText(product.sku_model);
  }

  if (product.title) {
    await expect(
      productBlock.locator('.product-title')
    ).toHaveText(product.title);
  }

  if (product.description) {
    await expect(
      productBlock.locator('.product-description')
    ).toHaveText(product.short_description);
  }

  if (product.minOrderQty) {
    await expect(
      productBlock.locator('badge-comp badge-lght-grey')
    ).toContainText(`Min. Order Quantity: ${product.minOrderQty} ${product.production_capacity_unit}`);
  }

  if (product.price) {
    await expect(
      productBlock.locator('.p-c-value')
    ).toHaveText(product.price);
  }
}

  }
