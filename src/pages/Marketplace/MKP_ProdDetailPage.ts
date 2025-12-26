import { Page, Locator } from '@playwright/test';
import { MarketplaceHomePage } from './MarketplaceHomePage';
export class CasualWearProductsPage {
  readonly page: Page;
  
  readonly casualWearCard: Locator;
  readonly productLoadingSpinner: Locator;
  readonly universalCapProductCard: Locator;
  readonly marketplaceHomePage: MarketplaceHomePage;
  
  constructor(page: Page) {
    this.page = page;
    
    this.casualWearCard = page.locator('[class*="category"], [class*="card"]').filter({ hasText: 'Casual Wear' });
    this.productLoadingSpinner = page.locator('[class*="loader"], [class*="spinner"]');
    this.universalCapProductCard = page.locator('[class*="product"]').filter({ hasText: 'Universal Cap' });
    this.marketplaceHomePage = new MarketplaceHomePage(page);
  }

  /**
   * Navigate to home page
   */
  async navigateToHome() {
    await this.page.goto('https://www.sandbox.pepagora.org/en');
    await this.page.waitForLoadState('domcontentloaded');
  }

  
  /**
   * Click Casual Wear category card
   */
  async clickCasualWearCard() {
    await this.casualWearCard.waitFor({ state: 'visible', timeout: 10000 });
    await this.casualWearCard.click();
    await this.page.waitForTimeout(2000);
  }

  /**
   * Wait for products listing page to load
   */
  async waitForProductsListingPage() {
    // Wait for products to appear
    const productCards = this.page.locator('[class*="product-card"], [class*="product"]').first();
    await productCards.waitFor({ state: 'visible', timeout: 15000 });
    
    // Wait for loading spinner to disappear
    try {
      await this.productLoadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    } catch (error) {
      // Spinner might not be present
    }

    await this.page.waitForTimeout(1000);
  }

  /**
   * Click Universal Cap product
   */
  async clickUniversalCapProduct() {
    await this.universalCapProductCard.waitFor({ state: 'visible', timeout: 10000 });
    await this.universalCapProductCard.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Complete flow: Navigate > Categories > Casual Wear > Wait > Click Universal Cap
   */
  async completeFlow() {
    await this.navigateToHome();
    await this.marketplaceHomePage.clickAllCategories();
    await this.clickCasualWearCard();
    await this.waitForProductsListingPage();
    await this.clickUniversalCapProduct();
  }
}