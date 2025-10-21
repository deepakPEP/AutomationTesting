import { Locator, Page } from "playwright-core";
import { expect } from "@playwright/test";

export class PricingMOQPage {
  readonly page: Page;

  readonly select_currency: Locator;
  readonly currency_option: Locator;
  readonly unitPriceInput: Locator;
  readonly selectUnitButton: Locator;
  readonly unitOption: Locator;

  readonly fixedPriceRadio: Locator;
  readonly bulkPricingRadio: Locator;
  readonly requestQuoteRadio: Locator;
  readonly priceRangeRadio: Locator;
  readonly negotiablePriceRadio: Locator;

  readonly unitTypeDropdown: Locator;
  readonly quantityFromInput: Locator;
  readonly quantityToInput: Locator;
  readonly priceInput: Locator;
  readonly addTierButton: Locator;

  readonly minPriceInput: Locator;
  readonly maxPriceInput: Locator;

  readonly minOrderQuantityInput: Locator;
    
  constructor(page: Page) {
    this.page = page;

    //this.select_currency = page.locator('span').filter({ hasText: 'Select Currency' });
    this.select_currency = page.locator('[aria-label="Select Currency"]');
    //this.currency_option = page.getByRole('option', { name: 'Indian Rupee' });
    this.currency_option = page.locator('[aria-label="Indian Rupee"]');
    this.unitPriceInput =  page.locator('input[placeholder="Enter Unit Price"]');
    this.selectUnitButton = page.getByRole('button', { name: 'Select Unit' });
    this.unitOption = page.getByRole('option', { name: 'Pieces' }); //can 
    this.fixedPriceRadio = this.page.locator('input[type="radio"][value="fixed"]');
    this.bulkPricingRadio = this.page.locator('input[type="radio"][value="bulk"]');
    this.requestQuoteRadio = this.page.locator('input[type="radio"][id="requestQuote"]');
    this.priceRangeRadio = this.page.locator('input[type="radio"][value="priceRange"]');
    this.negotiablePriceRadio = this.page.locator('input[type="radio"][id="negotiable"]');
    
    // Selectors for the Bulk Pricing section
    this.unitTypeDropdown = this.page.locator('select[name="unit_type"]');
    this.quantityFromInput = this.page.locator('input[name="quantity_from"]');
    this.quantityToInput = this.page.locator('input[name="quantity_to"]');
    this.priceInput = this.page.locator('input[name="price"]');
    this.addTierButton = this.page.locator('button#add-tier');

    // Selectors for the Price Range section
    this.minPriceInput = this.page.locator('input[name="pricing.minPrice"]');
    this.maxPriceInput = this.page.locator('input[name="pricing.maxPrice"]');

    // Selectors for the Request Quote section
    this.minOrderQuantityInput = this.page.locator('input[placeholder="Enter Numeric"]');
  }
   // Methods for interacting with pricing options
  async selectFixedPrice() {
    await this.fixedPriceRadio.click();
    await expect(this.fixedPriceRadio).toBeChecked();
    await this.page.waitForTimeout(2000);
    
  }

  async selectBulkPricing() {
    await this.bulkPricingRadio.click();
    await expect(this.bulkPricingRadio).toBeChecked();
  }

  async selectRequestQuote() {
    await this.requestQuoteRadio.click();
    await expect(this.requestQuoteRadio).toBeChecked();
  }

  async selectPriceRange() {
    await this.priceRangeRadio.click();
    await expect(this.priceRangeRadio).toBeChecked();
  }
  async selectNegotiablePrice() {
    await this.negotiablePriceRadio.click();
    await expect(this.negotiablePriceRadio).toBeChecked();
  }
  // Method to enter Bulk Pricing details
  // async setBulkPricingDetails(quantityFrom: number, quantityTo: number, price: number,) {
  //   //await this.unitTypeDropdown.selectOption({label: unitType});
  //   await this.quantityFromInput.fill(quantityFrom.toString());
  //   await this.quantityToInput.fill(quantityTo.toString());
  //   await this.priceInput.fill(price.toString());
  // }

  // Method to enter Price Range details
  async setPriceRangeDetails(minPrice:number, maxPrice:number,minOrderQuantity: number) {
    await this.minPriceInput.fill(minPrice.toString());
    await this.maxPriceInput.fill(maxPrice.toString());
    await this.minOrderQuantityInput.fill(minOrderQuantity.toString());
  }
  async setFixedPriceDetails(unit_price : number,minOrderQuantity: number) {
    //await this.minPriceInput.fill(minPrice.toString());
    //await this.maxPriceInput.fill(maxPrice.toString());
    console.log('unit_price',unit_price);
    console.log('minOrderQuantity',minOrderQuantity);
    await this.unitPriceInput.fill(unit_price.toString());
    await this.minOrderQuantityInput.fill(minOrderQuantity.toString());
  }
  private unitTypeForRow(rowIndex: number) {
  return this.page.locator(`select[name="unit_type"]`).nth(rowIndex);
}
  async setBulkPricingDetails(quantityFrom: number, quantityTo: number, price: number, unitType?: string, rowIndex = 0) {
  await this.quantityFromInput.nth(rowIndex).fill(String(quantityFrom));
  await this.quantityToInput.nth(rowIndex).fill(String(quantityTo));
  if (unitType) {
    await this.unitTypeForRow(rowIndex).selectOption({ label: unitType });
  }
  await this.priceInput.nth(rowIndex).fill(String(price));
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
  async fillPricingMOQ(product: any) {

    const fixedPriceSection = this.page.locator('input[placeholder*="Unit Price"], input[name*="pricing.unitPrice"]');
    const bulkSection = this.page.locator('input[name*="pricing.bulkPrices.0.minQty"], input[name*="pricing.bulkPrices.0.price"], button:has-text("Add tier")');
    const priceRangeSection = this.page.locator('input[placeholder*="Min"],input[placeholder*="Max"]');

    await this.select_currency.waitFor({ state: 'attached' }); 
    await this.select_currency.click();
    await this.currency_option.click();//can be dynamic based on product
    await this.selectUnit(product.unit || 'Pieces');
    await this.page.waitForTimeout(3000);
    
   switch (product.pricing_type) {
    case 'Fixed': {
      await this.selectFixedPrice();
      await expect(fixedPriceSection).toBeVisible();
      await expect(bulkSection).toHaveCount(0);
      await expect(priceRangeSection).toHaveCount(0);
      const unitPrice = product.unit_price ?? 1000;
      const moq = product.moq ?? 1;
      await this.selectUnit(product.unit || 'Pieces');
      await this.setFixedPriceDetails(unitPrice, moq);
      
      break;
    }

    case 'bulk': {
      await this.selectBulkPricing();
      await expect(fixedPriceSection).toHaveCount(0);
      await expect(bulkSection).toBeVisible();
      await expect(priceRangeSection).toHaveCount(0);

      const tiers = product.bulk && product.bulk.length ? product.bulk : [{ from: 1, to: 10, price: 1000 }];
      for (let i = 0; i < tiers.length; i++) {
        const t = tiers[i];
        // Fill first row
        if (i === 0) {
          await this.setBulkPricingDetails(t.from, t.to, t.price, t.unitType, 0);
        } else {
          // Add new tier row, then fill it
          await this.addTierButton.click();
          await this.setBulkPricingDetails(t.from, t.to, t.price, t.unitType, i);
        }
      }
      break;
    }

    case 'request_quote': {
      await this.selectRequestQuote();
      await expect(fixedPriceSection).toHaveCount(0);
      await expect(bulkSection).toHaveCount(0);
      await expect(priceRangeSection).toHaveCount(0);

      const moq = product.moq ?? 1;
      await this.page.pause();
      await this.setRequestQuoteDetails(moq);
    await this.selectUnit(product.unit || 'Pieces');
    await this.page.waitForTimeout(3000);
      break;
    }

    case 'price_range': {
      await this.selectPriceRange();
      await expect(fixedPriceSection).toHaveCount(0);
      await expect(bulkSection).toHaveCount(0);
      await expect(priceRangeSection).toHaveCount(2);
      
      // const parts = product.unit_price.split('-').map(str => str.trim());
      // const minPrice = parts[0] ? parseFloat(parts[0]) : 0;
      // const maxPrice = parts[1] ? parseFloat(parts[1]) : 0;
      const raw = product?.unit_price ?? '';
      const unitPriceStr = typeof raw === 'number' ? String(raw) : (raw as string);
      const [minStr = '', maxStr = ''] = unitPriceStr.split('-').map(s => s.trim());
      const minPrice = parseFloat(minStr.replace(/[^\d.]/g, '')) || 0;
      const maxPrice = parseFloat(maxStr.replace(/[^\d.]/g, '')) || 0;
      const moq = product.moq ?? 1;
      await this.setPriceRangeDetails(minPrice, maxPrice, moq);
    await this.selectUnit(product.unit || 'Pieces');
    await this.page.waitForTimeout(3000);
      break;
    }

    case 'negotiable': {
      await this.selectNegotiablePrice();
      await expect(fixedPriceSection).toHaveCount(0);
      await expect(bulkSection).toHaveCount(0);
      await expect(priceRangeSection).toHaveCount(0);

    await this.selectUnit(product.unit || 'Pieces');
    await this.page.waitForTimeout(3000);
      break;
    }
    
  }
}

async selectUnit(unitName: string) {
  const name = (unitName || '').trim();
  // open dropdown (safe to call even if already open)
  await this.selectUnitButton.click();
  await this.page.locator('li.p-dropdown-item[aria-label="' + unitName + '"]').click({force:true});
}

}
