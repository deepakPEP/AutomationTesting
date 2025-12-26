import { test, expect } from '@playwright/test';
import { Locator, Page } from "playwright-core";
import { TestLogger } from '../../utils/TestLogger';

export class ProductISellDashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async validateFirstContactRow(expectedProductISellDetails: {
    productName: string;
    noOfVariants: string;
    category: string;
    stockAvailability: string;
    display: string;
    price: string;
    status: string;
    sku_code: string;
    pricing_type?: string;
  }) {
    TestLogger.info('🔍 Validating Product Row');
    TestLogger.log(`Product: ${expectedProductISellDetails.productName}`);
    TestLogger.log(`Pricing Type: ${expectedProductISellDetails.pricing_type}`);

    //const firstRow = this.page.locator('table.p-datatable-table > tbody > tr').first();
     const firstRow = this.page.locator('table.p-datatable-table > tbody > tr')
        .filter({ has: this.page.locator('.t-p-i-txt', { hasText: expectedProductISellDetails.productName }) });
  
    const cells = firstRow.locator('td');

    // ✅ Cell 1: Product Name
    const productNameText = (await cells.nth(1).textContent())?.trim();
    TestLogger.log(`📦 Product Name: ${productNameText}`);
    await expect(productNameText).toMatch(expectedProductISellDetails.productName);

    // ✅ Cell 2: Number of Variants
    TestLogger.log(`📊 Variants: ${expectedProductISellDetails.noOfVariants}`);
    await expect(cells.nth(2)).toContainText(expectedProductISellDetails.noOfVariants);

    // ✅ Cell 3: Category
    const actual_string = (await cells.nth(3).textContent() || '').toLowerCase().trim();
    const expectedCategoryRaw = (expectedProductISellDetails.category || '').toLowerCase().trim();
    TestLogger.log(`🏷️ Category: ${actual_string}`);

    if (expectedCategoryRaw.includes('>')) {
      const expectedMain = expectedCategoryRaw.split('>').map(s => s.trim())[0];
      await expect(actual_string).toContain(expectedMain);
    } else {
      await expect(actual_string).toContain(expectedCategoryRaw);
    }

    // ✅ Cell 4: Checkbox (Display toggle)
    const checkbox = firstRow.locator('td[data-pc-name="datatable"] .forms-toggle input[type="checkbox"]');
    TestLogger.log(`✓ Display Checkbox: Not Checked`);
    await expect(checkbox).not.toBeChecked();

    // ✅ Cell 5: Stock Availability
    TestLogger.log(`📦 Stock: ${expectedProductISellDetails.stockAvailability}`);
    await expect(cells.nth(4)).toContainText(expectedProductISellDetails.stockAvailability);

    // ✅ Cell 6: Price (Handle different pricing types)
    await this.validatePriceCell(
      cells.nth(6),
      expectedProductISellDetails.price,
      expectedProductISellDetails.pricing_type
    );

    // ✅ Cell 7: SKU Code
    TestLogger.log(`🔑 SKU: ${expectedProductISellDetails.sku_code}`);
    await expect(cells.nth(7)).toHaveText(expectedProductISellDetails.sku_code);

    // ✅ Cell 8: Status
    TestLogger.log(`📌 Status: ${expectedProductISellDetails.status}`);
    await expect(cells.nth(8)).toHaveText(expectedProductISellDetails.status);

    TestLogger.success('✅ Product row validated successfully');
  }

  /**
   * Validate price cell based on pricing type
   * Simplified version - takes first and last prices for bulk
   */
  private async validatePriceCell(
    priceCell: Locator,
    expectedPrice: string,
    pricingType?: string
  ) {
    const rawPrice = (await priceCell.textContent()) || '';
    TestLogger.log(`💰 Pricing Type: ${pricingType}`);
    TestLogger.log(`💰 Raw Price Display: ${rawPrice}`);

    if (pricingType === 'request_quote' || pricingType === 'negotiable') {
      // ✅ Request Quote or Negotiable - Should display "--"
      TestLogger.log(`Expected: --`);
      await expect(priceCell).toHaveText('--');
      TestLogger.log(`✓ Negotiable/Request Quote validated`);
    }
    else if (pricingType === 'price_range' || pricingType === 'bulk') {
      // ✅ Price Range or Bulk - Format: "₹ MIN - ₹ MAX"
      
      // Extract price range from UI using regex
      const priceMatch = rawPrice.match(/₹\s*(\d+)\s*-\s*₹\s*(\d+)/);
      
      if (!priceMatch) {
        throw new Error(`❌ Invalid price range format: "${rawPrice}". Expected format: "₹ MIN - ₹ MAX"`);
      }

      const actualMin = priceMatch[1];
      const actualMax = priceMatch[2];
      const actualRange = `${actualMin}-${actualMax}`;

      TestLogger.log(`Extracted Min: ${actualMin}, Max: ${actualMax}`);

      // ✅ Simple approach: Extract first and last prices from JSON
      let expectedRange = '';
      
      try {
        if (expectedPrice.includes('[') && expectedPrice.includes('{')) {
          // Parse JSON array
          const pricingArray = JSON.parse(expectedPrice);
          
          if (Array.isArray(pricingArray) && pricingArray.length > 0) {
            // Get first and last prices
            const firstPrice = pricingArray[0].price;
            const lastPrice = pricingArray[pricingArray.length - 1].price;
            expectedRange = `${lastPrice}-${firstPrice}`;
            
            TestLogger.log(`📊 JSON Tiers: ${pricingArray.length}`);
            TestLogger.log(`First Price: ${firstPrice}, Last Price: ${lastPrice}`);
          }
        } else {
          // Simple MIN-MAX format
          expectedRange = expectedPrice.trim();
        }
      } catch (error) {
        throw new Error(
          `❌ Failed to parse price: "${expectedPrice}". ` +
          `Expected: "MIN-MAX" or JSON array`
        );
      }

      TestLogger.log(`Expected Range: ${expectedRange}`);
      TestLogger.log(`Actual Range: ${actualRange}`);

      // Validate the range matches
      await expect(actualRange).toBe(expectedRange);
      TestLogger.log(`✓ Price range validated`);

      // Validate symbols
      await expect(rawPrice).toContain('₹');
      await expect(rawPrice).toContain('-');

      TestLogger.success(`✓ ${pricingType === 'bulk' ? 'Bulk' : 'Price Range'} pricing validated`);
    }
    else {
      // ✅ Fixed Pricing - Format: "₹ PRICE / per Unit"
      TestLogger.log(`Expected: ₹ ${expectedPrice} / per Unit`);
      await expect(priceCell).toHaveText(`₹ ${expectedPrice} / per Unit`);
      TestLogger.log(`✓ Fixed pricing validated`);
    }
  }
}