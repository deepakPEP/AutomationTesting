import { Locator, Page } from "playwright-core";
import { expect } from "@playwright/test";

export class PricingMOQPage {
  readonly page: Page;
  readonly legalBusinessName: Locator;
  readonly businessName: Locator;
  readonly ownerName: Locator;
  readonly establishmentYear: Locator;
  readonly addressLine: Locator;
  readonly pinCode: Locator;
  readonly email: Locator;
  readonly phone: Locator;
  readonly shipSameAsBusiness: Locator;
  readonly mainProductsInput: Locator;
  readonly saveBtn: Locator;
  readonly cancelBtn: Locator;
    readonly countryTrigger: Locator;
    readonly stateTrigger: Locator; 
    readonly cityTrigger: Locator;
    readonly industryTrigger: Locator;
    readonly employeeSelect: Locator
    readonly businessTypeTrigger: Locator;
    readonly overlayOption: (text: string) => string;
    readonly legalBusinessStatus: Locator;
    readonly businessAddressLineInput: Locator;
    
  // --- Dropdowns / Multi-select (PrimeReact) ---
  // Country
    constructor(page: Page) {
    this.page = page;

    //this.select_currency = page.locator('span').filter({ hasText: 'Select Currency' });
    
    this.legalBusinessName = page.locator('input[name="legalBusinessName"]');
    this.businessName = page.locator('input[name="businessName"]');
    this.ownerName = page.locator('input[name="ownerName"]');
    this.establishmentYear = page.locator('input[name="establishment"]');
    this.addressLine = page.locator('input[name="businessAddress.addressLine"]');
    this.pinCode = page.locator('input[name="businessAddress.pinCode"]');
  this.email = page.locator('input[name="email"]');

  // Phone (react-tel-input)
  this.phone = page.locator('.react-tel-input input[type="tel"]');

  // Shipping same-as-business checkbox
  this.shipSameAsBusiness = page.locator('#shipAddress');

  // PrimeReact Chips (Main Products)
  this.mainProductsInput = page.locator('//label[normalize-space(.)="Main Products"]/following::div[contains(@class,"p-chips")][1]//input[@data-pc-section="input"]');
  
  this.countryTrigger = page.locator(
    '.forms-group:has(label.f-g-label:has-text("Country")) .p-dropdown[data-pc-name="dropdown"] [data-pc-section="trigger"]'
  );
  // State
  this.stateTrigger = page.locator(
    '.forms-group:has(label.f-g-label:has-text("State")) .p-dropdown[data-pc-name="dropdown"] [data-pc-section="trigger"]'
  );
  // City
  this.cityTrigger = page.locator(
    '.forms-group:has(label.f-g-label:has-text("City")) .p-dropdown[data-pc-name="dropdown"] [data-pc-section="trigger"]'
  );
  // Industry
  this.industryTrigger = page.locator(
    '.forms-group:has(label.f-g-label:has-text("Industry")) .p-dropdown[data-pc-name="dropdown"] [data-pc-section="trigger"]'
  );
  // No. of Employees (has a hidden <select>, which is easiest to set)
  this.employeeSelect = page.locator('select[name="employeeCount"]');
  // Business Type (PrimeReact MultiSelect)
  this.businessTypeTrigger = page.locator(
    '.forms-group:has(label.f-g-label:has-text("Business Type")) .p-multiselect [data-pc-section="trigger"]'
  );
  this.legalBusinessStatus = page.locator('input[name="businessType"][value="${option}"]');

  // Overlay menu items (generic; PrimeReact puts the panel at body end)
  // Use this to click an option by visible text after opening a dropdown/multiselect.
  this.overlayOption = (text: string) => `//div[contains(@class,"p-overlay") or contains(@class,"p-dropdown-panel") or contains(@class,"p-multiselect-panel")]//li[.//text()[normalize-space()="${text}"] or @aria-label="${text}"]`;

  this.mainProductsInput =
  page.locator('.forms-group:has(> label.f-g-label:has-text("Main Products")) .p-chips input[data-pc-section="input"]');
  this.businessAddressLineInput = page.locator('input[name="businessAddress.addressLine"]');
  // Buttons
  this.saveBtn = page.locator('button:has-text("Save")');
  this.cancelBtn = page.locator('button:has-text("Cancel")');
}

    async addMainProducts(products: string[]) {
        for (const item of ['Shirts', 'Trousers']) {
            await this.mainProductsInput.click();
            await this.mainProductsInput.fill(item);
            await this.page.keyboard.press('Enter');
        }
    }
    async fillBusinessNames(businessName : string,legalBusinessName : string,legalOwnerName : string) {
        await this.businessName.fill(businessName);
        await this.legalBusinessName.fill(legalBusinessName);
        await this.ownerName.fill(legalOwnerName);
    }
    async checkBusinessNames(businessName : string,legalBusinessName : string,legalOwnerName : string) {
        await expect(this.businessName).toHaveValue(businessName);
        await expect(this.legalBusinessName).toHaveValue(legalBusinessName);
        await expect(this.ownerName).toHaveValue(legalOwnerName);
    }
    async checkLegalBusinessStatus(option: string) {
        const locator = this.page.locator(`input[name="businessType"][value="${option}"]`);
        await expect(locator).toBeChecked();
    }
    async selectBusinessType(option: string) {
        const optionLocator = this.page.locator(
      `//li[contains(@class,"p-multiselect-item")]//span[normalize-space()="${option}"]//parent::li//input`
    );
    await optionLocator.click();
    const closeBtn = this.page.locator('button[aria-label="Close"]');
    await closeBtn.click();
    }
    async selectIndustry(option: string) {
        this.industryTrigger.click();
        const optionLocator = this.page.locator(
      `//li[contains(@class,"p-dropdown-item")]//span[normalize-space()='${option}']`
    );
    await optionLocator.click();
    const closeBtn = this.page.locator('button[aria-label="Close"]');
    await closeBtn.click();
    }
    async fillBusinessDetails(args:any) {}
    async companyRegistrationDetails(args:any) {
        const buttonSelectDocType = this.page.locator('div[role="button"][aria-label="Select Document type"]');
        const dropdownOption = (value: string) =>
        this.page.locator(`//li[@role="option" and @aria-label="${value}"]`);
        await buttonSelectDocType.click();
        await dropdownOption(args.documentType).click();
    }
    async fillContactInformation(args:any) {
        await this.countryTrigger.click();
        const countryOption = (country: string) =>
  this.page.locator(`//li[@role="option" and @aria-label="${country}"]`);
        await countryOption(args.country).click();
        await this.businessAddressLineInput.fill(args.addressLine);
        await this.stateTrigger.click();
        await countryOption(args.state).click();
        await this.cityTrigger.click();
        await countryOption(args.city).click();
        await this.pinCode.fill(args.pinCode);
        await this.email.fill(args.email);
        await this.phone.fill(args.phone);
    }
    async fillAdditionalInformation(args:any) {}

}
