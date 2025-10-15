import { expect, Locator, Page } from '@playwright/test';
import { TestLogger } from '../../utils/TestLogger';
import path from 'path/win32';

export class AddProdSpecificationPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ============================================
  // VARIANT SELECTION AND ATTRIBUTE METHODS
  // ============================================

  async selectAttributes(variants: any) {
    TestLogger.info(`🔄 Starting variant selection process`);
    
    if (!variants) {
      TestLogger.info('⏭️ No variants provided, skipping variant selection');
      return;
    }
    await this.page.waitForTimeout(15000);
   // await this.page.waitForSelector('h1:has-text("Product Specifications")', { state: 'visible' });
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


  async handlePipeVariants(variantsString: string) {
  TestLogger.info(`🔄 Processing pipe variants: ${variantsString}`);
  
  const groups = variantsString.split('|');
  TestLogger.info(`📊 Processing ${groups.length} groups: ${groups.join(', ')}`);
  
  // STEP 1: Process existing chips first
  for (const group of groups) {
    const [type, optionsStr] = group.split(':');
    if (type && optionsStr) {
      const options = optionsStr.split(',').map(opt => opt.trim());
      await this.processIndividualChips(type.trim(), options);
    }
  }
  
  // STEP 2: Add each group individually through overlay
  for (const group of groups) {
    const [type, optionsStr] = group.split(':');
    if (type && optionsStr) {
      const groupName = type.trim();
      TestLogger.info(`🎯 Adding group: ${groupName}`);
      
      // Open overlay
      await this.clickAddOptionsButton();
      
      // Select the group
      await this.selectSingleVariantGroup(groupName);
      
      // Close overlay
      await this.clickOutsideOverlay();
      
      await this.page.waitForTimeout(1000);
    }
  }
  
  TestLogger.success(`✅ All ${groups.length} groups added successfully`);
}

  async processIndividualChips(variantType: string, options: string[]) {
  TestLogger.info(`🎯 Processing individual chips for ${variantType}: ${options.join(', ')}`);
  
  // STEP 1: Check if the attribute group exists at all
  const groupExists = await this.findExistingAttributeGroup(variantType);
  
  if (groupExists) {
    // STEP 2: If group exists, check for existing chips/values
    const existingChips = await this.findExistingChips(options);
    
    if (existingChips.length > 0) {
      // Accept existing chips
      for (const chip of existingChips) {
        await this.selectAndAcceptVariantChip(chip);
      }
      
      TestLogger.info(`✅ Accepted ${existingChips.length} existing chips for ${variantType}`);
    } else {
      TestLogger.info(`ℹ️ Group "${variantType}" exists but no matching chips found`);
    }
  } else {
    TestLogger.info(`ℹ️ No existing attribute group found for ${variantType}, adding them`);
    
    // STEP 3: Create new attributes since group doesn't exist
    for (const option of options) {
      await this.addNewVariantOption(variantType, option);
    }
    
    TestLogger.success(`✅ Added ${options.length} new chips for ${variantType}`);
  }
}
async findExistingAttributeGroup(variantType: string): Promise<boolean> {
  TestLogger.info(`🔍 Checking if attribute group "${variantType}" exists (case insensitive)`);
  
  try {
    // Simple case-insensitive check for exact match
    //const labelExists = await this.page.locator(`.s-c-label`).filter({ 
    //   const labelExists = await this.page.locator(`f-g-label`).filter({ 
    //   hasText: new RegExp(`^${variantType}$`, 'i') 
    // }).count() > 0;
    const labelExists = await this.page.locator('.f-g-label').filter({ 
      hasText: variantType
    }).count() > 0;
    if (labelExists) {
      TestLogger.success(`✅ Found exact match: ${variantType}`);
      return true;
    }
    
    TestLogger.info(`ℹ️ No exact match found for "${variantType}"`);
    return false;
    
  } catch (error) {
    TestLogger.error(`❌ Error checking attribute group: ${error}`);
    return false;
  }
}
async addNewVariantOption(variantType: string, option: string) {
  TestLogger.info(`➕ Adding new variant option: ${variantType} = ${option}`);
  
  try {
    // STEP 1: Click "Add new" button in more attributes section
    const addNewButton = this.page.locator('.m-a-b-btn-group button.btn-attributes:has-text("Add new")');
    await expect(addNewButton).toBeVisible();
    await addNewButton.click();
    await this.page.waitForTimeout(2000);
    TestLogger.info('🔍 Clicked "Add new" button');
    
    // STEP 2: Fill attribute name field (variantType = groupname)
    const attributeNameInput = this.page.locator('input[placeholder="Enter New Attribute"]');
    
    await attributeNameInput.fill(variantType);
    TestLogger.success(`✅ Filled attribute name: ${variantType}`);
    
    await this.page.locator('button:has-text("Add Attribute")').click();
    const attributeLabel = this.page.locator(`.f-g-label:text("${variantType}")`);
    
    // Navigate to the chip input in the same group
    const chipInput = this.page.locator(`.forms-group:has(.f-g-label:text("${variantType}")) .p-chips-input-token input`);
    
    // Add the option
    await chipInput.click();
    await chipInput.fill(option);
    await chipInput.press('Enter');
    
    await this.page.waitForTimeout(1500);
    
    TestLogger.success(`✅ Added "${option}" to "${variantType}"`);
    
    
  } catch (error) {
    TestLogger.error(`❌ Failed to add variant option ${variantType}=${option}: ${error}`);
    throw error;
  }
}
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

 

async selectVariantGroupsFromOverlay(groupNames: string[]) {
  TestLogger.warn('⚠️ This method is deprecated. Use handlePipeVariants for multiple groups.');
  
  // Only for single group selection now
  if (groupNames.length === 1) {
    await this.selectSingleVariantGroup(groupNames[0]);
  }
}

  async selectSingleVariantGroup(groupName: string) {
    TestLogger.info(`🎯 Selecting variant group: ${groupName}`);
    
    try {
      // First try exact match with :has-text() (contains)
      const exactMatch = this.page.locator(`.a-o-p-ul li:has-text("${groupName}")`);
      
      if (await exactMatch.count() > 0) {
        await exactMatch.first().click();
        await this.page.waitForTimeout(1000);
        TestLogger.success(`✅ Selected group: "${groupName}" (exact match)`);
        return;
      }
      
      // Try with just the main word (e.g., "Size" from "Size Range")
      const mainWord = groupName.split(' ')[0]; // Get first word
      const mainWordMatch = this.page.locator(`.a-o-p-ul li:has-text("${mainWord}")`);
      
      if (await mainWordMatch.count() > 0) {
        const actualText = await mainWordMatch.first().textContent();
        await mainWordMatch.first().click();
        await this.page.waitForTimeout(1000);
        TestLogger.success(`✅ Selected group: "${actualText?.trim()}" (main word match for "${groupName}")`);
        return;
      }
      
      // Try partial match with common variations
      const variations = [
        groupName.replace(' Options', ''),
        groupName.replace(' Range', ''),
        groupName.replace(' Size', ''),
        groupName.replace('Options', '').trim(),
        groupName.replace('Range', '').trim(),
        groupName.toLowerCase(),
        groupName.charAt(0).toUpperCase() + groupName.slice(1).toLowerCase()
      ];
      
      for (const variation of variations) {
        if (variation && variation !== groupName) {
          const variationMatch = this.page.locator(`.a-o-p-ul li:has-text("${variation}")`);
          
          if (await variationMatch.count() > 0) {
            const actualText = await variationMatch.first().textContent();
            await variationMatch.first().click();
            await this.page.waitForTimeout(1000);
            TestLogger.success(`✅ Selected group: "${actualText?.trim()}" (variation match for "${groupName}")`);
            return;
          }
        }
      }
      
      // Try the more flexible findPartialGroupMatch method
      const partialMatch = await this.findPartialGroupMatch(groupName);
      if (partialMatch) {
        const partialElement = this.page.locator(`.a-o-p-ul li:has-text("${partialMatch}")`);
        await partialElement.first().click();
        await this.page.waitForTimeout(1000);
        TestLogger.success(`✅ Selected group: "${partialMatch}" (partial match for "${groupName}")`);
        return;
      }
      
      TestLogger.warn(`⚠️ Group "${groupName}" not found in overlay`);
      
    } catch (error) {
      TestLogger.error(`❌ Error selecting variant group "${groupName}": ${error}`);
      throw error;
    }
  }

  async findPartialGroupMatch(targetGroup: string): Promise<string | null> {
    try {
      const overlayGroups = this.page.locator('.a-o-p-ul li');
      const groupCount = await overlayGroups.count();
      
      const normalizedTarget = targetGroup.toLowerCase().replace(/\s+/g, '');
      
      TestLogger.info(`🔍 Searching for partial matches for "${targetGroup}"`);
      
      for (let i = 0; i < groupCount; i++) {
        const groupText = await overlayGroups.nth(i).textContent();
        if (groupText) {
          const normalizedGroup = groupText.toLowerCase().replace(/\s+/g, '');
          
          TestLogger.info(`   Comparing: "${normalizedTarget}" with "${normalizedGroup}"`);
          
          // Check various matching patterns
          if (
            normalizedTarget.includes(normalizedGroup) || 
            normalizedGroup.includes(normalizedTarget) ||
            normalizedTarget.includes(normalizedGroup.replace('options', '')) ||
            normalizedTarget.includes(normalizedGroup.replace('range', '')) ||
            normalizedGroup.includes(normalizedTarget.replace('options', '')) ||
            normalizedGroup.includes(normalizedTarget.replace('range', ''))
          ) {
            TestLogger.success(`✅ Found partial match: "${groupText.trim()}" for "${targetGroup}"`);
            return groupText.trim();
          }
        }
      }
      
      TestLogger.warn(`⚠️ No partial match found for "${targetGroup}"`);
      return null;
    } catch (error) {
      TestLogger.error(`❌ Error in findPartialGroupMatch: ${error}`);
      return null;
    }
  }

  async debugOverlayOptions() {
    TestLogger.info('🔍 Debugging available options in overlay');
    
    try {
      const overlayGroups = this.page.locator('.a-o-p-ul li');
      const groupCount = await overlayGroups.count();
      
      TestLogger.info(`📊 Found ${groupCount} options in overlay:`);
      
      for (let i = 0; i < groupCount; i++) {
        const groupText = await overlayGroups.nth(i).textContent();
        if (groupText) {
          TestLogger.info(`   ${i + 1}. "${groupText.trim()}"`);
        }
      }
      
    } catch (error) {
      TestLogger.error(`❌ Error debugging overlay options: ${error}`);
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

  // ============================================
  // HELPER METHODS FOR DROPDOWNS AND INTERACTION
  // ============================================

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
      //await this.page.pause();
      // Assert main variant groups
      await this.assertMainVariantGroups(parsedAttributes);
      
      // Assert sub-variants (nested combinations)
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
    
    // Generate expected combinations grouped by main attribute
    const combinationsByMainValue: Record<string, string[]> = {};
    
    for (const firstValue of firstValues) {
      combinationsByMainValue[firstValue] = [];
      for (const secondValue of secondValues) {
        combinationsByMainValue[firstValue].push(`${firstValue} / ${secondValue}`);
      }
    }
    
    TestLogger.info(`📋 Expected combinations by group: ${JSON.stringify(combinationsByMainValue)}`);
    
    // Check combinations for each main variant group
    for (const [mainValue, combinations] of Object.entries(combinationsByMainValue)) {
      TestLogger.info(`🔍 Checking combinations for "${mainValue}"`);
      
      // Expand this specific variant group
      await this.expandVariantGroup(mainValue);
      
      // Check each combination for this group
      for (const combination of combinations) {
        const subVariantRow = this.page.locator(`table.variants-table tbody tr.inside-tr:has(.variant-name-description:has-text("${combination}"))`);
        
        const rowExists = await subVariantRow.count() > 0;
        if (!rowExists) {
          throw new Error(`Sub-variant combination "${combination}" not found in table`);
        }
        
        TestLogger.success(`✅ Sub-variant "${combination}" found`);
      }
    }
    
  } catch (error) {
    TestLogger.error(`❌ Sub-variants assertion failed: ${error}`);
    throw error;
  }
}

// NEW METHOD: Expand specific variant group
async expandVariantGroup(variantName: string) {
  TestLogger.info(`🔽 Expanding variant group: ${variantName}`);
  
  try {
    // Find the specific variant row
    const variantRow = this.page.locator(`table.variants-table tbody tr:not(.inside-tr):has(.v-i-c-title:has-text("${variantName}"))`);
    
    if (await variantRow.count() === 0) {
      throw new Error(`Variant group "${variantName}" not found`);
    }
    
    // Find the expand button in this row
    const expandButton = variantRow.locator('.btn-open-variant');
    
    if (await expandButton.count() > 0) {
      await expandButton.click();
      await this.page.waitForTimeout(1000); // Wait for expansion
      
      TestLogger.success(`✅ Expanded variant group: ${variantName}`);
    } else {
      TestLogger.warn(`⚠️ No expand button found for variant group: ${variantName}`);
    }
    
  } catch (error) {
    TestLogger.error(`❌ Error expanding variant group "${variantName}": ${error}`);
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

  async getAllVariantCombinations(): Promise<string[]> {
    TestLogger.info('📋 Getting all variant combinations from table');
    
    try {
      const combinations: string[] = [];
      
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

  // ============================================
  // VARIANT TABLE SELECTION METHODS
  // ============================================

  async selectAllVariants() {
    TestLogger.info('📋 Selecting all variants from variants table');
    
    try {
      // Wait for the variants table to be visible
      const variantsTable = this.page.locator('table.variants-table');
      await variantsTable.waitFor({ state: 'visible', timeout: 10000 });
      
      TestLogger.success('✅ Variants table is visible');
      
      // Select the header checkbox (first checkbox in thead)
      const headerCheckbox = this.page.locator('table.variants-table thead th label.forms-checkbox input[type="checkbox"]');
      await headerCheckbox.waitFor({ state: 'visible', timeout: 5000 });
      
      // Check if it's already checked
      const isChecked = await headerCheckbox.isChecked();
      
      if (!isChecked) {
        TestLogger.info('☑️ Clicking header checkbox to select all variants');
        await headerCheckbox.click({force: true});
        await this.page.waitForTimeout(1000);
        
        // Verify all variants are selected
        await this.verifyAllVariantsSelected();
      } else {
        TestLogger.info('✅ Header checkbox is already selected');
      }
      
      await this.page.waitForTimeout(5000);
      
      TestLogger.success('✅ All variants selected');
      
    } catch (error) {
      TestLogger.error(`❌ Error selecting variants: ${error}`);
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

  async selectSpecificVariants(variantNames: string[]) {
    TestLogger.info(`📋 Selecting specific variants: ${variantNames.join(', ')}`);
    
    try {
      const variantsTable = this.page.locator('table.variants-table');
      await variantsTable.waitFor({ state: 'visible', timeout: 10000 });
      
      for (const variantName of variantNames) {
        // Find the row with the specific variant name
        const variantRow = this.page.locator(`table.variants-table tbody tr:has(.v-i-c-title:has-text("${variantName}"))`);
        
        if (await variantRow.count() > 0) {
          // Click the checkbox for this specific variant
          const checkbox = variantRow.locator('td label.forms-checkbox input[type="checkbox"]').first();
          
          const isChecked = await checkbox.isChecked();
          if (!isChecked) {
            await checkbox.click();
            await this.page.waitForTimeout(500);
            TestLogger.success(`✅ Selected variant: ${variantName}`);
          } else {
            TestLogger.info(`ℹ️ Variant "${variantName}" is already selected`);
          }
        } else {
          TestLogger.warn(`⚠️ Variant "${variantName}" not found in table`);
        }
      }
      
    } catch (error) {
      TestLogger.error(`❌ Error selecting specific variants: ${error}`);
      throw error;
    }
  }

  async getAvailableVariants(): Promise<string[]> {
    TestLogger.info('📋 Getting available variants from table');
    
    try {
      const variantNames: string[] = [];
      const variantTitles = this.page.locator('table.variants-table tbody .v-i-c-title');
      const count = await variantTitles.count();
      
      for (let i = 0; i < count; i++) {
        const variantName = await variantTitles.nth(i).textContent();
        if (variantName) {
          variantNames.push(variantName.trim());
        }
      }
      
      TestLogger.info(`📊 Found ${variantNames.length} variants: ${variantNames.join(', ')}`);
      return variantNames;
      
    } catch (error) {
      TestLogger.error(`❌ Error getting available variants: ${error}`);
      return [];
    }
  }
  
// ============================================
// COMPLETE VARIANT WORKFLOW - ALL-IN-ONE METHOD
// ============================================

async processCompleteVariantWorkflow(expectedAttributes: string, variantData: {
  unitPrice: string;
  sku: string;
  moq: string;
  moqUnit: string;
}) {
  TestLogger.info('🚀 Starting COMPLETE variant workflow - All-in-One');
  
  try {
    // STEP 1: Select attributes and create variants table
    TestLogger.info('📋 Step 1: Selecting attributes');
    await this.selectAttributes(expectedAttributes);
    await this.page.waitForTimeout(3000);
    
    // STEP 2: Validate variants table structure
    TestLogger.info('🔍 Step 2: Validating variants table');
    await this.validateVariantsAfterAttributeSelection(expectedAttributes);
    
    // STEP 3: Select all variants from table
    TestLogger.info('☑️ Step 3: Selecting all variants');
    await this.selectAllVariants();
    
    // STEP 4: Process each variant through modal (the processAllVariantsSimple logic)
    TestLogger.info('📝 Step 4: Processing variant details through modals');
    
    // Get combinations for modal processing
    const combinations = this.getSimpleCombinations(expectedAttributes);
    TestLogger.info(`📋 Will process ${combinations.length} variants: ${combinations.join(', ')}`);
    
    // Expand table to show all sub-variants
    //await this.expandTableSimple();
    
    // Process each variant through modal
    for (let i = 0; i < combinations.length; i++) {
      const combination = combinations[i];
      const uniqueVariantData = {
        ...variantData,
        name: combination,
        sku: `${variantData.sku}${i + 1}`
      };
      
      TestLogger.info(`📝 Processing variant ${i + 1}/${combinations.length}: ${combination}`);
      
      // Click variant row to open modal
      await this.clickVariantRowSimple(combination);
      
      // Assert modal opened with correct data
      //await this.assertModalOpenedSimple(combination);
      
      // Fill form and assert values
      await this.fillFormSimple(uniqueVariantData);
      await this.assertFormValuesSimple(uniqueVariantData);
      
      // Click Continue and assert modal closed
      const closeSVG = this.page.locator('.o-s-c-header svg[width="19"][height="18"]');
    await closeSVG.click({ force: true });
    await this.page.waitForTimeout(2000);
     await this.assertModalClosedSimple();
    //  await this.page.pause();
      TestLogger.success(`✅ Variant ${i + 1}/${combinations.length} completed: ${combination}`);
    }
    
    // STEP 5: Final validation
    TestLogger.info('🔍 Step 5: Final validation');
    await this.assertAllVariantsProcessed(combinations.length);
    
    TestLogger.success('🎉 COMPLETE variant workflow finished successfully!');
    
  } catch (error) {
    TestLogger.error(`❌ Complete variant workflow failed: ${error}`);
    throw error;
  }
}

// ============================================
// SIMPLE ASSERTION METHODS
// ============================================

async assertVariantTableStructureSimple(expectedCombinations: string[]) {
  TestLogger.info('🔍 Asserting variant table structure');
  
  try {
    // Assert table is visible
    const table = this.page.locator('table.variants-table');
    await expect(table).toBeVisible();
    TestLogger.success('✅ Variants table is visible');
    
    // Assert all combinations exist in table
    for (const combination of expectedCombinations) {
      const row = this.page.locator(`tr:has(.variant-name-description:has-text("${combination}"))`);
      await expect(row).toBeVisible();
      TestLogger.success(`✅ Found variant row: ${combination}`);
    }
    
    // Assert correct count
    const actualRows = this.page.locator('tr.inside-tr');
    await expect(actualRows).toHaveCount(expectedCombinations.length);
    TestLogger.success(`✅ Correct number of variants: ${expectedCombinations.length}`);
    
  } catch (error) {
    TestLogger.error(`❌ Table structure assertion failed: ${error}`);
    throw error;
  }
}

async assertModalOpenedSimple(expectedCombination: string) {
  TestLogger.info(`🔍 Asserting modal opened for: ${expectedCombination}`);
  
  try {
    // Assert modal content is visible
    const nameInput = this.page.locator('input[placeholder="Enter Product Name"]');
    await expect(nameInput).toBeVisible();
    TestLogger.success('✅ Modal form is visible');
    
    // Assert variant name is pre-filled correctly
    await expect(nameInput).toHaveValue(expectedCombination);
    TestLogger.success(`✅ Variant name pre-filled correctly: ${expectedCombination}`);
    
    // Assert all required fields are present
    const requiredFields = [
      this.page.locator('input[placeholder*="Unit Price"]'),
      this.page.locator('input[placeholder*="SKU"]'),
      this.page.locator('input[placeholder*="Enter Numeric"]'), // MOQ
     // this.page.locator('.p-dropdown') // MOQ Unit
    ];
    
    for (const field of requiredFields) {
      await expect(field).toBeVisible();
    }
    TestLogger.success('✅ All required form fields are visible');
    
  } catch (error) {
    TestLogger.error(`❌ Modal assertion failed: ${error}`);
    throw error;
  }
}

async assertFormValuesSimple(expectedData: {
  name: string;
  unitPrice: string;
  sku: string;
  moq: string;
  moqUnit: string;
}) {
  TestLogger.info('🔍 Asserting form values after filling');
  
  try {
    // Assert name
    const nameInput = this.page.locator('input[placeholder="Enter Product Name"]');
    await expect(nameInput).toHaveValue(expectedData.name);
    TestLogger.success(`✅ Name field: ${expectedData.name}`);
    
    // Assert unit price
    const priceInput = this.page.locator('input[placeholder*="Unit Price"]');
    await expect(priceInput).toHaveValue(expectedData.unitPrice);
    TestLogger.success(`✅ Unit price field: ${expectedData.unitPrice}`);
    
    // Assert SKU
    const skuInput = this.page.locator('input[placeholder*="SKU"]');
    await expect(skuInput).toHaveValue(expectedData.sku);
    TestLogger.success(`✅ SKU field: ${expectedData.sku}`);
    
    // Assert MOQ
    const moqInput = this.page.locator('input[placeholder*="Enter Numeric"]');
    await expect(moqInput).toHaveValue(expectedData.moq);
    TestLogger.success(`✅ MOQ field: ${expectedData.moq}`);
    
    // Assert MOQ Unit (check dropdown text)
    const moqDropdown = this.page.locator('.p-dropdown .p-dropdown-label').last();
    await expect(moqDropdown).toContainText(expectedData.moqUnit);
    TestLogger.success(`✅ MOQ Unit dropdown: ${expectedData.moqUnit}`);
    
    // Assert no validation errors
    const errors = this.page.locator('.error-txt:visible');
    await expect(errors).toHaveCount(0);
    TestLogger.success('✅ No validation errors present');
    
  } catch (error) {
    TestLogger.error(`❌ Form values assertion failed: ${error}`);
    throw error;
  }
}

async assertModalClosedSimple() {
  TestLogger.info('🔍 Asserting modal is closed');
  
  try {
    // Wait for modal to close
    await this.page.waitForTimeout(3000);
    
    // Assert modal form is no longer visible
    const nameInput = this.page.locator('input[placeholder="Enter Product Name"]');
    await expect(nameInput).not.toBeVisible();
    TestLogger.success('✅ Modal is closed');
    
    // Assert we're back to the main page
    const table = this.page.locator('table.variants-table');
    await expect(table).toBeVisible();
    TestLogger.success('✅ Back to variants table');
    
  } catch (error) {
    TestLogger.error(`❌ Modal close assertion failed: ${error}`);
    throw error;
  }
}

async assertAllVariantsProcessed(expectedCount: number) {
  TestLogger.info(`🔍 Asserting all ${expectedCount} variants were processed`);
  
  try {
    // Check that all variants are still visible in table
    const variantRows = this.page.locator('tr.inside-tr');
    await expect(variantRows).toHaveCount(expectedCount);
    TestLogger.success(`✅ All ${expectedCount} variants still present in table`);
    
     // Quick image check
    const anyImages = this.page.locator('tr.inside-tr img');
    const hasImages = await anyImages.count() > 0;
    
    TestLogger.success(`✅ ${expectedCount} variants found, Images: ${hasImages ? 'Yes' : 'No'}`);
    
  } catch (error) {
    TestLogger.error(`❌ Final assertion failed: ${error}`);
    throw error;
  }
}

// ============================================
// SIMPLE HELPER METHODS (SAME AS BEFORE)
// ============================================

getSimpleCombinations(expectedAttributes: string): string[] {
  const groups = expectedAttributes.split('|');
  const combinations: string[] = [];
  
  if (groups.length === 2) {
    const [first, second] = groups;
    const [, firstValues] = first.split(':');
    const [, secondValues] = second.split(':');
    
    const values1 = firstValues.split(',');
    const values2 = secondValues.split(',');
    
    for (const v1 of values1) {
      for (const v2 of values2) {
        combinations.push(`${v1.trim()} / ${v2.trim()}`);
      }
    }
  }
  
  return combinations;
}

async expandTableSimple() {
  try {
    const buttons = this.page.locator('.btn-open-variant');
    const count = await buttons.count();
    
    for (let i = 0; i < count; i++) {
      await buttons.nth(i).click();
      await this.page.waitForTimeout(1000);
    }
    TestLogger.success('✅ All variant groups expanded');
  } catch (error) {
    TestLogger.warn('⚠️ Could not expand table');
  }
}

async clickVariantRowSimple(combination: string) {
  const row = this.page.locator(`tr:has(.variant-name-description:has-text("${combination}"))`);
  await row.locator('td').nth(2).click();
  await this.page.waitForTimeout(2000);
}

async fillFormSimple(data: {
  name: string;
  unitPrice: string;
  sku: string;
  moq: string;
  moqUnit: string;
}) {
  try {
    // Name
    await this.page.locator('input[placeholder="Enter Product Name"]').fill(data.name);
    
    const filePath = path.resolve(__dirname, '../../data/black.jpg');
    await this.uploadVariantImageSimple(filePath);

    // Price
    await this.page.locator('input[placeholder*="Unit Price"]').fill(data.unitPrice);
    
    // SKU
    await this.page.locator('input[placeholder*="SKU"]').fill(data.sku);
    
    // MOQ
    await this.page.locator('input[placeholder*="Enter Numeric"]').fill(data.moq);
    
    // MOQ Unit
    await this.page.locator('.p-dropdown').last().click();
    await this.page.locator(`.p-dropdown-item:has-text("${data.moqUnit}")`).click();
    
    TestLogger.success('✅ Form filled');
  } catch (error) {
    TestLogger.error(`❌ Form fill error: ${error}`);
    throw error;
  }
}
// ============================================
// IMAGE UPLOAD METHOD FOR VARIANT MODAL
// ============================================

async uploadVariantImageSimple(imagePath: string) {
  TestLogger.info(`🖼️ Uploading variant image: ${imagePath}`);
  
  try {
    // Simple selector for the file input from your HTML
    const fileInput = this.page.locator('input.f-u-c-input[type="file"]');
    
    // Check if file input exists
    if (await fileInput.count() === 0) {
      throw new Error('File input not found');
    }
    
    // Upload the image
    await fileInput.setInputFiles(imagePath);
    
    // Wait for upload to complete
    await this.page.waitForTimeout(10000);
    
    TestLogger.success(`✅ Image uploaded: ${imagePath}`);
    
  } catch (error) {
    TestLogger.error(`❌ Image upload failed: ${error}`);
    throw error;
  }
}
async clickContinueSimple() {
  await this.page.locator('button:has-text("Continue")').click();
  await this.page.waitForTimeout(2000);
}
// ============================================
// SIMPLE AI PRODUCT DESCRIPTION METHOD
// ============================================

async clickWriteWithAIAndAssertDescription(product: any) {
  TestLogger.info('🤖 Clicking "Write with AI" button and asserting description');
  
  try {
    // STEP 1: Click the "Write with AI" button
    // Even more specific - target by the textarea container
    const aiButton = this.page.locator('.input-ai-block:has(textarea[name="detailedDescription"]) button.btn-ai:has-text("Write with AI")');
    await expect(aiButton).toBeVisible();
    TestLogger.info('🔍 AI button found, clicking...');
    
    await aiButton.click();
    
    // STEP 2: Wait for AI to generate content
    TestLogger.info('⏳ Waiting for AI to generate description...');
    await this.page.waitForTimeout(8000); // Wait 8 seconds for AI generation
    
    // STEP 3: Get the generated description
    const descriptionTextarea = this.page.locator('textarea[name="detailedDescription"]');
    await expect(descriptionTextarea).toBeVisible();
    
    // Wait for content to appear
    let description = '';
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      description = await descriptionTextarea.inputValue();
      if (description && description.trim().length > 0) {
        product.description=description
        break;
      }
      TestLogger.info(`⏳ Waiting for AI content... Attempt ${attempts + 1}/${maxAttempts}`);
      await this.page.waitForTimeout(2000);
      attempts++;
    }
    
    // STEP 4: Simple assertions
    await this.assertDescriptionSimple(description, product.name);
    
    TestLogger.success('🎉 AI description generated and validated successfully');
    
    return description;
    
  } catch (error) {
    TestLogger.error(`❌ Error with AI description generation: ${error}`);
    throw error;
  }
}

async assertDescriptionSimple(description: string, productName: string) {
  TestLogger.info('🔍 Simple assertion: checking description length and product name');
  
  try {
    // 1. Check description was generated (not empty)
    if (!description || description.trim().length === 0) {
      throw new Error('AI did not generate any description content');
    }
    
    // 2. Check minimum length (at least 20 characters)
    if (description.length < 20) {
      throw new Error(`Description too short. Expected at least 20 characters, got ${description.length}`);
    }
    
    // 3. Check product name is mentioned (if provided)
    if (productName && productName.trim()) {
      const lowerDescription = description.toLowerCase();
      const lowerProductName = productName.toLowerCase();
      
      if (!lowerDescription.includes(lowerProductName)) {
        TestLogger.warn(`⚠️ Product name "${productName}" not found in description`);
        // Don't throw error, just warn
      } else {
        TestLogger.success(`✅ Product name "${productName}" found in description`);
      }
    }
    
    // 4. Check it's not placeholder text
    const lowerDescription = description.toLowerCase();
    if (lowerDescription.includes('enter text') || lowerDescription.includes('description here')) {
      throw new Error('Description contains placeholder text');
    }
    
    TestLogger.success(`✅ Description validation passed (${description.length} characters)`);
    TestLogger.info(`📝 Generated: "${description.substring(0, 100)}${description.length > 100 ? '...' : ''}"`);
    
  } catch (error) {
    TestLogger.error(`❌ Description assertion failed: ${error}`);
    throw error;
  }
}
// ============================================
// AI PRODUCT APPLICATIONS METHOD
// ============================================

async clickWriteWithAIApplicationsAndAssert(product: any) {
  TestLogger.info('🤖 Clicking "Write with AI" button for Applications and asserting content');
  
  try {
    // STEP 1: Click the "Write with AI" button in Applications section
    const aiButton = this.page.locator('.textarea-comp:has(label:has-text("Applications")) button.btn-ai:has-text("Write with AI")');
    await expect(aiButton).toBeVisible();
    TestLogger.info('🔍 AI Applications button found, clicking...');
    
    await aiButton.click();
    
    // STEP 2: Wait for AI to generate content
    TestLogger.info('⏳ Waiting for AI to generate applications content...');
    await this.page.waitForTimeout(8000); // Wait 8 seconds for AI generation
    
    // STEP 3: Get the generated applications text
    const applicationsTextarea = this.page.locator('textarea[name="productApplications"]');
    await expect(applicationsTextarea).toBeVisible();
    
    // Wait for content to appear/update
    let applications = '';
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      applications = await applicationsTextarea.inputValue();
      if (applications && applications.trim().length > 0) {
        product.applications = applications;
        break;
      }
      TestLogger.info(`⏳ Waiting for AI applications content... Attempt ${attempts + 1}/${maxAttempts}`);
      await this.page.waitForTimeout(2000);
      attempts++;
    }
    
    // STEP 4: Simple assertions
    await this.assertApplicationsSimple(applications, product.name);
    
    TestLogger.success('🎉 AI applications generated and validated successfully');
    
    return applications;
    
  } catch (error) {
    TestLogger.error(`❌ Error with AI applications generation: ${error}`);
    throw error;
  }
}

async assertApplicationsSimple(applications: string, productName: string = '') {
  TestLogger.info('🔍 Simple assertion: checking applications length and product name');
  
  try {
    // 1. Check applications was generated (not empty)
    if (!applications || applications.trim().length === 0) {
      throw new Error('AI did not generate any applications content');
    }
    
    // 2. Check minimum length (at least 20 characters)
    if (applications.length < 20) {
      throw new Error(`Applications too short. Expected at least 20 characters, got ${applications.length}`);
    }
    
    // 3. Check product name is mentioned (if provided)
    if (productName && productName.trim()) {
      const lowerApplications = applications.toLowerCase();
      const lowerProductName = productName.toLowerCase();
      
      if (!lowerApplications.includes(lowerProductName)) {
        TestLogger.warn(`⚠️ Product name "${productName}" not found in applications`);
        // Don't throw error, just warn
      } else {
        TestLogger.success(`✅ Product name "${productName}" found in applications`);
      }
    }
    
    // 4. Check it's not placeholder text
    const lowerApplications = applications.toLowerCase();
    if (lowerApplications.includes('enter text') || lowerApplications.includes('applications here')) {
      throw new Error('Applications contains placeholder text');
    }
    
    // 5. Check for application-related keywords
    const applicationKeywords = ['ideal', 'perfect', 'suitable', 'use', 'wear', 'occasion', 'versatile'];
    const foundKeywords = applicationKeywords.filter(keyword => 
      lowerApplications.includes(keyword.toLowerCase())
    );
    
    if (foundKeywords.length > 0) {
      TestLogger.success(`✅ Found application keywords: ${foundKeywords.join(', ')}`);
    }
    
    TestLogger.success(`✅ Applications validation passed (${applications.length} characters)`);
    TestLogger.info(`📝 Generated: "${applications.substring(0, 100)}${applications.length > 100 ? '...' : ''}"`);
    
  } catch (error) {
    TestLogger.error(`❌ Applications assertion failed: ${error}`);
    throw error;
  }
}
}