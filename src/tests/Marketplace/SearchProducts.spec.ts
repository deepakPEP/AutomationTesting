import { test, expect } from '@playwright/test';
import { MarketplaceHomePage } from '../../pages/Marketplace/MarketplaceHomePage';
import { SearchResultsPage } from '../../pages/Marketplace/SearchResultsPage';
import { TestLogger } from '../../utils/TestLogger';

test.describe('Marketplace Search Tests',  {tag: ['@marketplace_pages']}, () => {
  let homePage: MarketplaceHomePage;
  let searchResultsPage: SearchResultsPage;

  test.beforeEach(async ({ page }) => {
    TestLogger.clearLogs();
    homePage = new MarketplaceHomePage(page);
    searchResultsPage = new SearchResultsPage(page);

    TestLogger.log('Navigating to marketplace home page');
    await homePage.goto();
  });

  test.afterEach(async ({ page }, testInfo) => {
    await TestLogger.attachLogsToTest(testInfo);
  });

  test('@marketplace Search for t-shirts and validate first 10 product names', async () => {
    test.setTimeout(90000); // Increase timeout for slower page loads
    
    const searchTerm = 'T-shirt';
    const productsToValidate = 10;

    TestLogger.log(`Searching for "${searchTerm}"`);
    await homePage.search(searchTerm);

    TestLogger.log('Waiting for search results to load');
    await searchResultsPage.waitForResults();

    TestLogger.log(`Validating that first ${productsToValidate} product names contain "${searchTerm}"`);
    const productNames = await searchResultsPage.validateProductNamesContainTerm(searchTerm, productsToValidate);

    TestLogger.success(`Validation successful! Found ${productNames.length} matching products`);
    productNames.forEach((name: string, index: number) => {
      TestLogger.log(`  ${index + 1}. ${name}`);
    });

    // Additional assertion to ensure we checked at least some products
    expect(productNames.length).toBeGreaterThan(0);
    TestLogger.log(`Total products validated: ${productNames.length}`);
  });
});
