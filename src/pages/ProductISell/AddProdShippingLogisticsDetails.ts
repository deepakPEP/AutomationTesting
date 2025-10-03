import { Locator, Page } from 'playwright-core';
import { test, expect} from '@playwright/test';
import { SampleAvailability } from '../../utils/enums/SampleAvailability';

export class AddProdShippingLogisticsDetails {
    readonly page: Page;
    readonly incotermsDropdown: Locator;
    readonly portOfDispatch: Locator;
    readonly dispatchLeadTime: Locator;
    readonly unitsPerPackage: Locator;
    readonly packagingTypeDropdown: Locator;
    readonly shipmentIdentifier: Locator; // like barcode/hsn
  constructor(page: Page) {
    this.page = page;
    // Initialize Locators
    this.incotermsDropdown = this.page.getByRole('button', { name: 'Select Incoterms' });
    this.portOfDispatch = this.page.locator('input[name="portOfDispatch"]');

    this.dispatchLeadTime = this.page.locator('div[aria-label="Select Lead Time"]');
    this.packagingTypeDropdown = this.page.locator('div[aria-label="Select Packaging Type"]');
    this.unitsPerPackage = this.page.locator('input[placeholder="Enter Numeric"]');
    this.shipmentIdentifier = this.page.locator('input[name="shipmentIdentifier"]');
  }
  // Function to select the shipping mode
async is_Ships_Internationally(ships_internationally: string) {
  await this.page.locator('label').filter({ hasText: ships_internationally }).click();
}

// Function to select a value from the dropdown based on input text
async selectIncoterms(inputValue : string) {
  // Open the dropdown by clicking the trigger
  await this.incotermsDropdown.click();
  await expect(this.page.locator('.p-dropdown-trigger').first()).toBeVisible();

  // Wait for the dropdown options to be visible
  const dropdownOption = this.page.locator(`.p-dropdown-items li:has-text("${inputValue}")`);

  // Click the option that matches the input value
  await dropdownOption.click();
}

async fillShippingAndLogisticsDetails(ships_internationally: string, incoterms: string, portOfDispatch: string, 
    dispatchLeadTime: string, unitsPerPackage: number, shipmentIdentifier: string, packagingType: string, shipping_mode: string) {
  // Select shipping mode
  await this.is_Ships_Internationally(ships_internationally);
  await this.selectShippingMode(shipping_mode);
  // Select incoterms
  await this.selectIncoterms(incoterms);

  // Fill port of dispatch
  await this.portOfDispatch.fill(portOfDispatch);

  // Fill dispatch lead time
  await this.dispatchLeadTime.click();
  expect(await this.page.locator('.p-dropdown-trigger').first()).toBeVisible();

  // Locate the option based on the leadTime argument
  let optionLocator = this.page.locator(`.p-dropdown-items li:has(span.p-dropdown-item-label:has-text("${dispatchLeadTime}"))`);

  // Click the option
  await optionLocator.click();
  // Fill units per package
  await this.packagingTypeDropdown.click();
  expect(await this.page.locator('.p-dropdown-trigger').first()).toBeVisible();

  // Locate the option based on the packagingType argument
  optionLocator = this.page.locator(`.p-dropdown-items li:has(span.p-dropdown-item-label:has-text("${packagingType}"))`);

  // Click the option
  await optionLocator.click();
    await this.unitsPerPackage.fill(unitsPerPackage.toString());
  // Fill shipment identifier
  await this.shipmentIdentifier.fill(shipmentIdentifier);
}
  async selectShippingMode(modes: string) {
    // Normalize (in case you pass "sea", "Sea" etc.)
     const modeList = modes.split(',').map(m => m.trim());

  for (const mode of modeList) {
    await console.log(`Selecting shipping mode: ${mode}`);
    const checkbox = this.page.locator(`input[id="${mode}"]`);
  
    await checkbox.click({force: true});
    await expect(checkbox).toBeChecked();
    await this.page.waitForTimeout(2000);
  }
  }
}