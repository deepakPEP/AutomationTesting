import { test, expect } from '@playwright/test';
import {MKP_AllCategoriesPage} from '../../pages/Marketplace/MKP_AllCategoriesPage';
import {MKP_ProdDetailPage} from '../../pages/Marketplace/MKP_ProdDetailPage';
test.describe('Product Detail Page Test from All categories -> Apparel & Fashion -> Casual Wear ', () => {
  let allCategoriesPage: MKP_AllCategoriesPage;
  let prodDetailPage: MKP_ProdDetailPage;
  
  test.beforeEach(async ({ page }) => {  
    allCategoriesPage = new MKP_AllCategoriesPage(page);
    prodDetailPage = new MKP_ProdDetailPage(page);
  });

  test('@marketplace Navigate to Casual Wear and click Universal Cap product',  {tag: ['@marketplace_pages']},async ({ page }) => {
    test.setTimeout(60000);
    // Step 1: Navigate to home
    await prodDetailPage.navigateToHome();
    console.log('✓ Navigated to home page');

    // Step 2: Click All Categories
    await prodDetailPage.marketplaceHomePage.clickAllCategories();
    console.log('✓ Clicked All Categories');

    await prodDetailPage.clickApparelFirstProduct();

    await prodDetailPage.validateProductDetailPage();

    // Step 4: Wait for products to load
    await prodDetailPage.waitForProductsListingPage();
    console.log('✓ Products listing page loaded');

    // Step 3: Click Casual Wear card
   
  });

//   test('@marketplace Complete casual wear flow', async ({ page }) => {
//     // Complete entire flow in one go
//     await casualWearPage.completeFlow();
//     console.log('✅ Complete flow executed successfully');

//     // Verify we're on product detail page
//     const productTitle = page.locator('h1, [class*="title"]').first();
//     await expect(productTitle).toBeVisible({ timeout: 10000 });
//   });
});