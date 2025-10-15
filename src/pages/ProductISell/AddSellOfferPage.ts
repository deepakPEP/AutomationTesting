// src/pages/SellOfferDetailsPage.ts
import { Page, expect } from '@playwright/test';
import { getTodayAndFutureDate,getconvertDateFormat } from '../../utils/Dateutlis';
import {SellOfferProductPage} from '../SellOffer/SellOfferProductPage'
import {ProductInformationPage} from './AddProductInfoPage'



export class AddSellOfferPage {

  readonly sellOfferProductPage: SellOfferProductPage;
  readonly prodInfoPage: ProductInformationPage;

  constructor(private page: Page) {
    this.sellOfferProductPage = new SellOfferProductPage(page);
    this.prodInfoPage = new ProductInformationPage(page);

    
  }
 
  // Assert Offer Price without Discount

  /**
 * Fill Offer Details for all offer types with clean modular approach
 */
async fillOfferDetailsGeneric(params: {
  offerType: 'Fixed Discount' | 'Buy More Get More' | 'LOW MOQ Discount',
  unitPrice?: string,
  unit?: string,
  title: string,
  description: string,
  discountPercent?: number,
  offerMinOrderQty?: string,
  offerMaxOrderQty?: string,
  buyQty?: string,
  freeQty?: string,
  moq?: string,
  startDate: string,
  endDate: string,
  keywords?: string[]
}) {
  // Step 1: Select offer type and fill basic details
  await this.selectOfferType(params.offerType);
  await this.fillBasicOfferDetails(params.title, params.description);

  // Step 2: Handle offer type specific configurations
  await this.handleOfferTypeSpecificSettings(params);

  // Step 3: Set offer validity dates
  await this.setOfferValidityDates(params.startDate, params.endDate);

  // Step 4: Add keywords if provided
  await this.addKeywords(params.keywords);

  // Step 5: Submit the form
  await this.submitOfferForm();
}

/**
 * Select the offer type from dropdown
 */
private async selectOfferType(offerType: string) {
  await this.page.locator('.forms-select-2.p-dropdown').nth(0).locator('.p-dropdown-trigger').click();
  await this.page.locator(`.p-dropdown-item:has-text("${offerType}")`).click();
  await this.page.waitForTimeout(2000);
}

/**
 * Fill basic offer title and description
 */
private async fillBasicOfferDetails(title: string, description: string) {
  await this.page.getByRole('textbox', { name: 'Enter Title' }).fill(title);
  await this.page.getByRole('textbox', { name: 'Enter Offer Description' }).fill(description);
}

/**
 * Handle offer type specific settings
 */
private async handleOfferTypeSpecificSettings(params: any) {
  switch (params.offerType) {
    case 'Fixed Discount':
      await this.configureFixedDiscountOffer(params);
      break;
    case 'Buy More Get More':
      await this.configureBuyMoreGetMoreOffer(params);
      break;
    case 'LOW MOQ Discount':
      await this.configureLowMOQDiscountOffer(params);
      break;
    default:
      throw new Error(`Unsupported offer type: ${params.offerType}`);
  }
}

/**
 * Configure Fixed Discount offer specific settings
 */
private async configureFixedDiscountOffer(params: {
  unitPrice?: string,
  unit?: string,
  discountPercent?: number,
  offerMinOrderQty?: string,
  offerMaxOrderQty?: string
}) {
  // Validate unit price and unit if provided
  await this.validateUnitPriceAndUnit(params.unitPrice, params.unit);

  // Apply discount and validate calculation
  const discount = params.discountPercent ?? Math.floor(Math.random() * 100) + 1;
  await this.applyDiscountPercentage(discount, params.unitPrice);

  // Set quantity limits
  await this.setQuantityLimits(params.offerMinOrderQty || '5', params.offerMaxOrderQty || '50');
}

/**
 * Configure Buy More Get More offer specific settings
 */
private async configureBuyMoreGetMoreOffer(params: {
  buyQty?: string,
  freeQty?: string
}) {
  await this.page.locator('input[name="offerInfo.buyQty"]').fill(params.buyQty ?? '1');
  await this.page.locator('input[name="offerInfo.freeQty"]').fill(params.freeQty ?? '1');
}

/**
 * Configure Low MOQ Discount offer specific settings
 */
private async configureLowMOQDiscountOffer(params: {
  moq?: string,
  offerMinOrderQty?: string,
  offerMaxOrderQty?: string
}) {
  // Validate actual MOQ
  const actualMOQInput = this.page.locator('.forms-group:has(.f-g-label:has-text("Actual MOQ")) input[name="offerInfo.minOrderQuantity"]');
  await expect(actualMOQInput).toHaveValue(params.moq || '50');
  await expect(actualMOQInput).toBeDisabled();

  // Test validation with invalid min quantity
  await this.testMOQValidation(actualMOQInput, params.offerMinOrderQty || '5');

  // Set final quantity limits
  await this.setQuantityLimits(params.offerMinOrderQty || '5', params.offerMaxOrderQty || '50');
}

/**
 * Validate unit price and unit for Fixed Discount offers
 */
private async validateUnitPriceAndUnit(unitPrice?: string, unit?: string) {
  if (unitPrice) {
    const actualPrice = await this.page.locator('input[name="offerInfo.pricing.unitPrice"]').inputValue();
    await expect(actualPrice).toBe(unitPrice);
  }
  if (unit) {
    await expect(this.page.locator('input[readonly][disabled]')).toHaveValue(unit);
  }
}

/**
 * Apply discount percentage and validate price calculation
 */
private async applyDiscountPercentage(discount: number, unitPrice?: string) {
  await this.page.locator('input[name="offerInfo.discountPercent"]').fill(discount.toString());
  
  if (unitPrice) {
    const discounted = parseFloat((parseFloat(unitPrice) * (1 - discount / 100)).toFixed(2));
    await expect(this.page.locator('input[name="offerInfo.pricing.unitPrice"]')).toHaveValue(String(discounted));
  }
}

/**
 * Set quantity limits (min and max)
 */
private async setQuantityLimits(minQty: string, maxQty: string) {
  await this.page.locator('input[name="offerInfo.minQty"]').fill(minQty);
  await this.page.locator('input[name="offerInfo.maxQty"]').fill(maxQty);
}

/**
 * Test MOQ validation by entering invalid value first
 */
private async testMOQValidation(actualMOQInput: any, validMinQty: string) {
  const actualMOQValue = parseInt(await actualMOQInput.inputValue(), 10);
  const minQtyInput = this.page.locator('input[name="offerInfo.minQty"]');
  
  // Test with invalid value (actual MOQ + 2)
  const invalidMinQty = (actualMOQValue + 2).toString();
  await minQtyInput.fill(invalidMinQty);
  await this.page.waitForTimeout(2000);
  
  // Validate error message appears
  await expect(this.page.locator('.error-txt')).toBeVisible();
  await expect(this.page.getByText('minQty must be less than actual MOQ')).toBeVisible();
  await this.page.waitForTimeout(2000);
  
  // Set valid value
  await minQtyInput.fill(validMinQty);
}

/**
 * Set offer validity dates with smart date handling
 */
private async setOfferValidityDates(startDate: string, endDate: string) {
  // Set start date
  await this.page.locator('label[for="StartDate"] + span input.p-inputtext').click();
  await this.page.locator(`td[aria-label="${startDate}"]`).click();
  await this.page.waitForTimeout(2000);

  // Set end date with disabled date handling
  await this.page.locator('label[for="EndDate"] + span input.p-inputtext').click();
  await this.selectEndDateWithFallback(endDate);
}

/**
 * Select end date with fallback for disabled dates
 */
private async selectEndDateWithFallback(endDate: string) {
  const dateLocator = this.page.locator(`td[aria-label="${endDate}"]`);
  
  const isDisabled = await this.isDateDisabled(dateLocator);
  
  if (isDisabled) {
    await this.page.locator('button[aria-label="Next Month"]').click();
  }
  
  await this.page.locator(`td[aria-label="${endDate}"]`).click();
}

/**
 * Check if a date is disabled in the calendar
 */
private async isDateDisabled(dateLocator: any): Promise<boolean> {
  const checks = await Promise.all([
    dateLocator.getAttribute('aria-disabled'),
    dateLocator.locator('span').first().getAttribute('data-p-disabled'),
    dateLocator.locator('span').first().getAttribute('aria-disabled'),
    dateLocator.locator('span').first().getAttribute('class')
  ]);

  return checks[0] === 'true' || 
         checks[1] === 'true' || 
         checks[2] === 'true' || 
         (checks[3] ?? '').includes('p-disabled');
}

/**
 * Add keywords to the offer
 */
private async addKeywords(keywords?: string[]) {
  if (keywords && keywords.length > 0) {
    const chipsInput = this.page.locator('.forms-input.p-chips input[placeholder="Enter Keywords"]');
    
    for (const keyword of keywords) {
      await chipsInput.fill(keyword);
      await chipsInput.press('Enter');
    }
  }
}

/**
 * Submit the offer form
 */
private async submitOfferForm() {
  await this.page.locator('button.btn-comp.btn-right.btn-c-primary').click();
}

/**
 * Standalone method to validate discount calculation
 */
async validateDiscountCalculation(originalPrice: string, discountPercent: number): Promise<number> {
  const original = parseFloat(originalPrice);
  const expected = parseFloat((original * (1 - discountPercent / 100)).toFixed(2));
  
  const actualPriceText = await this.page.locator('input[name="offerInfo.pricing.unitPrice"]').inputValue();
  const actual = parseFloat(actualPriceText);
  
  await expect(actual).toBeCloseTo(expected, 2);
  return expected;
}

/**
 * Standalone method to set custom quantity limits
 */
async setCustomQuantityLimits(minQty: string, maxQty: string) {
  await this.setQuantityLimits(minQty, maxQty);
}

/**
 * Standalone method to add single keyword
 */
async addSingleKeyword(keyword: string) {
  const chipsInput = this.page.locator('.forms-input.p-chips input[placeholder="Enter Keywords"]');
  await chipsInput.fill(keyword);
  await chipsInput.press('Enter');
}

  async verifyOfferPriceWithoutDiscount(): Promise<void> {
    
    // Get the unit price value
    //  it only takes (reads) whatever value is already present in the value attribute of that input on the page.
    const actualPriceText = await this.page.locator('input[name="offerInfo.pricing.unitPrice"]').inputValue();
    const actualPrice = parseFloat(actualPriceText?.replace(/[^\d.]/g, '') || '0');

    // Get the offer price value
    const offerPriceText = await this.page.locator('input[name="offerInfo.pricing.offerPrice"]').inputValue();
    const offerPrice = parseFloat(offerPriceText?.replace(/[^\d.]/g, '') || '0');

    // Assert both are the same since no discount is applied
     expect(offerPrice).toBeCloseTo(actualPrice, 2);
  }
  

}

