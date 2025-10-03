import { expect, Locator, Page } from '@playwright/test';
import path from 'path';
export class ProductInformationPage {
  readonly page: Page;

  readonly productNameInput: Locator;
  readonly descriptionInput: Locator;
  readonly skuInput: Locator;
  readonly browseCategoryBtn: Locator;
  readonly chooseBtn: Locator;
  readonly selectedSpan: Locator;
  readonly uploadButton: Locator;
  readonly countrySelectButton: Locator;
  readonly countryTextbox: Locator;
  readonly indiaOption: Locator;
  readonly continueBtn: Locator;
  readonly productTitle: Locator;
  readonly skuText: Locator;
  readonly imgMain: Locator;
  readonly imgThumb: Locator;
  readonly previewLabel: Locator;
  progressBar: Locator;
  progressElement: Locator;

  constructor(page: Page) {
    this.page = page;

    this.productNameInput = page.getByRole('textbox', { name: 'Enter Product Name' });
    this.descriptionInput = page.getByRole('textbox', { name: 'Enter Text' });
    this.skuInput = page.getByRole('textbox', { name: 'Enter SKU/Model number' });
    //this.browseCategoryBtn = page.getByRole('button', { name: 'Browse Category' });
    this.browseCategoryBtn = page.locator("//span[text()='Browse Category']//parent::button");
    this.chooseBtn = page.getByRole('button', { name: 'Choose', exact: true });
    this.selectedSpan = page.locator("//span[text()='Selected:']/parent::div//span[2]");
    // this.uploadButton = page.getByRole('button', {
    //   name: 'Drag & Drop file from computer or Choose File Upload JPG, JPEG, PNG (Max 5MB)'
    // });
    this.uploadButton = page.getByText('Choose File').first();
    this.countrySelectButton = page.getByRole('button', { name: 'Select Country' });
    //this.countryTextbox = page.locator('form div').filter({ hasText: 'Country of Origin Select' }).getByRole('textbox');
    this.countryTextbox = page.locator('input.p-dropdown-filter')
    this.indiaOption = page.getByRole('option', { name: 'India', exact: true });
    //this.continueBtn = page.getByRole('button', { name: 'Continue', exact: true });
    this.continueBtn = page.locator("//span[text()='Continue']//parent::button");
    this.productTitle = page.locator('h2.product-title-txt');
    this.skuText = page.locator('span.sku-txt');
    this.imgMain = page.locator('img[width="380"][height="360"]');
    this.imgThumb = page.locator('img[width="64"][height="64"]');
    this.previewLabel = page.locator('span.preview-txt');
    this.progressBar = page.locator('.p-c-b-progress');
    this.progressElement = page.locator('.p-c-value');
  }

  async fillBasicInfo(product: any) {
    await this.productNameInput.fill(product?.name || 'Electric Screwdriver');
    await this.descriptionInput.fill(product?.description || 'automationtest');
    await this.skuInput.fill(product?.sku_model || 'SK');
  }

  async browseCategory(productCategory: string) {
    console.log('product category ',productCategory);
    const categories = productCategory ? productCategory.split('>').map(c => c.trim()) : [];
    console.log('categories: ', categories);
    await this.browseCategoryBtn.click();
    for (const category of categories) {
      await console.log(`Selecting category: //ul[@class='category-ul']//li[text()='${category}']`);
      await this.page.locator(`//ul[@class='category-ul']//li[text()='${category}']`).click();
      await this.page.waitForTimeout(3000);
    }
    await this.chooseBtn.click();
    await this.page.waitForTimeout(2000);
    //await expect(this.selectedSpan).toHaveText(productCategory || 'Gaming Laptops');
  }
  async selectAICategory(category: string) {
  const categoryInput = this.page.locator('input.p-autocomplete-input[placeholder="Select AI Category"]');
  await categoryInput.click();
  await categoryInput.fill(category);

  const suggestionList = this.page.locator('.p-autocomplete-items li');
  await suggestionList.filter({ hasText: category }).first().click();
}
  async uploadImage() {
    await this.page.getByText('Choose File').first().click();
    const filePath = path.resolve(__dirname, '../../data/images.jpg');
    console.log('File path in images:', filePath);
    await this.uploadButton.setInputFiles(filePath);
    await this.page.waitForTimeout(10000);
  }

  async selectCountry() {
    await this.countrySelectButton.click();
    await this.countryTextbox.click();
    await this.countryTextbox.fill('India');
    await this.indiaOption.click();
  }

  async submitProduct() {
    await this.page.waitForTimeout(5000);
   
    console.log('Is visible:', await this.continueBtn.isVisible());
    console.log('Is enabled:', await this.continueBtn.isEnabled());
    await this.continueBtn.waitFor({ state: 'attached', timeout: 10000 });

    await this.continueBtn.waitFor({ state: 'visible' });
    await this.continueBtn.click({ force: true });
    await this.page.waitForTimeout(3000);
  }

  async verifyDetails(product: any) {
    await expect(this.productTitle).toHaveText(product?.name || 'Electric Screwdriver');
    const actualSKU = await this.skuText.textContent();
    console.log('SKU Text:', actualSKU);//test.info
    await expect(this.skuText).toContainText(product?.sku_model || 'SK');
    await expect(this.imgMain).toBeVisible();
    await expect(this.imgThumb).toBeVisible();
    await expect(this.previewLabel).toHaveText('Main Thumbnail');
  }

  async validateProgressBar(expectedPercentage: string) {
    // Get the width of the element (in pixels)

    // You can now assert if the width is as expected (12% of the container's width)
    // If you want to check percentage, compare accordingly
    console.log('Expected Percentage:', await this.progressElement.textContent());
    await expect(this.progressElement).toHaveText(`Completed${expectedPercentage}`);

  }
  async validateProductAddStepCompletion(stepName : string){
  // Assert that the "Product Information & Pricing MOQ steps, etc based on step names" - step is completed with green tick
    // const productInfoStep = this.page.locator('.s-c-c-b-h-content .title', { hasText: stepName });
    // const completedIcon = productInfoStep.locator('..').locator('.status-icon.completed-icon');
    //await expect(productInfoStep).toHaveClass(/completed/);
    // Expect the completed icon to be visible
    //await expect(completedIcon).toBeVisible();

    await expect(
  this.page.locator(`.s-c-c-b-h-content:has-text("${stepName}") >> .. >> .completed-icon`)
).toBeVisible();
  }
}
