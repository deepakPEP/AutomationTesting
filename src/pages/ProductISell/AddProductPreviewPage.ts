import { expect, Locator, Page } from '@playwright/test';

export class AddProductPreviewPage {
  readonly page: Page;

  readonly productTitle: Locator;
  readonly skuText: Locator;
  readonly imgMain: Locator;
  readonly imgThumb: Locator;
  readonly previewLabel: Locator;
  progressBar: Locator;
  progressElement: Locator;
  moqLocator: Locator;
  priceText: Locator;
  
  constructor(page: Page) {
    this.page = page;

    this.productTitle = page.locator('h2.product-title-txt');
    this.skuText = page.locator('span.sku-txt');
    this.imgMain = page.locator('img[width="380"][height="360"]');
    this.imgThumb = page.locator('img[width="64"][height="64"]');
    this.previewLabel = page.locator('span.preview-txt');
    this.progressBar = page.locator('.p-c-b-progress');
    this.progressElement = page.locator('.p-c-value');
    this.moqLocator = page.locator('span.badge-comp.badge-lght-grey');
    this.priceText = page.locator('div.pairs-count span.p-c-value');
  }


async verifyDetails(product: any) {
    await expect(this.productTitle).toHaveText(product?.name || 'Electric Screwdriver');
    const actualSKU = await this.skuText.textContent();
    console.log('SKU Text:', actualSKU);//test.info
    await expect(this.skuText).toContainText(product?.sku_model || 'SK');
    await expect(this.imgMain).toBeVisible();
    await expect(this.imgThumb).toBeVisible();
    await expect(this.previewLabel).toHaveText('Main Thumbnail');
    const images = await this.page.locator('img');
    for (let i = 0; i < await images.count(); i++) {
      const imgSrc = await images.nth(i).getAttribute('src');
      if (!imgSrc) {
        console.log(`Image source not found for image ${i}`);
        continue;
      }
      // const response = await this.page.waitForResponse((response) => response.url().includes(imgSrc));

      // // Check if the image has a successful status code
      
      // if (response.status() >= 400) {
      //   console.log(`Broken image detected: ${imgSrc}`);
      //   //throw new Error(`Broken image detected: ${imgSrc}`);
      // } else {
      //   console.log(`Image loaded successfully: ${imgSrc}`);
      // }
    }
  }

  async validateProgressBar(expectedPercentage: string) {
    // Get the width of the element (in pixels)

    // You can now assert if the width is as expected (12% of the container's width)
    // If you want to check percentage, compare accordingly
    console.log('Expected Percentage:', await this.progressElement.first().textContent());
    await expect(this.progressElement.first()).toHaveText(`Completed ${expectedPercentage}`);

  }
    async assertMOQ(page: Page, moq: string,unit:string) {
    // Locator for the Min. Order Quantity span
    // Assert the expected text
    const expectedText = `Min. Order Quantity : ${moq} ${unit.toLowerCase()}`;
     console.log(await this.moqLocator.textContent(), expectedText);

  // Assert exact match
    await expect(this.moqLocator).toHaveText(expectedText);
    //await console.log(await this.moqLocator.textContent(), `Min. Order Quantity : ${moq} ${unit.toLowerCase()}`);
    //await expect(this.moqLocator).toHaveText(`Min. Order Quantity : ${moq} ${unit.toLowerCase()}`);
    }
    async  assertPrice(page: Page, unitPrice: string) {
    const expectedPrice = `₹${unitPrice}`; // need to apppend currency symbol
    console.log('Expected Price:', expectedPrice);
    console.log('Price Text:', await this.priceText.textContent());
    // Locate the price element in the page and assert that the price matches
    await expect(this.priceText).toHaveText(expectedPrice);
}

}
