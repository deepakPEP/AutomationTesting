import { Page, Locator, expect } from '@playwright/test';
import { MarketplaceHomePage } from './MarketplaceHomePage';

export class MKP_AllCategoriesPage{
  readonly page: Page;
  readonly marketplaceHomePage: MarketplaceHomePage;
  
  readonly pageTitle: Locator;
  readonly productLoadingSpinner: Locator;
  readonly productCard: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.marketplaceHomePage = new MarketplaceHomePage(page);
    
    this.pageTitle = page.locator('[class*="title"], h1, h2').first();
    this.productLoadingSpinner = page.locator('[class*="loader"], [class*="spinner"]');
    this.productCard = page.locator('[class*="product-card"], [class*="product"], a[class*="item"]');
  }

  /**
   * Navigate to home page
   */
  async navigateToHome() {
    await this.page.goto('https://www.sandbox.pepagora.org/en');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Verify page title contains expected text
   */
  async verifyPageTitle(expectedTitle: string) {
    await expect(this.pageTitle).toContainText(expectedTitle, { ignoreCase: true });
  }

  /**
   * Click category by name (generic method)
   */
  async clickCategoryByName(categoryName: string) {
    const categoryLocator = this.page.locator('a, div').filter({ 
      hasText: new RegExp(`^${categoryName}$`, 'i') 
    }).first();
    // page title can add
    await categoryLocator.waitFor({ state: 'visible', timeout: 10000 });
    await categoryLocator.click();
    await this.page.waitForTimeout(2000);
  }

  /**
   * Wait for products listing page to load
   */
  async waitForProductsListingPage() {
    const productCards = this.productCard.first();
    await productCards.waitFor({ state: 'visible', timeout: 15000 });
    
    try {
      await this.productLoadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    } catch (error) {
      // Spinner might not be present
    }

    await this.page.waitForTimeout(1000);
  }

  /**
   * Click product by name (generic method)
   */
  async clickProductByName(productName: string) {
    const productLocator = this.page.locator('[class*="product"]').filter({ 
      hasText: new RegExp(`${productName}`, 'i') 
    }).first();
    
    await productLocator.waitFor({ state: 'visible', timeout: 10000 });
    await productLocator.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Complete flow: Navigate > Categories > Select Category > Wait > Click Product
   */
  async completeFlow(categoryName: string, productName: string) {
    await this.navigateToHome();
    await this.marketplaceHomePage.clickAllCategories();
    await this.verifyPageTitle('Apparel & Fashion');
    await this.clickCategoryByName(categoryName);
    await this.waitForProductsListingPage();
    await this.clickProductByName(productName);
  }
}