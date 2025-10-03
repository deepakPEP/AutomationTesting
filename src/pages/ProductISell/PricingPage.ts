import { Locator, Page } from "playwright-core";
// PricingPage.js (Page Object)

export class PricingPage {
  readonly page: Page;

  readonly fixedPriceRadio: Locator;
  readonly bulkPricingRadio: Locator;
  readonly requestQuoteRadio: Locator;
  readonly priceRangeRadio: Locator;

  readonly unitTypeDropdown: Locator;
  readonly quantityFromInput: Locator;
  readonly quantityToInput: Locator;
  readonly priceInput: Locator;
  readonly addTierButton: Locator;

  readonly minPriceInput: Locator;
  readonly maxPriceInput: Locator;

  readonly minOrderQuantityInput: Locator;
  readonly unitPriceInput: Locator;

  constructor(page: Page) {
    this.page = page;
    // Selector for Pricing Type options
    this.fixedPriceRadio = this.page.locator('input[type="radio"][value="fixed"]');
    this.bulkPricingRadio = this.page.locator('input[type="radio"][value="bulk"]');
    this.requestQuoteRadio = this.page.locator('input[type="radio"][value="request_quote"]');
    this.priceRangeRadio = this.page.locator('input[type="radio"][value="price_range"]');
    
    // Selectors for the Bulk Pricing section
    this.unitTypeDropdown = this.page.locator('select[name="unit_type"]');
    this.quantityFromInput = this.page.locator('input[name="quantity_from"]');
    this.quantityToInput = this.page.locator('input[name="quantity_to"]');
    this.priceInput = this.page.locator('input[name="price"]');
    this.addTierButton = this.page.locator('button#add-tier');

    // Selectors for the Price Range section
    this.minPriceInput = this.page.locator('input[name="min_price"]');
    this.maxPriceInput = this.page.locator('input[name="max_price"]');

    // Selectors for the Request Quote section
    this.minOrderQuantityInput = this.page.locator('input[name="min_order_quantity"]');
    this.unitPriceInput = this.page.locator('input[name="unit_price"]');
  }

  // Methods for interacting with pricing options
  async selectFixedPrice() {
    await this.fixedPriceRadio.click();
  }

  async selectBulkPricing() {
    await this.bulkPricingRadio.click();
  }

  async selectRequestQuote() {
    await this.requestQuoteRadio.click();
  }

  async selectPriceRange() {
    await this.priceRangeRadio.click();
  }

  // Method to enter Bulk Pricing details
  async setBulkPricingDetails(quantityFrom: number, quantityTo: number, price: number) {
    //await this.unitTypeDropdown.selectOption({label: unitType});
    await this.quantityFromInput.fill(quantityFrom.toString());
    await this.quantityToInput.fill(quantityTo.toString());
    await this.priceInput.fill(price.toString());
  }

  // Method to enter Price Range details
  async setPriceRangeDetails(minPrice:number, maxPrice:number,minOrderQuantity: number) {
    await this.minPriceInput.fill(minPrice.toString());
    await this.maxPriceInput.fill(maxPrice.toString());
    await this.minOrderQuantityInput.fill(minOrderQuantity.toString());
  }
  async setFixedPriceDetails(unit_price : number,minOrderQuantity: number) {
    //await this.minPriceInput.fill(minPrice.toString());
    //await this.maxPriceInput.fill(maxPrice.toString());
    await this.unitPriceInput.fill(unit_price.toString());
    await this.minOrderQuantityInput.fill(minOrderQuantity.toString());
  }
  // Method to enter Request Quote details
  async setRequestQuoteDetails(minOrderQuantity: number) {
    await this.minOrderQuantityInput.fill(minOrderQuantity.toString());
  }

  // Method to add a tier for bulk pricing
  async addBulkPricingTier( quantityFrom: number, quantityTo: number, price: number) {
    await this.setBulkPricingDetails(quantityFrom, quantityTo, price);
   // await this.addTierButton.click();
  }
}

module.exports = PricingPage;
