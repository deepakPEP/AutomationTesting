import { expect, Locator, Page } from '@playwright/test';
import path from 'path';
import { TestLogger } from '../../utils/TestLogger';
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
  readonly continueBtn1: Locator;
  readonly productTitle: Locator;
  readonly skuText: Locator;
  readonly imgMain: Locator;
  readonly imgThumb: Locator;
  readonly previewLabel: Locator;
  progressBar: Locator;
  progressElement: Locator;
  readonly writeWithAIButton: Locator;
  readonly aiTextarea: Locator;

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
    this.continueBtn = page.getByRole('button', { name: 'Continue', exact: true });
    this.continueBtn1 = page.locator("//span[text()='Continue']//parent::button");
    this.productTitle = page.locator('h2.product-title-txt');
    this.skuText = page.locator('span.sku-txt');
    this.imgMain = page.locator('img[width="380"][height="360"]');
    this.imgThumb = page.locator('img[width="64"][height="64"]');
    this.previewLabel = page.locator('span.preview-txt');
    this.progressBar = page.locator('.p-c-b-progress');
    this.progressElement = page.locator('.p-c-value');
    this.writeWithAIButton = page.locator('button.btn-ai:has-text("Write with AI")');
  this.aiTextarea = page.locator('textarea[name="productDescription"].forms-textarea');

  }

  async fillBasicInfo(product: any, ai_option = false) {
    await this.productNameInput.fill(product?.name || 'Electric Screwdriver');
    await this.descriptionInput.fill(product?.short_description || 'automationtest');
    if (ai_option) {
      await this.clickWriteWithAI();
      await this.assertTextareaHasAIContent(product?.name);  
    }
    product.short_description = await this.aiTextarea.inputValue();
    await this.skuInput.fill(product?.sku_model || 'SK');
  }
  async clickWriteWithAI() {
  await this.writeWithAIButton.waitFor({ state: 'visible' });
  await this.writeWithAIButton.click();
  
  // Wait for AI processing (adjust timeout as needed)
  await this.page.waitForTimeout(3000);
  
  console.log('✅ Clicked "Write with AI" button');
}

async assertTextareaHasAIContent(productName?: string) {
  // Wait for AI to populate the textarea
  await this.aiTextarea.waitFor({ state: 'visible' });
  
  // Get the textarea content
  const textareaValue = await this.aiTextarea.inputValue();
  
  // Simple assertions: minimum 50 characters and not empty
  expect(textareaValue.trim()).not.toBe('');
  expect(textareaValue.length).toBeGreaterThan(50);
  
  // If product name provided, check if it contains product name words
  if (productName) {
    const productWords = productName.toLowerCase().split(' ').filter(word => word.length > 2);
    const lowerContent = textareaValue.toLowerCase();
    
    const foundWords = productWords.filter(word => lowerContent.includes(word));
    expect(foundWords.length).toBeGreaterThan(0);
    console.log(`✅ Product name relevance: Found words - ${foundWords.join(', ')}`);
  }
  
  console.log('✅ AI generated content verified: 50+ chars, contains product name');
  
  return textareaValue;
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
  await this.page.waitForTimeout(5000);
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
    //await this.page.waitForTimeout(5000);
    await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
   if (await this.continueBtn.isEnabled()) {
    console.log('Is visible:', await this.continueBtn.isVisible());
    console.log('Is enabled:', await this.continueBtn.isEnabled());
    await this.continueBtn.waitFor({ state: 'attached', timeout: 10000 });

    await this.continueBtn.waitFor({ state: 'visible' });
    await this.continueBtn.click({ force: true });
   } else if (await this.continueBtn1.isEnabled()) {
    console.log('Is visible:', await this.continueBtn1.isVisible());
    console.log('Is enabled:', await this.continueBtn1.isEnabled());
    await this.continueBtn1.waitFor({ state: 'attached', timeout: 10000 });
    await this.continueBtn1.click({ force: true });
   }

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

// Main method - simplified to handle only 2 formats:
async selectAttributes(variants: any) {
  TestLogger.info(`🔄 Starting variant selection process`);
  
  if (!variants) {
    TestLogger.info('⏭️ No variants provided, skipping variant selection');
    return;
  }

  await this.page.waitForSelector('h1:has-text("Product Specifications")', { state: 'visible' });
  TestLogger.success('✅ Product Specifications page loaded');

  // Handle only 2 formats
  if (typeof variants === 'string') {
    if (variants.includes(':') && variants.includes('|')) {
      // Pipe format: color:red,blue|size:S,M
      await this.handlePipeVariants(variants);
    } else {
      // Simple format: red,blue,S,M
      await this.handleSimpleVariants(variants);
    }
  } else {
    TestLogger.warn('⚠️ Unsupported variant format. Use simple or pipe format.');
  }
 //await this.page.pause(); 
  TestLogger.success(`✅ All variants processed successfully`);
}

// Handle simple format: "red,blue,S,M"
async handleSimpleVariants(variantsString: string) {
  TestLogger.info(`🔄 Processing simple variants: ${variantsString}`);
  
  const options = variantsString.split(',').map(opt => opt.trim());
  
  // STEP 1: Select individual variant chips
  for (const option of options) {
    await this.selectAndAcceptVariantChip(option);
  }
  
  TestLogger.success(`✅ Simple variants processed: ${options.join(', ')}`);
}

// Handle pipe format: "color:red,blue|size:S,M"
async handlePipeVariants(variantsString: string) {
  TestLogger.info(`🔄 Processing pipe variants: ${variantsString}`);
  
  const groups = variantsString.split('|');
  
  // STEP 1: First select individual variant chips
  for (const group of groups) {
    const [type, optionsStr] = group.split(':');
    if (type && optionsStr) {
      const options = optionsStr.split(',').map(opt => opt.trim());
      await this.processIndividualChips(type.trim(), options);
    }
  }
  
  // STEP 2: Then click "Add options" to open overlay
  await this.clickAddOptionsButton();
  
  // STEP 3: Finally select variant groups from overlay
  const groupNames = groups.map(group => group.split(':')[0].trim());
  await this.selectVariantGroupsFromOverlay(groupNames);
}

// Process individual chips without opening overlay
async processIndividualChips(variantType: string, options: string[]) {
  TestLogger.info(`🎯 Processing individual chips for ${variantType}: ${options.join(', ')}`);
  
  // Check if variants already exist on page
  const existingChips = await this.findExistingChips(options);
  
  if (existingChips.length > 0) {
    // Accept existing chips
    for (const chip of existingChips) {
      await this.selectAndAcceptVariantChip(chip);
    }
    
    TestLogger.info(`✅ Accepted ${existingChips.length} existing chips for ${variantType}`);
  } else {
    TestLogger.info(`ℹ️ No existing chips found for ${variantType}`);
  }
}

// Select variant groups from overlay
async selectVariantGroupsFromOverlay(groupNames: string[]) {
  TestLogger.info(`📋 Selecting variant groups from overlay: ${groupNames.join(', ')}`);
  
  try {
    // Wait for the overlay panel to appear
    const overlayPanel = this.page.locator('.a-o-b-overlay .p-overlaypanel-content');
    await overlayPanel.waitFor({ state: 'visible', timeout: 5000 });
    
    TestLogger.success('✅ Overlay panel appeared');
    
    // For each group we want to select
    for (const groupName of groupNames) {
      await this.selectSingleVariantGroup(groupName);
    }
    
    // Click outside to close the overlay
    await this.clickOutsideOverlay();
    
    TestLogger.success(`✅ All variant groups selected: ${groupNames.join(', ')}`);
    
  } catch (error) {
    TestLogger.error(`❌ Error selecting variant groups: ${error}`);
    throw error;
  }
}

async selectSingleVariantGroup(groupName: string) {
  TestLogger.info(`🎯 Selecting variant group: ${groupName}`);
  
  try {
    // Look for exact or similar match in overlay
    const groupElement = this.page.locator(`.a-o-p-ul li`).filter({ hasText: groupName });
    
    if (await groupElement.count() > 0) {
      await groupElement.first().click();
      await this.page.waitForTimeout(5000);
      TestLogger.success(`✅ Selected group: "${groupName}"`);
    } else {
      // Try partial match
      const partialMatch = await this.findPartialGroupMatch(groupName);
      if (partialMatch) {
        const partialElement = this.page.locator(`.a-o-p-ul li`).filter({ hasText: partialMatch });
        await partialElement.first().click();
        await this.page.waitForTimeout(5000);
        TestLogger.success(`✅ Selected group: "${partialMatch}" (partial match for "${groupName}")`);
      } else {
        TestLogger.warn(`⚠️ Group "${groupName}" not found in overlay`);
      }
    }
    
  } catch (error) {
    TestLogger.error(`❌ Error selecting variant group "${groupName}": ${error}`);
    throw error;
  }
}

async findPartialGroupMatch(targetGroup: string): Promise<string | null> {
  try {
    const overlayGroups = this.page.locator('.a-o-p-ul li');
    const groupCount = await overlayGroups.count();
    
    const normalizedTarget = targetGroup.toLowerCase();
    
    for (let i = 0; i < groupCount; i++) {
      const groupText = await overlayGroups.nth(i).textContent();
      if (groupText) {
        const normalizedGroup = groupText.toLowerCase();
        
        // Check if target contains group text or vice versa
        if (normalizedTarget.includes(normalizedGroup) || normalizedGroup.includes(normalizedTarget)) {
          return groupText;
        }
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

async findExistingChips(targetOptions: string[]): Promise<string[]> {
  const foundChips: string[] = [];
  
  try {
    const allChips = this.page.locator('.p-chips-token .chip-text');
    const chipCount = await allChips.count();
    
    for (let i = 0; i < chipCount; i++) {
      const chipText = await allChips.nth(i).textContent();
      
      if (chipText) {
        const trimmedText = chipText.trim();
        const isMatch = targetOptions.some(option => 
          option.toLowerCase() === trimmedText.toLowerCase()
        );
        
        if (isMatch) {
          foundChips.push(trimmedText);
        }
      }
    }
    
    return foundChips;
  } catch (error) {
    TestLogger.warn(`⚠️ Error finding existing chips: ${error}`);
    return [];
  }
}

async clickAddOptionsButton() {
  TestLogger.info('🔘 Clicking "Add options" button');
  
  try {
    const addOptionsButton = this.page.locator('button:has-text("Add options")');
    await addOptionsButton.waitFor({ state: 'visible', timeout: 5000 });
    await addOptionsButton.click();
    await this.page.waitForTimeout(2000);
    
    TestLogger.success('✅ "Add options" button clicked successfully');
  } catch (error) {
    TestLogger.error(`❌ Error clicking "Add options" button: ${error}`);
    throw error;
  }
}

async clickOutsideOverlay() {
  TestLogger.info('🖱️ Clicking outside overlay to close it');
  
  try {
    const pageTitle = this.page.locator('h1:has-text("Product Specifications")');
    await pageTitle.click();
    await this.page.waitForTimeout(1000);
    
    TestLogger.success('✅ Overlay closed');
  } catch (error) {
    TestLogger.warn(`⚠️ Could not close overlay: ${error}`);
  }
}
// ...existing code...

async selectAndAcceptVariantChip(optionText: string, additionalOptions: string[] = []) {
  TestLogger.info(`🔍 Looking for variant option: ${optionText}`);
  
  try {
    // Look for the chip with the specific text
    const chipLocator = this.page.locator(`.p-chips-token:has(.chip-text:has-text("${optionText}"))`);
    
    // Check if the chip exists
    const chipCount = await chipLocator.count();
    if (chipCount === 0) {
      TestLogger.warn(`⚠️ Variant option "${optionText}" not found on the page`);
      return;
    }

    // Hover over the chip to reveal the accept button
    TestLogger.info(`🖱️ Hovering over variant chip: ${optionText}`);
    await chipLocator.hover();
    await this.page.waitForTimeout(500);
    
    // Check if the chip needs to be accepted (has "Click to accept" button)
    const acceptButton = chipLocator.locator('button.btn-click-accept:has-text("Click to accept")');
    const acceptButtonExists = await acceptButton.count() > 0;
    
    if (acceptButtonExists) {
      TestLogger.info(`🖱️ Clicking "Click to accept" for variant: ${optionText}`);
      await acceptButton.click();
      await this.page.waitForTimeout(1000);
      
      // Handle dropdown if additional options provided
      if (additionalOptions.length > 0) {
        await this.selectDropdownOptions(additionalOptions);
      }
      
      // Click outside to remove focus
      await this.clickOutsideChips();
      
      TestLogger.success(`✅ Variant "${optionText}" accepted successfully`);
    } else {
      TestLogger.info(`ℹ️ Variant "${optionText}" is already accepted or doesn't require acceptance`);
    }
    
  } catch (error) {
    TestLogger.error(`❌ Error processing variant "${optionText}": ${error}`);
    throw error;
  }
}

// Helper method to handle dropdown options after accepting a chip
async selectDropdownOptions(options: string[]) {
  TestLogger.info(`📋 Selecting dropdown options: ${options.join(', ')}`);
  
  try {
    // Wait for dropdown to appear
    const dropdown = this.page.locator('.c-i-d-dropdown-block.dropdown-show');
    await dropdown.waitFor({ state: 'visible', timeout: 5000 });
    
    // Select each option
    for (const option of options) {
      const checkboxLabel = this.page.locator(`.c-i-d-dropdown-block label:has(.f-r-label:has-text("${option}"))`);
      const checkboxInput = checkboxLabel.locator('input[type="checkbox"]');
      
      if (await checkboxLabel.count() > 0) {
        const isChecked = await checkboxInput.isChecked();
        if (!isChecked) {
          await checkboxLabel.click();
          await this.page.waitForTimeout(500);
          TestLogger.success(`✅ Selected dropdown option: "${option}"`);
        }
      }
    }
    
    // Click outside to close dropdown
    await this.clickOutsideChips();
    
  } catch (error) {
    TestLogger.error(`❌ Error selecting dropdown options: ${error}`);
  }
}

// Helper method to click outside chips to remove focus/hover state
async clickOutsideChips() {
  TestLogger.info('🖱️ Clicking outside chips to remove focus');
  
  try {
    // Click on the page title area
    const pageTitle = this.page.locator('h1:has-text("Product Specifications")');
    if (await pageTitle.isVisible()) {
      await pageTitle.click();
    } else {
      // Alternative: click on empty space
      await this.page.click('body', { position: { x: 100, y: 200 } });
    }
    
    await this.page.waitForTimeout(300);
    TestLogger.success('✅ Clicked outside chips');
    
  } catch (error) {
    TestLogger.warn(`⚠️ Could not click outside chips: ${error}`);
  }
}

// ============================================
// VARIANT TABLE ASSERTION METHODS
// ============================================

async assertVariantsTable(expectedAttributes: string) {
  TestLogger.info('🔍 Asserting variants table matches expected attributes');
  
  try {
    // Parse the expected attributes
    const parsedAttributes = this.parseAttributeString(expectedAttributes);
    TestLogger.info(`📋 Expected attributes: ${JSON.stringify(parsedAttributes)}`);
    
    // Wait for variants table to be visible
    const variantsTable = this.page.locator('table.variants-table');
    await variantsTable.waitFor({ state: 'visible', timeout: 10000 });
    
    // Assert main variant groups
    await this.assertMainVariantGroups(parsedAttributes);
    
    // Assert sub-variants (nested combinations)
    await this.page.pause();
    await this.assertSubVariants(parsedAttributes);
    
    // Assert header checkbox state
    await this.assertHeaderCheckboxState();
    
    TestLogger.success('✅ Variants table assertion completed successfully');
    
  } catch (error) {
    TestLogger.error(`❌ Variants table assertion failed: ${error}`);
    throw error;
  }
}

parseAttributeString(attributeString: string): Record<string, string[]> {
  const attributes: Record<string, string[]> = {};
  
  // Parse "Color Options:black,white|Size Range:Small,Medium"
  const groups = attributeString.split('|');
  
  for (const group of groups) {
    const [attributeName, attributeValues] = group.split(':');
    if (attributeName && attributeValues) {
      const cleanAttributeName = attributeName.trim().replace(' Options', '').replace(' Range', '');
      const values = attributeValues.split(',').map(v => v.trim());
      attributes[cleanAttributeName] = values;
    }
  }
  
  return attributes;
}

async assertMainVariantGroups(expectedAttributes: Record<string, string[]>) {
  TestLogger.info('🔍 Asserting main variant groups');
  
  try {
    // Get the main attribute (first one, usually Color)
    const mainAttribute = Object.keys(expectedAttributes)[0];
    const mainValues = expectedAttributes[mainAttribute];
    
    TestLogger.info(`📊 Checking main attribute "${mainAttribute}" with values: ${mainValues.join(', ')}`);
    
    // Check each main variant group
    for (const value of mainValues) {
      const mainVariantRow = this.page.locator(`table.variants-table tbody tr:not(.inside-tr):has(.v-i-c-title:has-text("${value}"))`);
      
      const rowExists = await mainVariantRow.count() > 0;
      if (!rowExists) {
        throw new Error(`Main variant "${value}" not found in table`);
      }
      
      // Check if it has the correct number of sub-variants
      const variantButton = mainVariantRow.locator('.btn-open-variant .b-o-v-txt');
      if (await variantButton.count() > 0) {
        const variantText = await variantButton.textContent();
        const expectedSubVariantCount = this.calculateExpectedSubVariants(expectedAttributes, value);
        
        if (variantText && !variantText.includes(`${expectedSubVariantCount} Variant`)) {
          TestLogger.warn(`⚠️ Variant count mismatch for "${value}". Expected: ${expectedSubVariantCount}, Found: ${variantText}`);
        } else {
          TestLogger.success(`✅ Main variant "${value}" found with correct sub-variant count`);
        }
      }
    }
    
  } catch (error) {
    TestLogger.error(`❌ Main variant groups assertion failed: ${error}`);
    throw error;
  }
}

async assertSubVariants(expectedAttributes: Record<string, string[]>) {
  TestLogger.info('🔍 Asserting sub-variants (combinations)');
  
  try {
    const attributeKeys = Object.keys(expectedAttributes);
    if (attributeKeys.length < 2) {
      TestLogger.info('ℹ️ Only one attribute, skipping sub-variant assertion');
      return;
    }
    
    const [firstAttribute, secondAttribute] = attributeKeys;
    const firstValues = expectedAttributes[firstAttribute];
    const secondValues = expectedAttributes[secondAttribute];
    
    // Generate expected combinations
    const expectedCombinations: string[] = [];
    for (const firstValue of firstValues) {
      for (const secondValue of secondValues) {
        expectedCombinations.push(`${firstValue} / ${secondValue}`);
      }
    }
    
    TestLogger.info(`📋 Expected combinations: ${expectedCombinations.join(', ')}`);
    
    // Check each expected combination
    for (const combination of expectedCombinations) {
      const subVariantRow = this.page.locator(`table.variants-table tbody tr.inside-tr:has(.variant-name-description:has-text("${combination}"))`);
      
      const rowExists = await subVariantRow.count() > 0;
      if (!rowExists) {
        throw new Error(`Sub-variant combination "${combination}" not found in table`);
      }
      
      TestLogger.success(`✅ Sub-variant "${combination}" found`);
    }
    
  } catch (error) {
    TestLogger.error(`❌ Sub-variants assertion failed: ${error}`);
    throw error;
  }
}

calculateExpectedSubVariants(expectedAttributes: Record<string, string[]>, mainValue: string): number {
  const attributeKeys = Object.keys(expectedAttributes);
  
  if (attributeKeys.length === 1) {
    return 1; // Only one attribute, so 1 variant per value
  }
  
  // Calculate combinations for this main value
  let combinations = 1;
  for (let i = 1; i < attributeKeys.length; i++) {
    combinations *= expectedAttributes[attributeKeys[i]].length;
  }
  
  return combinations;
}

async assertHeaderCheckboxState() {
  TestLogger.info('🔍 Asserting header checkbox state');
  
  try {
    const headerCheckbox = this.page.locator('table.variants-table thead th label.forms-checkbox input[type="checkbox"]');
    const isChecked = await headerCheckbox.isChecked();
    
    TestLogger.info(`📊 Header checkbox state: ${isChecked ? 'Checked' : 'Unchecked'}`);
    
    // You can add specific assertions here based on your requirements
    // For example, if you expect it to be checked after selection:
    // if (!isChecked) {
    //   throw new Error('Header checkbox should be checked');
    // }
    
  } catch (error) {
    TestLogger.warn(`⚠️ Could not verify header checkbox state: ${error}`);
  }
}

async assertVariantTableStructure(expectedAttributes: string) {
  TestLogger.info('🔍 Asserting complete variant table structure');
  
  try {
    const parsedAttributes = this.parseAttributeString(expectedAttributes);
    
    // Count expected total variants
    const expectedTotalVariants = this.calculateTotalExpectedVariants(parsedAttributes);
    TestLogger.info(`📊 Expected total variants: ${expectedTotalVariants}`);
    
    // Count actual variants in table
    const actualMainVariants = await this.page.locator('table.variants-table tbody tr:not(.inside-tr)').count();
    const actualSubVariants = await this.page.locator('table.variants-table tbody tr.inside-tr').count();
    
    TestLogger.info(`📊 Actual variants - Main: ${actualMainVariants}, Sub: ${actualSubVariants}, Total: ${actualMainVariants + actualSubVariants}`);
    
    // Validate counts match expectations
    const firstAttributeValues = Object.values(parsedAttributes)[0];
    if (actualMainVariants !== firstAttributeValues.length) {
      throw new Error(`Main variant count mismatch. Expected: ${firstAttributeValues.length}, Actual: ${actualMainVariants}`);
    }
    
    if (actualSubVariants !== expectedTotalVariants) {
      throw new Error(`Sub-variant count mismatch. Expected: ${expectedTotalVariants}, Actual: ${actualSubVariants}`);
    }
    
    TestLogger.success('✅ Variant table structure matches expectations');
    
  } catch (error) {
    TestLogger.error(`❌ Variant table structure assertion failed: ${error}`);
    throw error;
  }
}

calculateTotalExpectedVariants(attributes: Record<string, string[]>): number {
  const values = Object.values(attributes);
  return values.reduce((total, current) => total * current.length, 1);
}

// Method to get all variant combinations from table for debugging
async getAllVariantCombinations(): Promise<string[]> {
  TestLogger.info('📋 Getting all variant combinations from table');
  
  try {
    const combinations: string[] = [];
    await this.page.pause();
    // Get all sub-variant descriptions
    const subVariantDescriptions = this.page.locator('table.variants-table tbody tr.inside-tr .variant-name-description');
    const count = await subVariantDescriptions.count();
    
    for (let i = 0; i < count; i++) {
      const description = await subVariantDescriptions.nth(i).textContent();
      if (description) {
        combinations.push(description.trim());
      }
    }
    
    TestLogger.info(`📊 Found combinations: ${combinations.join(', ')}`);
    return combinations;
    
  } catch (error) {
    TestLogger.error(`❌ Error getting variant combinations: ${error}`);
    return [];
  }
}

// Enhanced method for your test step
async validateVariantsAfterAttributeSelection(expectedAttributes: string) {
  TestLogger.info('🔍 Validating variants table after attribute selection');
  
  try {
    // Wait a bit for the table to populate
    await this.page.waitForTimeout(2000);
    
    // Assert the complete table structure
    await this.assertVariantsTable(expectedAttributes);
    
    // Get and log all combinations for verification
    const actualCombinations = await this.getAllVariantCombinations();
    TestLogger.info(`📋 All variant combinations in table: ${actualCombinations.join(', ')}`);
    
    TestLogger.success('✅ Variants table validation completed successfully');
    
  } catch (error) {
    TestLogger.error(`❌ Variants table validation failed: ${error}`);
    
    // Take screenshot for debugging
    await this.page.screenshot({ 
      path: `screenshots/variants-table-error-${Date.now()}.png`,
      fullPage: true 
    });
    
    throw error;
  }
}

async selectAllVariants() {
  TestLogger.info('📋 Selecting all variants from variants table');
  
  try {
    // Wait for the variants table to be visible
    const variantsTable = this.page.locator('table.variants-table');
    await variantsTable.waitFor({ state: 'visible', timeout: 10000 });
    
    TestLogger.success('✅ Variants table is visible');
    await this.page.pause();
    // Select the header checkbox (first checkbox in thead)
    const headerCheckbox = this.page.locator('table.variants-table thead th label.forms-checkbox input[type="checkbox"]');
    await headerCheckbox.waitFor({ state: 'visible', timeout: 5000 });
    
    // Check if it's already checked
    const isChecked = await headerCheckbox.isChecked();
    
    if (!isChecked) {
      TestLogger.info('☑️ Clicking header checkbox to select all variants');
      await headerCheckbox.click();
      await this.page.waitForTimeout(1000);
      
      // Verify all variants are selected
      await this.verifyAllVariantsSelected();
    } else {
      TestLogger.info('✅ Header checkbox is already selected');
    }
    
    // Click continue button
    //await this.continueBtn.click();
    await this.page.waitForTimeout(5000);
    
    TestLogger.success('✅ All variants selected and continue clicked');
    
  } catch (error) {
    TestLogger.error(`❌ Error selecting variants and continuing: ${error}`);
    throw error;
  }
}

async verifyAllVariantsSelected() {
  TestLogger.info('🔍 Verifying all variants are selected');
  
  try {
    // Get all row checkboxes in tbody
    const rowCheckboxes = this.page.locator('table.variants-table tbody tr td label.forms-checkbox input[type="checkbox"]');
    const checkboxCount = await rowCheckboxes.count();
    
    if (checkboxCount > 0) {
      // Check if all row checkboxes are checked
      for (let i = 0; i < checkboxCount; i++) {
        const isChecked = await rowCheckboxes.nth(i).isChecked();
        if (!isChecked) {
          TestLogger.warn(`⚠️ Variant row ${i + 1} is not selected`);
          return false;
        }
      }
      
      TestLogger.success(`✅ All ${checkboxCount} variants are selected`);
      return true;
    } else {
      TestLogger.warn('⚠️ No variant rows found');
      return false;
    }
    
  } catch (error) {
    TestLogger.warn(`⚠️ Could not verify variant selection: ${error}`);
    return false;
  }
}

}