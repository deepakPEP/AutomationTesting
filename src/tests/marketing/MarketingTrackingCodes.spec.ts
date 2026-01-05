import { test, expect } from '@playwright/test';

test.describe('Marketing Page tracking codes', { tag: ['@marketing'] }, () => {

  test('Validate google tracking codes present', async ({ page }) => {

    // 🔹 1. Navigate to Marketing SRC / Catalog page
    // await page.goto('https://www.pepagora.com/en/millennium-machine-works', {
    //   waitUntil: 'domcontentloaded'
    // });

    await page.goto('https://www.pepagora.com/chrishmac-exports', {
      waitUntil: 'domcontentloaded'
     });

    // 🔹 2. Page Title
    // const title = await page.title();
    // console.log('Page Title:', title);
    // expect(title).not.toBe('');
    // expect(title.length).toBeGreaterThan(10);

    // // 🔹 3. Meta Description
    // const metaDescription = await page.locator(
    //   'meta[name="description"]'
    // ).getAttribute('content');

    const gtm_id = 'GTM-PPD9QB75';// google tag manager id
    const ga_id = 'G-GGCMPXN113'; // google analytics id
    const google_site_verification_id = 'cZr8Sh8pJdhX8zfm2BpUIHYbZr7rNE_6GoiCYif-Lsk';
    const linked_in_verification_id = '8621049';
    const meta_pixel_id = '609093465218163';
    const meta_domain_verification_id = '2k1e6vj2qn9iwsm9wvk4jghmnppt59';
    const microsoft_clarity_id = 'https://www.clarity.ms/tag/';
    const pinterest_id = 'aab6720dc425babff57ca0e7788f401f';

     // linked in site verification id
    const content = await page.content();
  expect(content).toContain(gtm_id);
    expect(content).toContain(ga_id);
    expect(content).toContain(google_site_verification_id);
    expect(content).toContain(linked_in_verification_id);
expect(content).toContain(meta_pixel_id);
expect(content).toContain(meta_domain_verification_id);
expect(content).toContain(microsoft_clarity_id);
expect(content).toContain(pinterest_id);

  let matches = content.match(/GTM-PPD9QB75/g) || [];
 
 expect(matches.length).toBe(3);

 matches = content.match(/G-GGCMPXN113/g) || [];

 expect(matches.length).toBe(3);

 matches = content.match(/cZr8Sh8pJdhX8zfm2BpUIHYbZr7rNE_6GoiCYif-Lsk/g) || [];

 expect(matches.length).toBe(2);

  matches = content.match(/8621049/g) || [];
  expect(matches.length).toBe(3);

  matches = content.match(/609093465218163/g) || [];
  expect(matches.length).toBe(3);

  matches = content.match(/2k1e6vj2qn9iwsm9wvk4jghmnppt59/g) || [];
  expect(matches.length).toBe(2);

    matches = content.match(/https:\/\/www.clarity.ms\/tag\//g) || [];
    expect(matches.length).toBe(1);

    matches = content.match(/aab6720dc425babff57ca0e7788f401f/g) || [];
    expect(matches.length).toBe(2);
    // expect(metaDescription).not.toBeNull();
    // expect(metaDescription.length).toBeGreaterThan(50);

    // // 🔹 4. Canonical URL
    // const canonicalUrl = await page.locator(
    //   'link[rel="canonical"]'
    // ).getAttribute('href');

    // console.log('Canonical URL:', canonicalUrl);
    // expect(canonicalUrl).not.toBeNull();
    // expect(canonicalUrl).toContain('http');

    // // 🔹 5. Robots Meta
    // const robots = await page.locator(
    //   'meta[name="robots"]'
    // ).getAttribute('content');

    // console.log('Robots:', robots);
    // expect(robots).not.toBeNull();
    // expect(robots).toContain('index');

    // // 🔹 6. Viewport Meta
    // const viewport = await page.locator(
    //   'meta[name="viewport"]'
    // ).getAttribute('content');

    // expect(viewport).not.toBeNull();

    // // 🔹 7. Open Graph Tags
    // const ogTitle = await page.locator(
    //   'meta[property="og:title"]'
    // ).getAttribute('content');

    // const ogDescription = await page.locator(
    //   'meta[property="og:description"]'
    // ).getAttribute('content');

    // const ogImage = await page.locator(
    //   'meta[property="og:image"]'
    // ).getAttribute('content');

    // expect(ogTitle).not.toBeNull();
    // expect(ogDescription).not.toBeNull();
    // expect(ogImage).not.toBeNull();

    // // 🔹 8. Twitter Card Tags
    // const twitterCard = await page.locator(
    //   'meta[name="twitter:card"]'
    // ).getAttribute('content');

    // expect(twitterCard).not.toBeNull();

    // // 🔹 9. Catalog Title Presence (UI + SEO alignment)
    // const catalogTitle = page.locator('h1');
    // await expect(catalogTitle).toBeVisible();

    // const catalogText = await catalogTitle.textContent();
    // console.log('Catalog Title:', catalogText);

    // // Optional: title should contain catalog name
    // expect(title).toContain(catalogText.trim());

  });

});
