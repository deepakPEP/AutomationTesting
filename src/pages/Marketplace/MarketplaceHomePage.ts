import { Page, Locator } from '@playwright/test';

export class MarketplaceHomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly allCategoriesButton: Locator;
  
  constructor(page: Page) {
    this.page = page;
    // Search input from the marketplace home page
    this.searchInput = page.locator('input.s-p-c-input[placeholder*="Search"]');
    this.allCategoriesButton = page.locator('#p-all-categories');
  }

  async goto() {
    await this.page.goto('https://www.sandbox.pepagora.org/en', { 
      timeout: 60000,
      waitUntil: 'domcontentloaded' 
    });
    await this.page.waitForLoadState('domcontentloaded');
  }

  async search(query: string) {
    // Navigate directly to products page (search results appear here)
    await this.page.goto('https://www.sandbox.pepagora.org/en/', {
      timeout: 60000,
      waitUntil: 'domcontentloaded'
    });
    
    // Wait for search input to be available and fill it
    await this.searchInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
    
    // Wait a moment for results to filter
    await this.page.waitForTimeout(3000);
  }
  
  async clickAllCategories() {
    await this.allCategoriesButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.allCategoriesButton.click();
  }
}
