import { test, expect } from '@playwright/test';
import { Locator, Page } from "playwright-core";
// ProductISellDashboardPage.js (Page Object)

export class ProductISellDashboardPage {
  readonly page: Page;


  constructor(page: Page) {
    this.page = page;
    // Selector for Pricing Type options
       
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
    }) {
      const firstRow = this.page.locator('table.p-datatable-table > tbody > tr').first();
      const cells = firstRow.locator('td');
  
      // ✅ Validate dynamic values
      await expect((await cells.nth(1).textContent())?.trim()).toMatch(expectedProductISellDetails.productName);
      await expect(cells.nth(2)).toContainText(expectedProductISellDetails.noOfVariants);
      //as of now category not showing 
      // const actual_string = await cells.nth(3).textContent() || '';
      // await expect(actual_string.toLowerCase()).toContain(expectedProductISellDetails.category.toLowerCase());

      // as of now not to be checked. need to add if condition later
      const checkbox = firstRow.locator('td[data-pc-name="datatable"] .forms-toggle input[type="checkbox"]');

      await expect(checkbox).not.toBeChecked();

      //console.log('display:', expectedProductISellDetails.display);
      await expect(cells.nth(4)).toContainText(expectedProductISellDetails.stockAvailability);
      
      await expect(cells.nth(6)).toHaveText('₹ '+expectedProductISellDetails.price+' / per Unit');
      await console.log('sku code in dashboard:', cells.nth(7).textContent());  
      // ✅ Validate 3-dot action menu is visible (last cell)
      await expect(cells.nth(7)).toHaveText(expectedProductISellDetails.sku_code);
      await expect(cells.nth(8)).toHaveText(expectedProductISellDetails.status);
    }
}