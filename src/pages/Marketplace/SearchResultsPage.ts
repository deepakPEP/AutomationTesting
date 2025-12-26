import { Page, Locator, expect } from '@playwright/test';

export class SearchResultsPage {
  readonly page: Page;
  readonly productItems: Locator;
  readonly productNames: Locator;

  constructor(page: Page) {
    this.page = page;
    // Actual selectors from the marketplace search results page
    this.productItems = page.locator('.product-listing-card-comp');
    this.productNames = page.locator('h3.product-card-name');
  }

  async waitForResults() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.productNames.first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async getFirstNProductNames(count: number): Promise<string[]> {
    await this.waitForResults();
    const names: string[] = [];
    const productCount = await this.productNames.count();
    const itemsToCheck = Math.min(count, productCount);

    for (let i = 0; i < itemsToCheck; i++) {
      const productName = await this.productNames.nth(i).textContent();
      if (productName) {
        names.push(productName.trim());
      }
    }

    return names;
  }

  async validateProductNamesContainTerm(searchTerm: string, count: number) {
    const productNames = await this.getFirstNProductNames(count);
    const searchTermLower = searchTerm.toLowerCase();

    for (let i = 0; i < productNames.length; i++) {
      const productName = productNames[i];
      const productNameLower = productName.toLowerCase();
      
      expect(
        productNameLower.includes(searchTermLower),
        `Product ${i + 1} name "${productName}" should contain "${searchTerm}"`
      ).toBeTruthy();
    }

    return productNames;
  }
}
