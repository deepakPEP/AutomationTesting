import { test, expect } from '@playwright/test';
import { Locator, Page } from "playwright-core";
// ProductISellDashboardPage.js (Page Object)

export class ProductISellDashboardPage {
  readonly page: Page;


  constructor(page: Page) {
    this.page = page;
    // Selector for Pricing Type options
       
  }
  // async validateFirstContactRow(expectedProductISellDetails: {
  //     productName: string;
  //     noOfVariants: string;
  //     category: string;
  //     stockAvailability: string;
  //     display: string;
  //     price: string;
  //     status: string;
  //     sku_code: string;
  //     pricing_type?: string;
  //   }) {
  //     const firstRow = this.page.locator('table.p-datatable-table > tbody > tr').first();
  //     const cells = firstRow.locator('td');
  
  //     // ✅ Validate dynamic values
  //     await expect((await cells.nth(1).textContent())?.trim()).toMatch(expectedProductISellDetails.productName);
  //     await expect(cells.nth(2)).toContainText(expectedProductISellDetails.noOfVariants);
  //     //as of now category not showing 
  //     const actual_string = (await cells.nth(3).textContent() || '').toLowerCase().trim();

  //     const expectedCategoryRaw = (expectedProductISellDetails.category || '').toLowerCase().trim();
  //     if (expectedCategoryRaw.includes('>')) {
  //       // expected contains hierarchy "parent > child > ...", compare only top-level parent
  //       const expectedMain = expectedCategoryRaw.split('>').map(s => s.trim())[0];
  //       await expect(actual_string).toContain(expectedMain);
  //     } else {
  //       await expect(actual_string).toContain(expectedCategoryRaw);
  //     }
  //     // as of now not to be checked. need to add if condition later
  //     const checkbox = firstRow.locator('td[data-pc-name="datatable"] .forms-toggle input[type="checkbox"]');

  //     await expect(checkbox).not.toBeChecked();

  //     //console.log('display:', expectedProductISellDetails.display);
  //     await expect(cells.nth(4)).toContainText(expectedProductISellDetails.stockAvailability);
      
      
  //     if (expectedProductISellDetails.pricing_type=='request_quote' || expectedProductISellDetails.pricing_type=='negotiable'){ 
  //     await expect(cells.nth(6)).toHaveText(expectedProductISellDetails.price);
  //     }
      
  //     else if (expectedProductISellDetails.pricing_type=='price_range'){ 
  //     //await expect(cells.nth(6)).toHaveText(expectedProductISellDetails.price);
  //     console.log('Validating price range: ', cells.nth(6).textContent());
  //     const rawPrice = (await cells.nth(6).textContent()) || '';
  //     // keep only digits and hyphen, e.g. "₹  200 - ₹  400 / per Unit" -> "200-400"
  //     const actualRange = rawPrice.replace(/[^\d-]/g, '').trim();
  //     const expectedRange = (expectedProductISellDetails.price || '').replace(/[^\d-]/g, '').trim();
  //     await expect(actualRange).toBe(expectedRange);
  //     // optional: ensure unit suffix exists
  //     await expect(rawPrice).toContain('/ per Unit');
  //     }
  //     else{
  //       await expect(cells.nth(6)).toHaveText('₹ '+expectedProductISellDetails.price+' / per Unit');
  //     }
  //     // ✅ Validate 3-dot action menu is visible (last cell)
  //     await expect(cells.nth(7)).toHaveText(expectedProductISellDetails.sku_code);
  //     await expect(cells.nth(8)).toHaveText(expectedProductISellDetails.status);
  //   }
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
      // Find the row that contains the expected product name
      const targetRow = this.page.locator('table.p-datatable-table > tbody > tr')
        .filter({ has: this.page.locator('.t-p-i-txt', { hasText: expectedProductISellDetails.productName }) });
      
      // Assert that the row exists
      await expect(targetRow).toBeVisible({ timeout: 10000 });
      await expect(targetRow).toHaveCount(1, { timeout: 5000 });
      
      const cells = targetRow.locator('td');
  
      // ✅ Validate dynamic values
      await expect((await cells.nth(1).textContent())?.trim()).toMatch(expectedProductISellDetails.productName);
      await expect(cells.nth(2)).toContainText(expectedProductISellDetails.noOfVariants);
      //as of now category not showing 
      const actual_string = (await cells.nth(3).textContent() || '').toLowerCase().trim();

      const expectedCategoryRaw = (expectedProductISellDetails.category || '').toLowerCase().trim();
      if (expectedCategoryRaw.includes('>')) {
        // expected contains hierarchy "parent > child > ...", compare only top-level parent
        const expectedMain = expectedCategoryRaw.split('>').map(s => s.trim())[0];
        await expect(actual_string).toContain(expectedMain);
      } else {
        await expect(actual_string).toContain(expectedCategoryRaw);
      }
      // as of now not to be checked. need to add if condition later
      const checkbox = targetRow.locator('td[data-pc-name="datatable"] .forms-toggle input[type="checkbox"]');

      await expect(checkbox).not.toBeChecked();

      //console.log('display:', expectedProductISellDetails.display);
      await expect(cells.nth(4)).toContainText(expectedProductISellDetails.stockAvailability);
      
      
      if (expectedProductISellDetails.pricing_type=='request_quote' || expectedProductISellDetails.pricing_type=='negotiable'){ 
      await expect(cells.nth(6)).toHaveText(expectedProductISellDetails.price);
      }
      
      else if (expectedProductISellDetails.pricing_type=='price_range'){ 
      //await expect(cells.nth(6)).toHaveText(expectedProductISellDetails.price);
      console.log('Validating price range: ', cells.nth(6).textContent());
      const rawPrice = (await cells.nth(6).textContent()) || '';
      // keep only digits and hyphen, e.g. "₹  200 - ₹  400 / per Unit" -> "200-400"
      const actualRange = rawPrice.replace(/[^\d-]/g, '').trim();
      const expectedRange = (expectedProductISellDetails.price || '').replace(/[^\d-]/g, '').trim();
      await expect(actualRange).toBe(expectedRange);
      // optional: ensure unit suffix exists
      await expect(rawPrice).toContain('/ per Unit');
      }
      else{
        await expect(cells.nth(6)).toHaveText('₹ '+expectedProductISellDetails.price+' / per Unit');
      }
      // ✅ Validate 3-dot action menu is visible (last cell)
      await expect(cells.nth(7)).toHaveText(expectedProductISellDetails.sku_code);
      await expect(cells.nth(8)).toHaveText(expectedProductISellDetails.status);
    }
}