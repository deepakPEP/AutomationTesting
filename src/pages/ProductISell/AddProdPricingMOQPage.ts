import { Locator, Page } from "playwright-core";
import { expect } from "@playwright/test";
import { time } from "console";

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
    await this.bulkPricingRadio.click({ timeout: 60000 });
    await expect(this.bulkPricingRadio).toBeChecked();
  }

  async selectRequestQuote() {
    await this.requestQuoteRadio.click({ timeout: 60000 });
    await expect(this.requestQuoteRadio).toBeChecked();
  }

  async selectPriceRange() {
    await this.priceRangeRadio.click({ timeout: 60000 });
    await expect(this.priceRangeRadio).toBeChecked();
  }
  async selectNegotiablePrice() {
    await this.negotiablePriceRadio.click({ timeout: 60000 });
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
  async setPriceRangeDetails(minPrice:number, maxPrice:number) {
    await this.minPriceInput.fill(minPrice.toString(),{timeout: 60000 });
    await this.maxPriceInput.fill(maxPrice.toString(),{ timeout: 60000 });
    //await this.minOrderQuantityInput.fill(minOrderQuantity.toString());
  }
  async setFixedPriceDetails(unit_price : number) {
    //await this.minPriceInput.fill(minPrice.toString());
    //await this.maxPriceInput.fill(maxPrice.toString());
    console.log('unit_price',unit_price);
    await this.unitPriceInput.fill(unit_price.toString(),{ timeout: 60000 });
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
    await this.select_currency.click({timeout:60000});
    await this.currency_option.click({timeout:60000});//can be dynamic based on product
    await this.page.waitForTimeout(3000);
    
   switch (product.pricing_type) {
    case 'Fixed': {
      await this.selectFixedPrice();
      await expect(fixedPriceSection).toBeVisible();
      await expect(bulkSection).toHaveCount(0);
      await expect(priceRangeSection).toHaveCount(0);
      const unitPrice = product.unit_price ?? 1000;
      const moq = product.moq ?? 1;
      await this.selectUnit(product.unit || 'Pieces', moq);
      await this.setFixedPriceDetails(unitPrice);
      
      break;
    }

    case 'bulk': {
      await this.selectBulkPricing();
      await expect(fixedPriceSection).toHaveCount(0);
      await expect(bulkSection).toHaveCount(3)
      await expect(priceRangeSection).toHaveCount(0);
      await this.selectUnitButton.click({timeout:60000});
  await this.page.locator('li.p-dropdown-item[aria-label="' + product.unit + '"]').click({force:true});
      //await this.selectUnit(product.unit || 'Pieces', product.moq);
      await this.page.waitForTimeout(2000);
     const bulkCell = product.unit_price;
  let bulk: any[] = [];
  if (Array.isArray(bulkCell)) bulk = bulkCell;
  else if (typeof bulkCell === 'string' && bulkCell.trim()) {
    try { bulk = JSON.parse(bulkCell); } catch { bulk = []; }
  }
  if (!bulk.length) break;

  for (let i = 0; i < bulk.length; i++) {
    const tier = bulk[i];
    if (i > 0) {
      await this.page.locator('button', { hasText: 'Add Tier' }).first().click({timeout:60000});
      await this.page.waitForTimeout(200);
    }

    const minSel = `input[name="pricing.bulkPrices.${i}.minQty"]`;
    const maxSel = `input[name="pricing.bulkPrices.${i}.maxQty"]`;
    const priceSel = `input[name="pricing.bulkPrices.${i}.price"]`;

    await this.page.locator(minSel).fill(String(tier.minQty ?? ''));
    await this.page.locator(maxSel).fill(String(tier.maxQty ?? ''));
    await this.page.locator(priceSel).fill(String(tier.price ?? ''));

    await this.page.keyboard.press('Tab');
  }
  break;
}

    case 'request_quote': {
      await this.selectRequestQuote();
      await expect(fixedPriceSection).toHaveCount(0);
      await expect(bulkSection).toHaveCount(0);
      await expect(priceRangeSection).toHaveCount(0);

      const moq = product.moq ?? 1;
      
      //await this.setRequestQuoteDetails(moq);
    await this.selectUnit(product.unit || 'Pieces', product.moq);
    await this.page.waitForTimeout(3000);
      break;
    }

    case 'price_range': {
      await this.selectPriceRange();
      await expect(fixedPriceSection).toHaveCount(0);
      await expect(bulkSection).toHaveCount(0);
      await expect(priceRangeSection).toHaveCount(2);
      
      const raw = product?.unit_price ?? '';
      const unitPriceStr = typeof raw === 'number' ? String(raw) : (raw as string);
      const [minStr = '', maxStr = ''] = unitPriceStr.split('-').map(s => s.trim());
      const minPrice = parseFloat(minStr.replace(/[^\d.]/g, '')) || 0;
      const maxPrice = parseFloat(maxStr.replace(/[^\d.]/g, '')) || 0;
      const moq = product.moq ?? 1;
      await this.setPriceRangeDetails(minPrice, maxPrice);
    await this.selectUnit(product.unit || 'Pieces', moq);
    await this.page.waitForTimeout(3000);
      break;
    }

    case 'negotiable': {
      await this.selectNegotiablePrice();
      await expect(fixedPriceSection).toHaveCount(0);
      await expect(bulkSection).toHaveCount(0);
      await expect(priceRangeSection).toHaveCount(0);

    await this.selectUnit(product.unit || 'Pieces', product.moq);
    await this.page.waitForTimeout(3000);
      break;
    }
    
  }
}

async selectUnit(unitName: string, minOrderQuantity: number) {
  const name = (unitName || '').trim();
  // open dropdown (safe to call even if already open)
  await this.selectUnitButton.click({ timeout: 60000 });
  await this.page.waitForTimeout(2000);
  await this.page.locator('li.p-dropdown-item[aria-label="' + unitName + '"]').click({force:true});
  await this.page.waitForTimeout(2000);
  await this.minOrderQuantityInput.fill(minOrderQuantity.toString(),{ timeout: 60000 });
}

}
