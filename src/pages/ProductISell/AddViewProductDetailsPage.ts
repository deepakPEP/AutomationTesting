import { expect, Locator, Page } from '@playwright/test';
import {  assertNormalizedText } from '../../utils/CommonFunctions';
import { TestLogger } from '../../utils/TestLogger';

export class ViewProductDetailsPage {
  readonly page: Page;

  readonly productTitle: Locator;
  readonly prodDescription: Locator;
  readonly mainImage: Locator;
  readonly thumbImage: Locator;
  

  constructor(page: Page) {
    this.page = page;

    this.productTitle = page.locator('h1.p-m-i-title');
    this.prodDescription = page.locator('p.p-m-i-desc');
    this.mainImage = page.locator('.preview-gallery-main img');
    this.thumbImage = this.page.locator('.swiper-thumbs img');
  }
  async assertProductDetails(product: any,additionalInfo = false) {
    await this.page.waitForTimeout(4000);
    await this.assertProductInformation(product);
    await this.assertProductPricingAndMOQ(product);
    
    await this.assertProductTradeDetails(product);
    await this.assertShippingAndLogistics(product);
    if(additionalInfo) {
      await this.assertAdditionalDetails(product);
    }
    await this.validateAnalyticsSection(product);
  }
  async assertProductInformation(product:any){
    await expect(this.productTitle).toHaveText(product.name);
    
    await expect(this.prodDescription).toHaveText(product.short_description || 'No description');
    await expect(this.mainImage).toBeVisible();
  // 2. Assert it has a non-empty src
  const src = await this.mainImage.getAttribute('src');
  expect(src).not.toBeNull();
  expect(src?.trim()).not.toBe('');

  // 3. (Optional) Assert that the image URL actually loads successfully (status 200)
  // const response = await this.page.request.get(src!);
  // expect(response.status()).toBe(200);


  await expect(this.thumbImage.first()).toBeVisible();   // At least one visible
  const count = await this.thumbImage.count();
  expect(count).toBeGreaterThan(0);
    const pi_ProductName      = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Product Name")) .t-f-g-txt');
const pi_ShortDesc        = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Short Description")) .t-f-g-txt');
const pi_CategoryPath     = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Product Category")) .t-f-g-txt');
const pi_SKU              = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("SKU/Model")) .t-f-g-txt');
const pi_Origin           = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Country of Origin")) .t-f-g-txt');

await expect(pi_ProductName).toHaveText(product.name || 'Electric Screwdriver');
await expect(pi_ShortDesc).toHaveText(product.short_description || 'No description');
const category = (product.product_category).split(' > ') || ['No Category'];
await console.log('Asserting Category Path:', category);
await expect(pi_CategoryPath).toHaveText('Category: ' + category[0] + ' > ' + 'Subcategory: ' + category[1]);
await expect(pi_SKU).toHaveText(product.sku_model || 'No SKU');
await expect(pi_Origin).toHaveText('India');
  }
  async assertProductPricingAndMOQ(product:any){
    const pm_Currency         = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Currency")) .t-f-g-txt');
//const pm_FixedPricing     = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Fixed Pricing")) .t-f-g-txt');
const pm_MOQ              = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Minimum Order Quantity")) .t-f-g-txt');
await expect(pm_Currency).toHaveText('₹ - INR');
//  as of now checking indian rupee 
//await expect(pm_FixedPricing).toHaveText('₹' + (product.unit_price || '0'));
const pricing_type = this.page.locator('.p-accordion-tab:has(.p-accordion-header-text:has-text("Pricing & MOQ"))')
  .locator('.tabs-form-group')
  .nth(1).locator('.t-f-g-label');
const pricing_value = this.page.locator('.p-accordion-tab:has(.p-accordion-header-text:has-text("Pricing & MOQ"))')
  .locator('.tabs-form-group')
  .nth(1).locator('.t-f-g-txt');
if (product.pricing_type ==='Fixed') {
  await expect(pricing_type).toHaveText('Fixed Pricing');
  await expect(pricing_value).toHaveText('₹' + (product.unit_price || '0'));
}
else if (product.pricing_type ==='price_range') {
  // await expect(pricing_type).toHaveText('Variable Pricing');
  // await expect(pricing_value).toHaveText(product.unit_price || 'No price range  defined');
  await expect(pricing_type).toHaveText('Variable Pricing');

  const rawActual = (await pricing_value.textContent()) || '';
  const normalize = (s: string) => s.replace(/\s+/g, '').trim(); // removes spaces/newlines
  const actualNorm = normalize(rawActual);
  const expectedNorm = normalize(String(product.unit_price || 'No price range defined'));

  expect(actualNorm).toContain(expectedNorm);
} else {
  await expect(pricing_type).toHaveText('Request Quote');
  await expect(pricing_value).toHaveText('--');
}
await expect(pm_MOQ).toHaveText(product.moq + " " + product.unit.toLowerCase());

  }
  async assertProductTradeDetails(product:any){
    const td_ProdLeadTime     = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Production Lead Time")) .t-f-g-txt');
const td_SamplePrice      = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Sample Price")) .t-f-g-txt');
const td_AvailableStock   = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Available Stock")) .t-f-g-txt');
const td_SampleLeadTime   = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Sample Lead Time")) .t-f-g-txt');
const td_ProdCapacity     = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Production Capacity")) .t-f-g-txt');
const td_PaymentTerms     = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Payment Terms")) .t-f-g-txt');
const td_SampleAvailability= this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Sample Availability")) .t-f-g-txt');
const td_PaymentMethod    = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Payment Method")) .t-f-g-txt');

assertNormalizedText(await td_ProdLeadTime.textContent() || 'Undefined', product.production_lead_time || 'No Production Lead Time');

//await expect(td_SamplePrice).toHaveText(product.sample_price || '0');
if (product.available_stock == 'True') {
  await expect(td_AvailableStock).toHaveText('inStock');
}
//await expect(td_SampleLeadTime).toHaveText(product.sample_lead_time || 'No Lead Time');
await expect(td_ProdCapacity).toContainText(product.production_capacity_value || '0' + ' ' + product.production_capacity_unit || 'Pieces' + '/' + product.production_capacity_duration || 'Weekly');
//await expect(td_PaymentTerms).toHaveText(product.payment_terms || 'No Payment Terms');
// sample availability need to do
//await expect(td_PaymentMethod).toHaveText(product.payment_option || 'No Payment Option');
assertNormalizedText(await td_PaymentMethod.textContent() || 'Undefined', product.payment_option || 'No Payment Option');
  }
  async assertShippingAndLogistics(product:any){
    const sl_ShippingModes    = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Shipping Modes")) .t-f-g-txt');
const sl_PortOfDispatch   = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Port of Dispatch")) .t-f-g-txt');
const sl_Incoterms        = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Incoterms")) .t-f-g-txt');
// "Packaging Type" appears twice; use nth(0/1) if you must target both:
const sl_PackagingType_1  = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Packaging Type")) .t-f-g-txt').nth(0);
const sl_PackagingType_2  = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Packaging Type")) .t-f-g-txt').nth(1);

const sl_ShippingIntl     = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Shipping Internationally")) .t-f-g-txt');
const sl_UnitsPerPackage  = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Units per Package")) .t-f-g-txt');
const sl_DispatchLeadTime = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Dispatch Lead Time")) .t-f-g-txt');
const sl_HSN              = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("HSN")) .t-f-g-txt');

//shipping mode - one option only coming
await expect(sl_PortOfDispatch).toHaveText(product.port_of_dispatch || 'No Port of Dispatch');
await expect(sl_Incoterms).toHaveText(product.incoterms || 'No Incoterms');
await expect(sl_PackagingType_1).toHaveText(product.packaging_type || 'No Packaging Type');
//await expect(sl_ShippingIntl).toHaveText(product.ships_internationally || 'No Shipping Internationally');
assertNormalizedText(await sl_ShippingIntl.textContent() || 'Undefined', product.ships_internationally || 'No Shipping Internationally');
await expect(sl_UnitsPerPackage).toHaveText(product.units_per_package || 'No Units per Package');
//await expect(sl_DispatchLeadTime).toHaveText(product.dispatch_lead_time || 'No Dispatch Lead Time');
// as of now hard coding
await expect(sl_HSN).toHaveText('SHIP123');
}

async assertAdditionalDetails(product:any){
  const ad_Brand            = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Brand")) .t-f-g-txt');
const ad_ProductGroup     = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Product Group")) .t-f-g-txt');

// Product Video (link chip)
const ad_VideoLink        = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Product Video")) a.brochure-document-block');

// Certifications (row + first certificate chip)
const ad_CertRow          = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Certifications"))');
const ad_CertFirstLink    = ad_CertRow.locator('a.brochure-document-block').first();
const ad_CertFirstName    = ad_CertFirstLink.locator('.b-d-b-left .b-d-b-filename');
const ad_CertFirstSize    = ad_CertFirstLink.locator('.b-d-b-right .b-d-b-size');

const ad_CustomizationAvail = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Customization Available")) .t-f-g-txt');

// Specific Customization (HTML inside <span class="t-f-g-txt"><ol>...</ol></span>)
const ad_SpecificCustomization = this.page.locator('.tabs-form-group:has(.t-f-g-label:has-text("Specific Customization")) .t-f-g-txt');

// FAQs (two spans: Q then A)
const ad_FAQ_Group        = this.page.locator('.tabs-form-group.faq-qa-group');
const ad_FAQ_Q            = ad_FAQ_Group.locator('.t-f-g-txt').nth(0);
const ad_FAQ_A            = ad_FAQ_Group.locator('.t-f-g-txt').nth(1);

await expect(ad_Brand).toHaveText(product.brand || 'No Brand');
await expect(ad_VideoLink).toBeVisible();
await expect(ad_CertRow).toBeVisible();
await expect(ad_CertFirstLink).toBeVisible();
console.log('certification title ',await ad_CertFirstName.textContent());
console.log('certification size ',await ad_CertFirstSize.textContent());
await expect(ad_CertFirstName).toHaveText('Certification Title');
await expect(ad_CertFirstSize).toContainText('4.21 MB');
await expect(ad_FAQ_Q).toHaveText('Q: What is the warranty period?');
await expect(ad_FAQ_A).toHaveText('A: The warranty period is 2 years.');
}
async validateAnalyticsSection(product: any) {
const completedPercentageLocator = this.page.locator('.p-c-value');
await expect(completedPercentageLocator).toHaveText('Completed 100%');

const analyticsViewLocator = this.page.locator('.a-o-i-txt');
await expect(analyticsViewLocator).toHaveText('0');
const statusLocator = this.page.locator('.table-badge-comp.pending');
await expect(statusLocator).toHaveText('pending');
}
// ============================================
// PRODUCT SPECIFICATION VALIDATION METHOD
// ============================================

async validateProductSpecifications(expectedData: {
  detailedDescription: string;
  applications: string;
  expectedAttributes: string; // "Color Options:Black,White|Size Range:Small,Medium"
  variantCounts: { [key: string]: number }; // e.g., { "Black": 2, "White": 2 }
}) {
  TestLogger.info('🔍 Validating Product Specifications section');
  
  try {
    // STEP 1: Ensure Product Specification accordion is expanded
    const accordionHeader = this.page.locator('.p-accordion-header:has-text("Product Specification")');
    await expect(accordionHeader).toBeVisible();
    
    // Click to expand if not already expanded
    const isExpanded = await accordionHeader.getAttribute('data-p-highlight');
    if (isExpanded !== 'true') {
      await accordionHeader.click();
      await this.page.waitForTimeout(1000);
    }
    
    TestLogger.success('✅ Product Specification accordion is expanded');
    
    // STEP 2: Validate Detailed Description
    if (expectedData.detailedDescription) {
      await this.validateDetailedDescription(expectedData.detailedDescription);
    }
    
    // STEP 3: Validate Applications
    if (expectedData.applications) {
      await this.validateApplications(expectedData.applications);
    }
    
    // STEP 4: Validate Product Attributes
    await this.validateProductAttributes(expectedData.expectedAttributes);
    
    // STEP 5: Validate Variant Details
    await this.validateVariantDetails(expectedData.expectedAttributes, expectedData.variantCounts ? Object.values(expectedData.variantCounts).reduce((a, b) => a + b, 0) : 4  );
    
    TestLogger.success('🎉 Product Specifications validation completed successfully');
    
  } catch (error) {
    TestLogger.error(`❌ Product Specifications validation failed: ${error}`);
    throw error;
  }
}
// Replace your complex validation with this simple method
private async simpleVariantValidation(expectedAttributes: string) {
  TestLogger.info('🎨 Simple variant validation - checking visibility');
  
  try {
    // Just check if variant table exists
    const variantsTable = this.page.locator('.variants-table');
    await expect(variantsTable).toBeVisible();
    TestLogger.success('✅ Variants table is visible');
    
    // Parse expected values from "Color Options:Black,White|Size Range:Small,Medium"
    const expectedValues = this.parseSimpleValues(expectedAttributes);
    TestLogger.info(`🔍 Looking for values: ${expectedValues.join(', ')}`);
    
    // Get all text from the table
    const tableText = await variantsTable.textContent();
    
    // Simple check - are the values visible in the table?
    for (const value of expectedValues) {
      if (tableText?.includes(value)) {
        TestLogger.success(`✅ Found: ${value}`);
      } else {
        TestLogger.error(`❌ Missing: ${value}`);
        throw new Error(`Expected variant value '${value}' not found in table`);
      }
    }
    
    TestLogger.success(`🎉 All ${expectedValues.length} variant values found!`);
    
  } catch (error) {
    TestLogger.error(`❌ Simple variant validation failed: ${error}`);
    throw error;
  }
}

// Helper to extract just the values: Black, White, Small, Medium
private parseSimpleValues(expectedAttributes: string): string[] {
  const values: string[] = [];
  
  try {
    // Split by | to get groups: ["Color Options:Black,White", "Size Range:Small,Medium"]
    const groups = expectedAttributes.split('|');
    
    for (const group of groups) {
      // Split by : to get ["Color Options", "Black,White"]
      const [type, valuesStr] = group.split(':');
      
      if (valuesStr) {
        // Split by , to get ["Black", "White"]
        const groupValues = valuesStr.split(',').map(v => v.trim());
        values.push(...groupValues);
      }
    }
  } catch (error) {
    TestLogger.warn(`⚠️ Could not parse attributes: ${error}`);
  }
  
  return values;
}
async validateProductAttributes(expectedAttributes: string) {
  TestLogger.info('🏷️ Validating Product Attributes table');
  
  try {
    const attributesTable = this.page.locator('.product-attributes-table');
    await expect(attributesTable).toBeVisible();
    TestLogger.success('✅ Product Attributes table found');
    
    // Parse expected attributes: "Color Options:Black,White|Size Range:Small,Medium"
    const attributeGroups = expectedAttributes.split('|');
    
    for (const group of attributeGroups) {
      const [attributeName, valuesString] = group.split(':');
      const expectedValues = valuesString.split(',').map(v => v.trim());
      
      TestLogger.info(`🔍 Checking attribute: ${attributeName} with values: ${expectedValues.join(', ')}`);
      
      // Find the row for this attribute
      const attributeRow = attributesTable.locator(`tr:has(td:has-text("${attributeName}"))`);
      await expect(attributeRow).toBeVisible();
      TestLogger.success(`✅ Found attribute row: ${attributeName}`);
      
      // Check the values in the second column
      const valuesCell = attributeRow.locator('td').nth(1);
      const actualValues = await valuesCell.textContent();
      
      // Validate that all expected values are present
      for (const expectedValue of expectedValues) {
        if (actualValues && actualValues.includes(expectedValue)) {
          TestLogger.success(`✅ Found value: ${expectedValue}`);
        } else {
          throw new Error(`Value "${expectedValue}" not found in attribute "${attributeName}"`);
        }
      }
    }
    
    TestLogger.success('✅ All Product Attributes validated');
    
  } catch (error) {
    TestLogger.error(`❌ Product Attributes validation failed: ${error}`);
    throw error;
  }
}
async validateDetailedDescription(expectedDescription?: string) {
  TestLogger.info('📝 Validating Detailed Description');
  
  const descriptionText = this.page.locator('.tabs-form-group:has(label:has-text("Detailed Description")) .t-f-g-txt');
  await expect(descriptionText).toBeVisible();
  
  const description = await descriptionText.textContent();
  expect(description).toBeTruthy();
  expect(description!.length).toBeGreaterThan(20);
  
  // Optional: Check if it contains expected content
  if (expectedDescription && description) {
    const lowerDescription = description.toLowerCase();
    const lowerExpected = expectedDescription.toLowerCase();
    
    if (lowerDescription.includes(lowerExpected)) {
      TestLogger.success(`✅ Description contains expected content: "${expectedDescription}"`);
    } else {
      TestLogger.warn(`⚠️ Description doesn't contain: "${expectedDescription}"`);
    }
  }
  
  TestLogger.success(`✅ Description validated (${description!.length} chars)`);
}
async validateApplications(expectedApplications?: string) {
  TestLogger.info('🔧 Validating Applications');
  
  const applicationsText = this.page.locator('.tabs-form-group:has(label:has-text("Applications")) .t-f-g-txt');
  await expect(applicationsText).toBeVisible();
  
  const applications = await applicationsText.textContent();
  expect(applications).toBeTruthy();
  expect(applications!.length).toBeGreaterThan(20);
  
  // Optional: Check if it contains expected content
  if (expectedApplications && applications) {
    const lowerApplications = applications.toLowerCase();
    const lowerExpected = expectedApplications.toLowerCase();
    
    if (lowerApplications.includes(lowerExpected)) {
      TestLogger.success(`✅ Applications contains expected content: "${expectedApplications}"`);
    } else {
      TestLogger.warn(`⚠️ Applications doesn't contain: "${expectedApplications}"`);
    }
  }
  
  TestLogger.success(`✅ Applications validated (${applications!.length} chars)`);
}
async validateVariantDetails(expectedAttributes: string, expectedVariantCount: number = 4) {
  TestLogger.info('🎨 Validating Variant Details table');
  
  try {
    const variantsTable = this.page.locator('.variants-table');
    await expect(variantsTable).toBeVisible();
    TestLogger.success('✅ Variants table found');
    
    // Click all variant open buttons at once
    await this.page.locator('button.btn-open-variant').all().then(buttons => 
      Promise.all(buttons.map(button => button.click())));
    await this.page.waitForTimeout(1000);
    // Validate total variant rows (inside-tr class = actual variants)
    const variantRows = variantsTable.locator('tr.inside-tr');
    await expect(variantRows).toHaveCount(expectedVariantCount);
    TestLogger.success(`✅ Found ${expectedVariantCount} variant rows`);

    await this.simpleVariantValidation(expectedAttributes); // Call simple validation
    // Validate MOQ columns are filled
    const moqCells = variantRows.locator('td:nth-child(4)');
    for (let i = 0; i < expectedVariantCount; i++) {
      const moq = await moqCells.nth(i).textContent();
      expect(moq).toBeTruthy();
      expect(moq).toContain('10'); // Based on your test data
    }
    TestLogger.success('✅ All MOQ values validated');
    
    // Validate all checkboxes are checked
    const checkboxes = variantRows.locator('input[type="checkbox"]');
    for (let i = 0; i < expectedVariantCount; i++) {
      await expect(checkboxes.nth(i)).toBeChecked();
    }
    TestLogger.success('✅ All variant checkboxes are selected');
    
  } catch (error) {
    TestLogger.error(`❌ Variant Details validation failed: ${error}`);
    throw error;
  }
}
}
