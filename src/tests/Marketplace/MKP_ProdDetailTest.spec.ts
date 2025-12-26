import { test, expect } from '@playwright/test';
import { CasualWearProductsPage } from '../../pages/Marketplace/MKP_ProdDetailPage';
import {MKP_AllCategoriesPage} from '../../pages/Marketplace/MKP_AllCategoriesPage';
test.describe('Casual Wear Products Flow', () => {
  let casualWearPage: CasualWearProductsPage;
  let allCategoriesPage: MKP_AllCategoriesPage;

  test.beforeEach(async ({ page }) => {
    casualWearPage = new CasualWearProductsPage(page);
    allCategoriesPage = new MKP_AllCategoriesPage(page);
  });

  test('@marketplace Navigate to Casual Wear and click Universal Cap product', async ({ page }) => {
    test.setTimeout(60000);
    // Step 1: Navigate to home
    await casualWearPage.navigateToHome();
    console.log('✓ Navigated to home page');

    // Step 2: Click All Categories
    await casualWearPage.marketplaceHomePage.clickAllCategories();
    console.log('✓ Clicked All Categories');

    
    // Step 4: Wait for products to load
    await casualWearPage.waitForProductsListingPage();
    console.log('✓ Products listing page loaded');

    // Step 3: Click Casual Wear card
    await allCategoriesPage.verifyPageTitle('Apparel & Fashion');
    await allCategoriesPage.clickCategoryByName('Formal Wear');

    await page.locator('a.p-l-c-c-details').first().click();
    console.log('✓ Clicked Casual Wear category');

    await page.waitForLoadState('domcontentloaded');
    console.log('✓ Product detail page loaded');

    let productTitle = page.locator('h1.product-title');
    await expect(productTitle).toBeVisible({ timeout: 10000 });
    console.log('✓ Product title visible');

    const breadcrumbs = page.locator('.bread-crumbs-comp');
    await expect(breadcrumbs).toBeVisible();
    console.log('✓ Breadcrumbs visible');

    const gallery = page.locator('.preview-thumb-gallery-block');
    await expect(gallery).toBeVisible();
    console.log('✓ Product gallery visible');

    const specifications = page.locator('#specifications').first();
    await expect(specifications).toBeVisible();
    console.log('✓ Specifications section visible');

    const shippingDetails = page.locator('#shippingLogistics').first();
    await expect(shippingDetails).toBeVisible();
    console.log('✓ Shipping details visible');

    const companyProfile = page.locator('.company-profile-box');
    await expect(companyProfile).toBeVisible();
    console.log('✓ Company profile visible');

    // Verify we're on product detail page
    productTitle = page.locator('h1, [class*="title"]').first();
    await expect(productTitle).toBeVisible({ timeout: 10000 });

     const productName = page.locator('h1.product-title, h1[class*="product"]').first();
    await expect(productName).toBeVisible({ timeout: 10000 });
    console.log('✓ Product name visible');

    const productDescription = page.locator('[class*="description"], p[class*="desc"]').first();
    await expect(productDescription).toBeVisible();
    console.log('✓ Product description visible');

    const shippingInfo = page.locator('.shipping-detail-comp');
    await expect(shippingInfo).toBeVisible();
    console.log('✓ Shipping information visible');

    const moqInfo = page.locator('.product-orders-pairs-block .badge-comp');
    await expect(moqInfo).toBeVisible();
    const moqText = await moqInfo.textContent();
    expect(moqText).toContain('Min. Order Quantity');
    console.log('✓ MOQ information visible:', moqText);

    // ...existing code...
    const companyName = page.locator('.c-i-d-title');
    const companyNameElements = await companyName.all();
    
    // Validate both elements
    for (let i = 0; i < companyNameElements.length; i++) {
      await expect(companyNameElements[i]).toBeVisible();
      const isUnderlined = await companyNameElements[i].evaluate((el) => {
        return window.getComputedStyle(el).textDecoration.includes('underline');
      });
      expect(isUnderlined).toBeTruthy();
      const companyText = await companyNameElements[i].textContent();
      console.log(`✓ Company name [${i + 1}] visible and underlined: ${companyText}`);
    }
    console.log('✓ All company names verified');
// ...existing code...
    const contactSupplierBtn = page.locator('button:has-text("Contact Supplier"), a:has-text("Contact Supplier"), [class*="contact"]');
    await expect(contactSupplierBtn).toBeVisible();
    console.log('✓ Contact Supplier CTA visible');

    const requestQuoteBtn = page.locator('button:has-text("Request Quote"), a:has-text("Request Quote"), [class*="quote"]');
    await expect(requestQuoteBtn).toBeVisible();
    console.log('✓ Request Quote CTA visible');

    console.log('✅ All right-side panel elements verified successfully!');

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