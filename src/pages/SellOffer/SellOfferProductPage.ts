// src/pages/SellOfferProductPage.ts
import { Page, expect } from '@playwright/test';
import path from 'path';
import { CurrencySelector, selectCurrency } from '../../utils/CurrencySelector';

export class SellOfferProductPage {
  
  
  constructor(private page: Page) {
    this.page= page;
  }
// async submitProduct(){
//   const continueButton = this.page.locator('.offcanvas-sidebar-comp.variants-sidebar.addnewproduct-sidebar .btn-comp.btn-right.btn-c-primary.btn-c-lg:has-text("Continue")');
// await continueButton.click({ force: true });
// await this.page.waitForTimeout(7000);
// }
async submitProduct() {
  //const continueButton = this.page.locator('.offcanvas-sidebar-comp.variants-sidebar.addnewproduct-sidebar .btn-comp.btn-right.btn-c-primary.btn-c-lg:has-text("Continue")');
  //const continueButton = this.page.locator('.o-s-c-btn-group button:has-text("Continue")');
  await this.page.locator('.o-s-c-btn-group button:has-text("Continue")').click({force:true});
  
 await this.page.waitForSelector('.loader', { state: 'hidden', timeout: 10000 });
  await this.page.waitForTimeout(7000);
}
  async navigateToSellOfferSection() {
    await this.page.locator('div').filter({ hasText: /^Sales$/ }).getByRole('img').click();
    await this.page.waitForTimeout(3000);
    await this.page.getByRole('link', { name: 'Sell Offer', exact: true }).click();
    await this.page.waitForTimeout(2000);
    
    // Debug: Check different locator strategies
    const buttonByRole = this.page.getByRole('button', { name: /Create Your First Offer/i });
    
    // Try multiple strategies
    if (await buttonByRole.isVisible().catch(() => false)) {
      console.log('✅ Clicking "Create Your First Offer" button by role');
      await buttonByRole.click();
      await this.page.waitForTimeout(1000);
    } else {
      console.log('🔍 First button not found, trying "New Sell Offer" button');
      const newOfferButton = this.page.locator('button:has-text("New Sell Offer")');
      await newOfferButton.click();

      await this.page.waitForTimeout(1000);
    }
  }

  async addNewProduct(productName: string) {
    await this.page
      .locator('div')
      .filter({ hasText: /^Add New ProductQuickly add a new product to offer discounts$/ })
      .first()
      .click();

    const productNameInput = this.page.getByRole('textbox', { name: 'Enter Product Name' });
    await productNameInput.click();
    await productNameInput.fill(productName);
  }

  async selectCategory(main: string, sub: string, item: string, final: string) {
    await this.page.getByRole('button', { name: 'Browse Category' }).click();
    await this.page.getByText(main).click();
    await this.page.getByText(sub).click();
    await this.page.getByText(item).click();
    await this.page.getByText(final).click();
    await this.page.getByRole('button', { name: 'Choose', exact: true }).click();
  }

  // async uploadImage({ imagePath }: { imagePath: string; }): Promise<void> {
  //   const filePath = path.resolve(__dirname, '../data/');
  //   await this.page.getByText('Choose File').click();
  //   await this.page.getByRole('button', { name: 'Drag & Drop file from' }).setInputFiles(imagePath);
  // }

  async fillProductDetails(
    description: string, 
    brand: string, 
    unitPrice: string, 
    quantity: string, 
    unit: string, 
    currency: string = 'INR'
  ) {
    await this.page.getByRole('textbox', { name: 'Add Product Description' }).fill(description);
    await this.page.getByRole('textbox', { name: 'Enter Brand Name' }).fill(brand);
    
    // Use the dynamic currency selector
    await selectCurrency(this.page, currency);
    
    await this.page.getByRole('textbox', { name: 'Enter Unit Price' }).click({ force: true });
    console.log('Filling unit price', unitPrice);
    await this.page.getByPlaceholder('Enter Unit Price').fill(unitPrice);
    await this.page.getByRole('textbox', { name: 'Enter Numeric' }).fill(quantity);
    await this.page.locator('span.p-dropdown-label:has-text("Select Unit")').click({ force: true });

    // Select unit dynamically
    await this.page.locator(`.p-dropdown-item[role="option"] >> text=${unit}`).click();
  }

  /**
   * Fill product details with specific currency selection
   * @param details - Product details object
   */
  async fillProductDetailsAdvanced(details: {
    description: string;
    brand: string;
    unitPrice: string;
    quantity: string;
    unit: string;
    currency?: string;
  }) {
    const currencySelector = new CurrencySelector(this.page);
    
    await this.page.getByRole('textbox', { name: 'Add Product Description' }).fill(details.description);
    await this.page.getByRole('textbox', { name: 'Enter Brand Name' }).fill(details.brand);
    
    // Select currency using the advanced selector
    if (details.currency) {
      await currencySelector.selectCurrencyByCode(details.currency);
    } else {
      await currencySelector.selectCurrencyByCode('INR'); // Default to INR
    }
    
    await this.page.getByRole('textbox', { name: 'Enter Unit Price' }).click({ force: true });
    console.log('Filling unit price', details.unitPrice);
    await this.page.getByPlaceholder('Enter Unit Price').fill(details.unitPrice);
    await this.page.getByRole('textbox', { name: 'Enter Numeric' }).fill(details.quantity);
    await this.page.locator('span.p-dropdown-label:has-text("Select Unit")').click({ force: true });

    // Select unit dynamically
    await this.page.locator(`.p-dropdown-item[role="option"] >> text=${details.unit}`).click();
  }

  async clickContinueAfterProduct() {
    await this.page.waitForTimeout(5000);
    await this.page.click("//div[@class='o-s-c-btn-group']//span[@class='b-c-txt'][normalize-space()='Continue']");
    await expect(
      this.page.locator("//div[@class='stepper-card-comp completed']//div[@class='s-c-c-b-h-left']//*[name()='svg'][2]/*[name()='path'][1]")
    ).toBeVisible();
  }

  async reopenAddProduct() {
    await this.page.locator('div').filter({ hasText: /^Add New Product$/ }).getByRole('img').click();
  }
}
