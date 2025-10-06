import { Locator, Page } from 'playwright-core';
import { SampleAvailability } from '../../utils/enums/SampleAvailability';
import { expect } from '@playwright/test';
export class AddProdTradeDetails {
  readonly page: Page;
  
  // Define Locators
  readonly selectLeadTimeDropDown: Locator;
  readonly numericTextbox: Locator;
  readonly selectDropdown: Locator;
  readonly inStockOption: Locator;
  readonly dropdownList: Locator;
  readonly unitDropdown: Locator;
  readonly unitDropdownItems: Locator;
  readonly durationDropDown : Locator;
  readonly outOfStockOption: Locator;
  readonly samplePrice : Locator;
  readonly selectSampleLeadTime : Locator;
  readonly optionSampleLeadTime: (option: string) => Locator;
  readonly selectPaymentTerm: Locator;
  readonly prodQuantityInput: Locator;
  readonly sellOfferSelectPayterm: Locator;

  constructor(page: Page) {
    this.page = page;
    // Initialize Locators
    this.selectLeadTimeDropDown = page.locator("//div[@role='button' and @aria-label='Select Lead Time']");
    //this.selectLeadTimeDropDown = page.locator("//div[@class='p-hidden-accessible p-dropdown-hidden-select']//select");
    this.numericTextbox = page.getByRole('textbox', { name: 'Enter Numeric' });
    this.selectDropdown = page.locator("//div[@role='button' and @aria-label='Select']")
    this.inStockOption = page.locator('li[role="option"][aria-label="In Stock"]');
    this.outOfStockOption = page.locator('li[role="option"][aria-label="Out of Stock"]');
    this.dropdownList = page.locator('.p-dropdown-items')
    this.unitDropdown = page.locator('[aria-label="Unit"]');
    this.unitDropdownItems = page.locator('.p-dropdown-items').first();
    this.durationDropDown = page.locator('//div[@class="p-dropdown-trigger" and @aria-label="Duration"]');
    this.samplePrice = page.locator('//input[@placeholder="Enter Price"]');
    this.selectSampleLeadTime = page.locator('//select[.//option[text()="Select Sample Lead Time"]]');
    this.optionSampleLeadTime = (option: string) => page.locator(`//ul[@class='p-dropdown-items']//li[.//span[text()="${option}"]]//span[@class='p-dropdown-item-label']`);
    this.selectPaymentTerm = page.locator('div[role="button"][aria-label="Select Payment Term"][aria-expanded="false"]');
    this.prodQuantityInput = page.locator('input[name="productionCapacity.quantity"]');
    this.sellOfferSelectPayterm = page.locator('div.p-multiselect-trigger');
  }

  // Methods for Actions

  async selectLeadTime(leadTime: string) {
    
    await this.selectLeadTimeDropDown.waitFor({ state: 'attached' });
    await this.selectLeadTimeDropDown.click({});
    // await this.page.waitForSelector('.p-dropdown-items', { timeout: 5000 });
    
    // //const xpath = `//li[span/span[text()='${leadTime}']]`;
    // const xpath = `//li[contains(@class,'p-dropdown-item')]//span[@class='p-dropdown-item-label']//span`;

    // // Log the XPath being used
    // console.log(`Using XPath: ${xpath}`);
    // await this.page.pause();
    // // Log the content of matched elements
    // const optionTexts = await this.page.locator(xpath).allTextContents();
    // console.log('Option texts:', optionTexts);

    // // Log the first element's content
    // const firstOption = await this.page.locator(xpath).first();
    // const firstOptionText = await firstOption.textContent();
    // console.log('First option text:', firstOptionText);
    // await firstOption.click();
    // console.log(`${leadTime} option selected.`);

    const elements = await this.page.locator("//li[contains(@class, 'p-dropdown-item')]//span[@class='p-dropdown-item-label']/span");

// Get the count of matching elements
const count = await elements.count();

// Loop through each element and print its content
for (let i = 0; i < count; i++) {
  const textContent = await elements.nth(i).textContent(); // Get text of each element
  console.log(`Element ${i + 1}: ${textContent}`); 
  if (textContent?.includes(leadTime)) {
    await elements.nth(i).click();
    break;
  }
}
  }
  async selectProductionCapacityUnit(prod_capacity_value:number,unit: string,duration :string) {
    await this.prodQuantityInput.click();
    await this.prodQuantityInput.fill(prod_capacity_value.toString());

    // Click to open the dropdown
    await this.unitDropdown.click();

    // Wait for the dropdown items to appear
    //await this.unitDropdownItems.waitFor();
    await this.page.waitForTimeout(2000);

    // Select the item based on the unit provided as argument
    let item = this.unitDropdownItems.locator(`li:has(span:has-text("${unit}"))`);

    // Wait for the item to be visible and click it
    await item.click();

    await this.durationDropDown.click();
    item = this.unitDropdownItems.locator(`li:has(span:has-text("${duration}"))`);

    // Wait for the item to be visible and click it
    await item.click();
  }
  

  async checkSampleAvailability(sampleAvailability: SampleAvailability, samplePriceValue: number | null) {
    console.log('Checking sample availability:', sampleAvailability);
    if (sampleAvailability != SampleAvailability.None) {
      await this.page.getByRole('radio', { name: sampleAvailability }).check();
    }
    if (sampleAvailability === SampleAvailability.Paid || sampleAvailability === SampleAvailability.Refundable) {
      await this.samplePrice.fill(samplePriceValue?.toString() || '');
      await this.unitDropdown.click();
      const unitOption = this.unitDropdownItems.locator(`li:has(span:has-text("Pieces"))`);
      await unitOption.click();
    }
  }

  async selectAvailableStock(value : boolean) {
    await this.selectDropdown.click();
    if (value) {
      await this.inStockOption.click();
    } else {
      
        await this.outOfStockOption.click();
    }
  }

  async setPaymentTerms(paymentTerm: string) {
    if (await this.selectPaymentTerm.count() > 0) {
      await this.selectPaymentTerm.click();
      const dropdownItems = this.page.locator('.p-dropdown-items');
    
    // Find the item by aria-label that matches the paymentTerm argument
    const option = dropdownItems.locator(`li[aria-label="${paymentTerm}"]`);
     await option.click();
    } else {
      await this.sellOfferSelectPayterm.click();
      const dropdownItems = this.page.locator('.p-dropdown-items');
    
    // Find the item by aria-label that matches the paymentTerm argument
    const item = this.page.locator('.p-multiselect-item', { hasText: paymentTerm });
    const checkbox = item.locator('input[type="checkbox"]');
    if (!(await checkbox.isChecked())) {
      await item.click();
    }
    }
  }async selectPaymentOptions(paymentOptions: string) {
    const labelToId: Record<string, string> = {
  "Credit Card": "credit",
  "Cash": "cash",
  "Cheque": "cheque",
  "Demand Draft": "dd",          // or "demand draft" if you prefer
  "Paypal": "paypal",
  "MoneyGram": "moneygram",
  "Western Union": "western union",
  "Others": "others"
};
  const paymentOptionStrings = paymentOptions.split(',');
  await console.log('Payment options:', paymentOptionStrings);
  for (const key in paymentOptionStrings) {
    const labelText = labelToId[paymentOptionStrings[key]] ?? paymentOptionStrings[key];
    await console.log('Payment options text:', labelText);
    const optionLocator = this.page.locator(`input#${labelText}`);
    await optionLocator.check({force:true}); // Check the checkbox
    await console.log(`Selected payment option: ${labelText}`);
    if (labelText === 'Others') 
      {
        const inputLocator = await this.page.locator('input[name="otherPaymentMethod"]');
        await inputLocator.fill('Cash');
      }
  }}
// Pass names like: ["Credit Card", "Cash", "Western Union"]
 async  selectPaymentMethods(methods: string[]) {
  // Normalize common aliases -> label text exactly as in DOM
  
  for (const m of methods) {
  //   const key = m.trim().toLowerCase();
  //   const labelText = aliasToLabel[key] ?? m.trim(); // fall back to given text
  //   // Use the accessible name from the associated <label for="...">
  //   const cb = this.page.getByLabel(labelText, { exact: true });
    console.log('Selecting payment method:', m);
    const card = this.page.locator('label.payment-option-card-comp', { hasText: m });
    const input = card.locator('input[type="checkbox"]');
    if (!(await input.isChecked())) {
      await card.click();
    }
  }
  //   await cb.waitFor({ state: "attached" });
  //   if (!(await cb.isChecked())) {
  //     await cb.check(); // more reliable than click for checkboxes
  //   }
  // }
  
}

}
