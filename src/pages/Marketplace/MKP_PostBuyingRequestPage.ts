import { Page, Locator } from '@playwright/test';

export class MKPPostBuyingRequestPage {
  readonly page: Page;
  readonly productNameInput: Locator;
  readonly categorySearchInput: Locator;
  readonly browseCategoryBtn: Locator;
  readonly productDescriptionTextarea: Locator;
  readonly productDescriptionError: Locator;
  readonly orderQuantityInput: Locator;
  readonly unitsDropdown: Locator;
  readonly advancedRequirementsToggle: Locator;
  readonly saveAndContinueLaterBtn: Locator;
  readonly continueBtn: Locator;
  readonly postBuyingRequirementBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productNameInput = page.locator('input[name="productName"]');
    this.categorySearchInput = page.locator('input.p-autocomplete-input[placeholder="Search for Category"]');
    this.browseCategoryBtn = page.locator('button:has-text("Browse Category")');
    this.productDescriptionTextarea = page.locator('textarea[name="productDescription"]');
    this.productDescriptionError = page.locator('span.error-txt:has-text("Product Description is required")');
    this.orderQuantityInput = page.locator('input[name="estOrderQuantity.quantity"]');
    this.unitsDropdown = page.locator('.forms-select-2');
    this.advancedRequirementsToggle = page.locator('.adv-req-block .trigger-icon');
    this.saveAndContinueLaterBtn = page.locator('button:has-text("Save & Continue Later")');
    this.continueBtn = page.locator('button.btn-c-primary:has-text("Continue")');
    this.postBuyingRequirementBtn = page.locator('button.btn-comp.p-btn-secoundary:has-text("Post Buying Requirement")');
  }

  /**
   * Click Post Buying Requirement button to open form
   */
  async clickPostBuyingRequirementButton() {
    await this.postBuyingRequirementBtn.click();
    await this.page.waitForTimeout(1000);
    await this.waitForFormToLoad();
  }

  /**
   * Wait for the post buying request form to load
   */
  async waitForFormToLoad() {
    await this.productNameInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Fill product name field
   */
  async fillProductName(productName: string) {
    await this.productNameInput.clear();
    await this.productNameInput.fill(productName);
  }

  /**
 * Search and select product category from autocomplete
 * Simple approach: if input matches any suggestion, select it
 */
async selectCategory(categoryName: string) {
  await this.categorySearchInput.click();
  await this.categorySearchInput.fill(categoryName);
  await this.page.waitForTimeout(12000);

  try {
    // Get all autocomplete suggestions
    const suggestions = this.page.locator('.p-autocomplete-items .p-autocomplete-item');
    const count = await suggestions.count();

    if (count === 0) {
      throw new Error(`No categories found for: "${categoryName}"`);
    }

    // Find and click the first suggestion that contains the search term
    let found = false;
    for (let i = 0; i < count; i++) {
      const suggestionText = await suggestions.nth(i).textContent();
      
      if (suggestionText?.toLowerCase().includes(categoryName.toLowerCase())) {
        await suggestions.nth(i).click();
        found = true;
        break;
      }
    }

    if (!found) {
      throw new Error(`Category "${categoryName}" not found in suggestions`);
    }

    await this.page.waitForTimeout(300);
  } catch (error) {
    console.error(`Failed to select category: ${categoryName}`, error);
    throw error;
  }
}
  /**
   * Browse category using Browse Category button
   */
  async browseCategory() {
    await this.browseCategoryBtn.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Fill product description
   */
  async fillProductDescription(description: string) {
   // await this.productDescriptionTextarea.waitFor({ state: 'visible', timeout: 5000 });
    await this.productDescriptionTextarea.click({force: true});
    await this.productDescriptionTextarea.clear();
    await this.productDescriptionTextarea.fill(description);
  }

  /**
   * Get product description error message
   */
  async getProductDescriptionError() {
    try {
      const error = await this.productDescriptionError.textContent();
      return error;
    } catch {
      return null;
    }
  }

  /**
   * Check if product description error is visible
   */
  async isProductDescriptionErrorVisible() {
    try {
      await this.productDescriptionError.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Fill estimated order quantity
   */
  async fillOrderQuantity(quantity: string | number) {
    await this.orderQuantityInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.orderQuantityInput.clear();
    await this.orderQuantityInput.fill(String(quantity));
  }

  /**
   * Select unit type for order quantity
   */
  async selectUnit(unitType: string) {
    await this.unitsDropdown.waitFor({ state: 'visible', timeout: 5000 });
    await this.unitsDropdown.click();
    await this.page.waitForTimeout(500);

    try {
      const unitOption = this.page.locator(
        `.p-dropdown-items .p-dropdown-item:has-text("${unitType}")`
      ).first();
      await unitOption.waitFor({ state: 'visible', timeout: 5000 });
      await unitOption.click();
    } catch (error) {
      console.error(`Failed to select unit: ${unitType}`, error);
      throw error;
    }
  }

  /**
   * Fill order quantity and unit together
   */
  async fillOrderQuantityAndUnit(quantity: string | number, unit: string) {
    await this.fillOrderQuantity(quantity);
    await this.page.waitForTimeout(300);
    await this.selectUnit(unit);
  }

  /**
   * Expand advanced requirements section
   */
  async expandAdvancedRequirements() {
    const advReqBlock = this.page.locator('.adv-req-block');
    const triggerIcon = advReqBlock.locator('.trigger-icon');

    try {
      await advReqBlock.waitFor({ state: 'visible', timeout: 5000 });
      
      const isExpanded = await advReqBlock.evaluate((el: HTMLElement) => {
        const icon = el.querySelector('.trigger-icon') as HTMLElement;
        const transform = window.getComputedStyle(icon).transform;
        return transform.includes('rotate') || false;
      });

      if (!isExpanded) {
        await triggerIcon.click();
        await this.page.waitForTimeout(300);
      }
    } catch (error) {
      console.error('Failed to expand advanced requirements', error);
    }
  }

  /**
   * Collapse advanced requirements section
   */
  async collapseAdvancedRequirements() {
    const advReqBlock = this.page.locator('.adv-req-block');
    const triggerIcon = advReqBlock.locator('.trigger-icon');

    try {
      const isExpanded = await advReqBlock.evaluate((el: HTMLElement) => {
        const icon = el.querySelector('.trigger-icon') as HTMLElement;
        const transform = window.getComputedStyle(icon).transform;
        return transform.includes('rotate') || false;
      });

      if (isExpanded) {
        await triggerIcon.click();
        await this.page.waitForTimeout(300);
      }
    } catch (error) {
      console.error('Failed to collapse advanced requirements', error);
    }
  }

  /**
   * Fill advanced requirements textarea
   */
  async fillAdvancedRequirements(requirements: string) {
    await this.expandAdvancedRequirements();

    try {
      const advancedTextarea = this.page.locator('textarea[name="advancedRequirements"]');
      await advancedTextarea.waitFor({ state: 'visible', timeout: 5000 });
      await advancedTextarea.clear();
      await advancedTextarea.fill(requirements);
    } catch (error) {
      console.error('Failed to fill advanced requirements', error);
      throw error;
    }
  }

  /**
   * Fill complete buying request form
   */
  async fillCompleteForm(formData: {
    productName: string;
    category: string;
    description: string;
    orderQuantity: string | number;
    unit: string;
    advancedRequirements?: string;
  }) {
    await this.waitForFormToLoad();
    await this.fillProductName(formData.productName);
    await this.selectCategory(formData.category);
    await this.fillProductDescription(formData.description);
    await this.fillOrderQuantityAndUnit(formData.orderQuantity, formData.unit);

    if (formData.advancedRequirements && formData.advancedRequirements.trim()) {
      await this.fillAdvancedRequirements(formData.advancedRequirements);
    }
  }

  /**
   * Submit the form by clicking Continue button
   */
  async submitForm() {
    await this.continueBtn.waitFor({ state: 'visible', timeout: 5000 });
    await this.continueBtn.click();
    
    try {
      await this.page.waitForNavigation({ timeout: 10000 });
    } catch {
      // Navigation might not happen immediately, wait a bit more
      await this.page.waitForTimeout(2000);
    }
  }

  /**
   * Save and continue later
   */
  async saveAndContinueLater() {
    await this.saveAndContinueLaterBtn.waitFor({ state: 'visible', timeout: 5000 });
    await this.saveAndContinueLaterBtn.click();
    await this.page.waitForTimeout(2000);
  }

  /**
   * Get all form values
   */
  async getFormValues() {
    return {
      productName: await this.productNameInput.inputValue(),
      description: await this.productDescriptionTextarea.textContent(),
      orderQuantity: await this.orderQuantityInput.inputValue(),
    };
  }

  /**
   * Clear the entire form
   */
  async clearForm() {
    await this.productNameInput.clear();
    await this.productDescriptionTextarea.clear();
    await this.orderQuantityInput.clear();
  }

  /**
   * Verify Continue button is enabled
   */
  async isContinueButtonEnabled() {
    return await this.continueBtn.isEnabled();
  }

  /**
   * Verify Continue button is visible
   */
  async isContinueButtonVisible() {
    return await this.continueBtn.isVisible();
  }

  /**
   * Check if form has validation errors
   */
  async hasValidationErrors() {
    const errorElements = this.page.locator('span.error-txt');
    return (await errorElements.count()) > 0;
  }

  /**
   * Get all validation error messages
   */
  async getValidationErrors() {
    const errorElements = this.page.locator('span.error-txt');
    const errors: string[] = [];
    const count = await errorElements.count();

    for (let i = 0; i < count; i++) {
      const text = await errorElements.nth(i).textContent();
      if (text) errors.push(text.trim());
    }

    return errors;
  }

  /**
   * Close the sidebar/form
   */
  async closeSidebar() {
    const closeBtn = this.page.locator('.o-s-c-header svg').last();
    await closeBtn.waitFor({ state: 'visible', timeout: 5000 });
    await closeBtn.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Get current unit selected in dropdown
   */
  async getSelectedUnit() {
    const unitLabel = this.unitsDropdown.locator('.p-dropdown-label');
    return await unitLabel.textContent();
  }

  /**
   * Check if advanced requirements section is expanded
   */
  async isAdvancedRequirementsExpanded() {
    const textarea = this.page.locator('textarea[name="advancedRequirements"]');

    try {
      await textarea.waitFor({ state: 'visible', timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }
  async clickSuccessMessageOkButton() {
    const iframe = await this.page.waitForSelector('iframe', { timeout: 1000 }).catch(() => null);
    console.log('Iframe found:', !!iframe);
  if (iframe) {
    // Switch to the iframe context
    const iframeElement = await iframe.contentFrame() ;

      if (!iframeElement) {
        console.log('Failed to get iframe content');
        return;
      }
      await this.page.pause();
    // Wait for the link to appear inside the iframe (replace with your link selector)
    const link = await iframeElement.waitForSelector('a#underline-link', { timeout: 1000 }).catch(() => null);

    if (link) {
      // Capture the link's href
      const linkHref = await link.getAttribute('href');
      console.log('Captured Link:', linkHref);

      // Click on the link
      await link.click();
    } else {
      console.log('Link not found in iframe');
    }
  } else {
    console.log('Iframe did not appear within the time frame');
  }
}
}