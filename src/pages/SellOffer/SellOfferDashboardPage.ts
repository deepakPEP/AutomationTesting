import { test, expect } from '@playwright/test';
import { Locator, Page } from "playwright-core";
import { PriceFormatter, comparePrices, createPriceMatcher } from '../../utils/PriceFormatter';
// SellOfferDashboardPage.js (Page Object)

export class SellDashboardPage {
  readonly page: Page;


  constructor(page: Page) {
    this.page = page;
    
       
  }
  async validateFirstContactRow(expectedSellOfferDetails: {
      productName: string;
      offerType: string;
      offerTitle: string;
      offerPrice: string;
      MOQ: string;
      display: string;
      dateCreated: string;
      expiringIn: string;
      status: string;
    }) {
      const firstRow = this.page.locator('table.p-datatable-table > tbody > tr').first();
      const cells = firstRow.locator('td');
  
      // ✅ Validate dynamic values
      await expect((await cells.nth(1).textContent())?.trim()).toMatch(expectedSellOfferDetails.productName);
      await expect(await cells.nth(2)).toContainText(expectedSellOfferDetails.offerType);
      //as of now category not showing 
      //const actual_string = await cells.nth(3).textContent() || '';
      await expect(await cells.nth(3)).toContainText(expectedSellOfferDetails.offerTitle);

      // as of now not to be checked. need to add if condition later
      const checkbox = firstRow.locator('td[data-pc-name="datatable"] .forms-toggle input[type="checkbox"]');

      await expect(checkbox).not.toBeChecked();
      // Price validation with flexible formatting
      const actualPrice = await cells.nth(4).textContent();
      console.log('Expected price:', expectedSellOfferDetails.offerPrice);
      console.log('Actual price:', actualPrice?.trim());
      
      // Use flexible price matching to handle formatting differences
      if (actualPrice) {
        const priceMatches = comparePrices(expectedSellOfferDetails.offerPrice, actualPrice);
        if (!priceMatches) {
          // If exact comparison fails, try pattern matching
          const priceMatcher = createPriceMatcher(expectedSellOfferDetails.offerPrice);
          await expect(actualPrice.trim()).toMatch(priceMatcher);
        }
      } else {
        throw new Error('Price cell is empty or not found');
      }
      //console.log('display:', expectedProductISellDetails.display);
      await expect(await cells.nth(5)).toContainText(expectedSellOfferDetails.MOQ);
      console.log('dateCreated:', expectedSellOfferDetails.dateCreated);
      console.log('actual dateCreated:', (await cells.nth(7).textContent())?.trim());
      await expect(await cells.nth(7)).toHaveText(expectedSellOfferDetails.dateCreated);
      
      // ✅ Validate 3-dot action menu is visible (last cell)
      await expect(await cells.nth(8)).toHaveText(expectedSellOfferDetails.expiringIn);
      await expect(await cells.nth(9)).toHaveText(expectedSellOfferDetails.status);
    }
}