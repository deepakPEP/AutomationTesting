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
 * Fill Offer Details for both "Fixed Discount" and "Buy More Get More" offer types.
 * Handles differences: "Fixed Discount" has unit price/unit, "Buy More Get More" does not.
 */
async fillOfferDetailsGeneric(params: {
  offerType: 'Fixed Discount' | 'Buy More Get More' | 'LOW MOQ Discount',
  unitPrice?: string,           // Only for Fixed Discount
  unit?: string,                // Only for Fixed Discount
  title: string,
  description: string,
  discountPercent?: number,     // Only for Fixed Discount
  offerMinOrderQty?: string,   // Optional
  offerMaxOrderQty?: string,   // Optional
  buyQty?: string,              // Only for Buy More Get More
  freeQty?: string,             // Only for Buy More Get More
  moq?: string,                 // Only for Buy More Get More
  startDate: string,           // Optional, format: 'DD/MM/YY'
  endDate: string,             // Optional, format: 'DD/MM/YY'
  keywords?: string[]           // Optional
}) {
  // Select Offer Type
  //await this.page.locator('.forms-select-2.p-dropdown:has(label.f-g-label:has-text("Offer Type")) .p-dropdown-trigger').click();
  // Click the Offer Type dropdown trigger (first dropdown)
await this.page.locator('.forms-select-2.p-dropdown').nth(0).locator('.p-dropdown-trigger').click();
// Select the desired offer type
await this.page.locator(`.p-dropdown-item:has-text("${params.offerType}")`).click();
  //await this.page.locator(`.p-dropdown-item:has-text("${params.offerType}")`).click();

  if (params.offerType === 'Fixed Discount') {
    // Assert unit price and unit if provided
    if (params.unitPrice) {
      const actualPrice = await this.page.locator('input[name="offerInfo.pricing.unitPrice"]').inputValue();
      await expect(actualPrice).toBe(params.unitPrice);
    }
    if (params.unit) {
      await expect(this.page.locator('input[readonly][disabled]')).toHaveValue(params.unit);
    }

    // Fill Offer Title and Description
    await this.page.getByRole('textbox', { name: 'Enter Title' }).fill(params.title);
    await this.page.getByRole('textbox', { name: 'Enter Offer Description' }).fill(params.description);

    // Fill Discount Percent
    const discount = params.discountPercent ?? Math.floor(Math.random() * 100) + 1;
    await this.page.locator('input[name="offerInfo.discountPercent"]').fill(discount.toString());
    
    // Calculate discounted price and assert
    if (params.unitPrice) {
      const discounted = parseFloat((parseFloat(params.unitPrice) * (1 - discount / 100)).toFixed(2));
      await expect(this.page.locator('input[name="offerInfo.pricing.unitPrice"]')).toHaveValue(String(discounted));
    }

    // Fill Min/Max quantity if needed (example values)
    await this.page.locator('input[name="offerInfo.minQty"]').fill(params.offerMinOrderQty || '5');
    await this.page.locator('input[name="offerInfo.maxQty"]').fill(params.offerMaxOrderQty || '50');
  }

  if (params.offerType === 'Buy More Get More') {
    // Fill Offer Title and Description
    await this.page.getByRole('textbox', { name: 'Enter Title' }).fill(params.title);
    await this.page.getByRole('textbox', { name: 'Enter Offer Description' }).fill(params.description);

    // Fill Buy/Free Quantity
    await this.page.locator('input[name="offerInfo.buyQty"]').fill(params.buyQty ?? '1');
    await this.page.locator('input[name="offerInfo.freeQty"]').fill(params.freeQty ?? '1');
    // No unit price/unit assertion for Buy More Get More
  }
  if (params.offerType === 'LOW MOQ Discount') {
    // Assert Actual MOQ value
    const actualMOQInput = this.page.locator('.forms-group:has(.f-g-label:has-text("Actual MOQ")) input[name="offerInfo.minOrderQuantity"]');
    await expect(actualMOQInput).toHaveValue(params.moq || '50' );

    // Assert Actual MOQ input is disabled
    await expect(actualMOQInput).toBeDisabled();

    const actualMOQValue = parseInt(await actualMOQInput.inputValue(), 10);

    // Fill Offer Minimum Order Quantity with Actual MOQ + 2
    const minQtyInput = this.page.locator('input[name="offerInfo.minQty"]');
    const invalidMinQty = (actualMOQValue + 2).toString();
    await minQtyInput.fill(invalidMinQty);

    await this.page.waitForTimeout(2000); // Wait for validation to trigger
    // Validate error message
    const errorMsg = this.page.locator('.forms-group:has(input[name="offerInfo.minQty"]) .error-msg');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toHaveText(/Minimum Order Quantity cannot exceed Actual MOQ/i);

    const validMinQty = (actualMOQValue - 2).toString();
    await minQtyInput.fill(validMinQty);

    await this.page.locator('input[name="offerInfo.maxQty"]').fill(params.offerMaxOrderQty || '50');

  }
  // let {todayFormatted, futureFormatted } = getTodayAndFutureDate(1);
   // console.log('futureFormatted: ',futureFormatted);
    await this.page.locator('label[for="StartDate"] + span input.p-inputtext').click()
    //await this.page.locator(`td[aria-label="${futureFormatted}"]`).click();
    await this.page.locator(`td[aria-label="${params.startDate}"]`).click();
    // await this.page.locator('div').filter({ hasText: /^End Date$/ }).getByPlaceholder('DD/MM/YY').click();
    await this.page.waitForTimeout(2000);
    const inputField = this.page.locator('label[for="EndDate"] + span input.p-inputtext');
    await inputField.click();

     const dateLocator = this.page.locator(`td[aria-label="${params.endDate}"]`);
         const isDisabled =
  (await dateLocator.getAttribute('aria-disabled')) === 'true' ||
  (await dateLocator.locator('span').first().getAttribute('data-p-disabled')) === 'true' ||
  (await dateLocator.locator('span').first().getAttribute('aria-disabled')) === 'true' ||
  (await dateLocator.locator('span').first().getAttribute('class') ?? '').includes('p-disabled');

if (isDisabled) {
  // Click the next-month button in your calendar
  await this.page.locator('button[aria-label="Next Month"]').click();
  // Try to click the date again (after month navigation)
  await this.page.locator(`td[aria-label="${params.endDate}"]`).click();
} else {
    await this.page.locator(`td[aria-label="${params.endDate}"]`).click();
  }

  // Fill Keywords if provided
  if (params.keywords && params.keywords.length > 0) {
    for (const keyword of params.keywords) {
      const chipsInput = this.page.locator('.forms-input.p-chips input[placeholder="Enter Keywords"]');
      await chipsInput.fill(keyword);
      await chipsInput.press('Enter');
    }
  }

  // Submit/Continue
  await this.page.locator('button.btn-comp.btn-right.btn-c-primary').click();
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

