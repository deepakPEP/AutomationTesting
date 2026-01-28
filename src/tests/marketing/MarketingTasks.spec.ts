import { test, expect,request } from '@playwright/test';
import { getRandomSitemapUrl } from '../../utils/GetRandomSiteMapUrl';

test.describe('Marketing Tasks', { tag: ['@marketing'] }, () => {
    test.setTimeout(60000);
  test('Homepage title and description', async ({ page }) => {

    // 🔹 1. Navigate to Marketing SRC / Catalog page
    // await page.goto('https://www.pepagora.com/en/millennium-machine-works', {
    //   waitUntil: 'domcontentloaded'
    // });

    await page.goto('https://www.pepagora.com/', {
      waitUntil: 'domcontentloaded'
     });

    // 🔹 2. Page Title
    const title = await page.title();
    console.log('Page Title:', title);
    await expect(title).toBe('Pepagora – AI-Powered Global B2B Marketplace for SMEs');
    //expect(title.length).toBeGreaterThan(10);

    // // 🔹 3. Meta Description
    const metaDescription = await page.locator(
      'meta[name="description"]'
    ).getAttribute('content');
    await expect(metaDescription).toBe('Discover Pepagora, the trusted AI-powered B2B marketplace. Connect with verified suppliers, buyers & partners worldwide. Grow your business with confidence.');
  });
  test('Main Category Page Title & Meta Description', async ({ page }) => {
    for (let i=0;i<4;i++){
    const randomUrl = await getRandomSitemapUrl('https://www.sandbox.pepagora.org/sitemap-category/sitemap.xml');
    await console.log('Navigated to URL:', randomUrl);
    await page.goto(randomUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000); // Wait for 2 seconds to ensure the page loads completely
    const heading = await page.locator('.cat-title').first().textContent();
   
    await console.log('Category Heading:', heading);
    const actual_title = await page.title();
    await console.log('Page Title:', actual_title);
    const expected_title = `${heading} Manufacturers & Suppliers – Exporters & Wholesalers | Pepagora`.replace('&', '&amp;');
    await console.log('Expected Title:', expected_title);
   // await expect(actual_title).toBe(expected_title);

   let actual_description = await page.locator('meta[name="description"]').getAttribute('content');
   await console.log('Meta Description:', actual_description);
   const expected_description = `Find verified ${heading} manufacturers, suppliers, exporters and wholesalers on Pepagora. Source quality products and connect with trusted businesses across the globe.`;
   await console.log('Expected Meta Description:', expected_description);
   await expect(actual_description).toBe(expected_description);
    }
    });
    test('Sub-Category Page Title & Meta Description', async ({ page }) => {
    for (let i=0;i<10;i++){
    const randomUrl = await getRandomSitemapUrl('https://www.sandbox.pepagora.org/sitemap-subcategory/sitemap.xml');
    await console.log('Navigated to URL:', randomUrl);
    await page.goto(randomUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000); // Wait for 2 seconds to ensure the page loads completely
    const heading = await page.locator('.cat-title').first().textContent();
   
    await console.log('Sub Category Heading:', heading);
    const actual_title = await page.title();
    await console.log('Page Title:', actual_title);
    const expected_title = `${heading} Manufacturers & Suppliers – Exporters & Wholesalers | Pepagora`;
    await console.log('Expected Title:', expected_title);
   // await expect(actual_title).toBe(expected_title);

   let actual_description = await page.locator('meta[name="description"]').getAttribute('content');
   await console.log('Meta Description:', actual_description);
   const expected_description = `Explore a wide range of ${heading} products from verified manufacturers, suppliers & exporters on Pepagora. Connect globally, compare prices & send enquiry!`;
   await console.log('Expected Meta Description:', expected_description);
   await expect(actual_description).toBe(expected_description);
    }
    });
  
    test('Product-Category Page Title & Meta Description', async ({ page }) => {
        test.setTimeout(480000);
    for (let i=0;i<10;i++){
    const randomUrl = await getRandomSitemapUrl('https://www.sandbox.pepagora.org/sitemap-product-category/sitemap.xml');
    await console.log('Navigated to URL:', randomUrl);
    await page.goto(randomUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000); // Wait for 2 seconds to ensure the page loads completely
    const heading = await page.locator('.cat-title').first().textContent();
   
    await console.log('Product Category Heading:', heading);
    const actual_title = await page.title();
    await console.log('Page Title:', actual_title);
    const expected_title = `${heading} - Latest Price, Manufacturers & Suppliers at Pepagora`;
    await console.log('Expected Title:', expected_title);
   // await expect(actual_title).toBe(expected_title);

   let actual_description = await page.locator('meta[name="description"]').getAttribute('content');
   //await console.log('Meta Description:', actual_description);
   const expected_description = `Browse a wide range of ${heading} from top suppliers and manufacturers. Compare prices, quality, and MOQ. Send direct enquiries to verified vendors on Pepagora.`;
   //await console.log('Expected Meta Description:', expected_description);
   await expect(actual_description).toBe(expected_description);
    }
    });
    test('Product Detail Page Title & Meta Description', async ({ page }) => {
        test.setTimeout(480000);
    for (let i=0;i<5;i++){
        const randomUrl = await getRandomSitemapUrl('https://www.sandbox.pepagora.org/sitemap-product/sitemap/1.xml');
        await console.log('Navigated to URL:', randomUrl);
        await page.goto(randomUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2000); // Wait for 2 seconds to ensure the page loads completely
        const heading = await page.locator('.product-title').first().textContent();
    
        await console.log('Product Category Heading:', heading);
        const actual_title = await page.title();
        await console.log('Page Title:', actual_title);
        
        const match = actual_title.match(/in\s+(.+?),\s+(.+?)\s+\|\s+Pepagora/i);

        expect(match).not.toBeNull();

        const city = match![1].trim();
        const country = match![2].trim();

        // Assertions
        expect(city.length).toBeGreaterThan(1);
        expect(country.length).toBeGreaterThan(1);
     //await expect(actual_title).toContain(`${heading} Manufacturer – Supplier, Wholesaler and Exporter in`);

        let actual_description = await page.locator('meta[name="description"]').getAttribute('content');
        //await console.log('Meta Description:', actual_description);
        const expected_description = `Find ${heading} Manufacturer – Supplier, Wholesaler and Exporter`;
        //await expect(actual_description).toContain(expected_description);
        //await console.log('Expected Meta Description:', expected_description);
       const geoMatch = actual_title.match(/in\s+(.+?),\s+(.+?)\./i);

        if (geoMatch) {
        // ✅ Case 1: Seller origin present
        const city = geoMatch[1].trim();
        const country = geoMatch[2].trim();

        console.log('City:', city);
        console.log('Country:', country);

        expect(city.length).toBeGreaterThan(1);
        expect(country.length).toBeGreaterThan(1);

        } else {
        // ✅ Case 2: Fallback to Pepagora
        console.log('Geo missing → validating Pepagora fallback');

        await expect(actual_title).toContain('Pepagora');


            }
        }
    });
        // test('Seller Catalog Page Title & Meta Description', async ({ page }) => {
        // test.setTimeout(480000);
        // });
        test('Common Open Graph & Twitter Tags', async ({ page }) => {
        test.setTimeout(480000);
         for (let i=0;i<5;i++){
            const randomUrl = await getRandomSitemapUrl('https://www.sandbox.pepagora.org/sitemap-product/sitemap/1.xml');
            await console.log('Navigated to URL:', randomUrl);
            await page.goto(randomUrl, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(2000); // Wait for 2 seconds to ensure the page loads completely
           
            const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content',{'timeout':5000});
            const metaTitle = await page.title();
            await expect(ogTitle).toBe(metaTitle);
            
            const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content',{'timeout':5000});
            const metaDescription = await page.locator('meta[name="description"]').getAttribute('content',{'timeout':5000});
            await expect(ogDescription).toBe(metaDescription);

            // as of now og:url is not matching exactly with the page url due to bug
            // const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
            // await expect(ogUrl).toBe(randomUrl);

            const ogImageUrl = await page.locator('meta[property="og:image"]').getAttribute('content',{'timeout':5000});
            expect(ogImageUrl, 'OG image URL should be present').not.toBeNull();
            const apiContext = await request.newContext();
            let response = await apiContext.get(ogImageUrl!);   
            expect(response.ok(), `OG image should be accessible: ${ogImageUrl}`).toBeTruthy();
            
            const ogType = await page.locator('meta[property="og:type"]').getAttribute('content',{'timeout':5000});
            await expect(ogType).toBe('website');

            const ogsiteName = await page.locator('meta[property="og:site_name"]').getAttribute('content',{'timeout':5000});
            await expect(ogsiteName).toBe('Pepagora');

            const ogLocale = await page.locator('meta[property="og:locale"]').getAttribute('content',{'timeout':5000});
            await expect(ogLocale).toBe('en_US');

            const imageWidth = await page.locator('meta[property="og:image:width"]').getAttribute('content',{'timeout':5000});
            await expect(imageWidth).not.toBeNull();
            await expect(imageWidth).toBe('1200');
            
            const imageHeight = await page.locator('meta[property="og:image:height"]').getAttribute('content',{'timeout':5000});
            await expect(imageHeight).not.toBeNull();
            await expect(imageHeight).toBe('630');
            
            const fb_app_id = await page.locator('meta[name="fb:app_id"]').getAttribute('content',{'timeout':5000});
            await expect(fb_app_id).toBe('688881134183469');

            const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content',{'timeout':5000});
            await expect(twitterCard).toBe('summary_large_image');

            const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content',{'timeout':5000});
            await expect(twitterTitle).toBe(metaTitle);

            const twitterSite = await page.locator('meta[name="twitter:site"]').getAttribute('content',{'timeout':5000});
            await expect(twitterSite).toBe('@pepagora');

            const twitterDescription = await page.locator('meta[name="twitter:description"]').getAttribute('content',{'timeout':5000});
            await expect(twitterDescription).toBe(metaDescription);
            
            const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content',{'timeout':5000});
            expect(twitterImage, 'OG image URL should be present').not.toBeNull();
            response = await apiContext.get(twitterImage!);   
            expect(response.ok(), `OG image should be accessible: ${twitterImage}`).toBeTruthy();
            await apiContext.dispose();
         }
        });
});
