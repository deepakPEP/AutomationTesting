import { expect, Locator, Page } from '@playwright/test';
import { TestLogger } from '../../utils/TestLogger';

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
    await this.productTitle.waitFor({ state: 'visible' });
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
    async  assertPrice(unitPrice: any,unitType='₹',pricing_type='Fixed Price') {
    
    let expectedPrice;
    if (pricing_type==='Bulk Pricing') {
      const bulkCell = unitPrice;
  let expectedTiers: any[] = [];
  if (Array.isArray(bulkCell)) expectedTiers = bulkCell;
  else if (typeof bulkCell === 'string' && bulkCell.trim()) {
    expectedTiers = JSON.parse(bulkCell);
    
    console.log('Parsed bulk pricing tiers:', expectedTiers); 
    const root = this.page.locator('.product-orders-pairs-block');
    await expect(root).toBeVisible();

    
    const pairs = root.locator('.pairs-count');
    const count = await pairs.count();
    expect(count).toBe(expectedTiers.length);

    for (let i = 0; i < expectedTiers.length; i++) {
      const label = (await pairs.nth(i).locator('.p-c-label').innerText()).trim();
      const value = (await pairs.nth(i).locator('.p-c-value').innerText()).trim();

      // extract numbers from label "100-200 rolls" -> [100,200]
      const nums = label.match(/(\d+)/g) || [];
      const min = Number(nums[0] ?? 0);
      const max = Number(nums[1] ?? 0);
      await console.log('Label Text:', label, 'Value Text:', value);
      
      const priceNum = parseFloat(value.replace(/[^\d.]/g, '')) || 0;

      expect(min).toBe(expectedTiers[i].minQty);
      console.log('Expected min:', expectedTiers[i].minQty, 'Actual min:', min);
      expect(max).toBe(expectedTiers[i].maxQty);
      expect(priceNum).toBe(expectedTiers[i].price);
    }
  }
}

  // ...existing code...

      //if (unitPrice.includes('-')) {
      if (pricing_type==='price_range') {
        expectedPrice = unitType + unitPrice.split('-')[0]+`-`+unitType + unitPrice.split('-')[1];
      }
      else if (pricing_type != 'Bulk Pricing') {
        expectedPrice = unitType + unitPrice; // need to apppend currency symbol
        console.log('Expected Price:', expectedPrice);
        console.log('Price Text:', await this.priceText.textContent());
        // Locate the price element in the page and assert that the price matches
        await expect(this.priceText).toHaveText(expectedPrice);
      }
      return expectedPrice;
}
// ============================================
// VARIANTS PREVIEW VALIDATION METHOD
// ============================================

async validateVariantsPreview(expectedVariants: {
  expectedImageCount: number;
  expectedAttributes: string; // "Color Options:Black,White|Size Range:Small,Medium"
}) {
  TestLogger.info('🔍 Validating variants preview page');
  
  try {
    // STEP 1: Assert product info block is visible
    const productInfoBlock = this.page.locator('.product-info-block');
    await expect(productInfoBlock).toBeVisible();
    TestLogger.success('✅ Product info block found');
  
    // STEP 3: Validate variant attributes
    await this.validateAttributeLabels(expectedVariants.expectedAttributes);
    
    // STEP 4: Validate variant images count
    if (expectedVariants.expectedAttributes.toLowerCase().includes('color')) {
      await this.validateVariantImagesCount(expectedVariants.expectedImageCount);
    }
    TestLogger.success('🎉 Variants preview validation completed successfully');
    
  } catch (error) {
    TestLogger.error(`❌ Variants preview validation failed: ${error}`);
    throw error;
  }
}

async validateAttributeLabels(expectedAttributes: string) {
  TestLogger.info('🔍 Validating attribute labels');
  
  try {
    // Parse expected attributes: "Color Options:Black,White|Size Range:Small,Medium"
    const expectedLabels = expectedAttributes.split('|').map(attr => {
      const [label] = attr.split(':');
      return label.trim().toLowerCase().replace(' options', '').replace(' range', '');
    });
    
    TestLogger.info(`📋 Expected labels: [${expectedLabels.join(', ')}]`);
    
    // Get all attribute labels from product-info-block (excluding product-orders-pairs-block)
    const attributeLabels = this.page.locator('.product-info-block .sizesbutton-comp .s-c-label');
    const labelCount = await attributeLabels.count();
    
    TestLogger.info(`🔍 Found ${labelCount} attribute sections`);
    
    // Check each label
    for (let i = 0; i < labelCount; i++) {
      const labelElement = attributeLabels.nth(i);
      const actualLabel = await labelElement.textContent();
      
      if (actualLabel) {
        const normalizedActual = actualLabel.trim().toLowerCase();
        TestLogger.info(`📝 Found label: "${actualLabel}"`);
        
        // Check if this label matches any expected label
        const isExpected = expectedLabels.some(expected => 
          normalizedActual.includes(expected) || expected.includes(normalizedActual)
        );
        
        if (isExpected) {
          TestLogger.success(`✅ Label "${actualLabel}" matches expected attributes`);
        } else {
          TestLogger.warn(`⚠️ Label "${actualLabel}" not found in expected attributes`);
        }
      }
    }
    
    TestLogger.success('✅ Attribute labels validation completed');
    
  } catch (error) {
    TestLogger.error(`❌ Attribute labels validation failed: ${error}`);
    throw error;
  }
}
async validateColorVariantImages(attributeSection: any, expectedColorCount: number) {
  TestLogger.info(`🎨 Validating color variant images, expected count: ${expectedColorCount}`);
  
  try {
    // Count color variant images
    const colorImages = attributeSection.locator('.c-c-img img.p-v-img');
    const actualImageCount = await colorImages.count();
    
    // Assert count matches
    await expect(colorImages).toHaveCount(expectedColorCount);
    TestLogger.success(`✅ Color images count validated: ${actualImageCount}/${expectedColorCount}`);
    
    // Assert all images have valid src
    for (let i = 0; i < actualImageCount; i++) {
      const image = colorImages.nth(i);
      const src = await image.getAttribute('src');
      
      if (src && (src.includes('pepupload') || src.includes('amazonaws'))) {
        TestLogger.success(`✅ Color image ${i + 1} has valid source`);
      } else {
        TestLogger.warn(`⚠️ Color image ${i + 1} may not have uploaded source: ${src}`);
      }
    }
    
  } catch (error) {
    TestLogger.error(`❌ Color variant images validation failed: ${error}`);
    throw error;
  }
}

async validateVariantButtons(attributeSection: any, expectedValues: string[]) {
  TestLogger.info(`🔘 Validating variant buttons for values: ${expectedValues.join(', ')}`);
  
  try {
    // Get all buttons in this attribute section
    const buttons = attributeSection.locator('.s-c-buttons-block button.btn-comp');
    const actualButtonCount = await buttons.count();
    
    // Assert button count matches expected values count
    await expect(buttons).toHaveCount(expectedValues.length);
    TestLogger.success(`✅ Button count validated: ${actualButtonCount}/${expectedValues.length}`);
    
    // Validate each expected value has a corresponding button
    for (const expectedValue of expectedValues) {
      const button = attributeSection.locator(`button.btn-comp:has-text("${expectedValue}")`);
      await expect(button).toBeVisible();
      TestLogger.success(`✅ Found button for value: ${expectedValue}`);
    }
    
  } catch (error) {
    TestLogger.error(`❌ Variant buttons validation failed: ${error}`);
    throw error;
  }
}

async validateVariantImagesCount(expectedImageCount: number) {
  TestLogger.info(`🖼️ Validating variant images count, expected: ${expectedImageCount}`);
  
  try {
    // Simple count of all variant images
    const allVariantImages = this.page.locator('.c-c-img img.p-v-img');
    const actualImageCount = await allVariantImages.count();
    
    // Simple assertion
    await expect(allVariantImages).toHaveCount(expectedImageCount);
    
    TestLogger.success(`✅ Variant images count validated: ${actualImageCount}/${expectedImageCount}`);
    
  } catch (error) {
    TestLogger.error(`❌ Variant images validation failed: ${error}`);
    throw error;
  }
}
}
