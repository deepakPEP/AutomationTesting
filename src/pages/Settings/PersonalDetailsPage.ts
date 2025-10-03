import { Page,Locator } from '@playwright/test';

export class PersonalDetailsPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = this.page.locator('input[name="firstName"]');
    this.lastNameInput = this.page.locator('input[name="lastName"]');
  }

  /**
   * Fill Personal Details form
   */
  async fillPersonalDetailsForm(details: {
    firstName: string,
    middleName?: string,
    lastName: string,
    workEmail: string,
    mobileNumber: string,
    sameAsMobile?: boolean,
    whatsappNumber?: string,
    jobTitle: string,
    dateOfBirth: string,
    addressLine: string,
    country: string,
    state: string,
    city: string,
    pinCode: string,
    nationalIdType: string,
    nationalIdNo: string
  }) {
    await this.firstNameInput.fill(details.firstName);
    if (details.middleName !== undefined) {
      await this.page.locator('input[name="middleName"]').fill(details.middleName);
    }
    await this.lastNameInput.fill(details.lastName);
    await this.page.locator('input[name="workEmail"]').fill(details.workEmail);

    // Mobile Number
    await this.page.locator('input[type="tel"]:not([disabled])').first().fill(details.mobileNumber);

    // Checkbox: Same as Mobile Number
    if (details.sameAsMobile) {
      const checkbox = this.page.locator('input#accept');
      if (!(await checkbox.isChecked())) {
        await checkbox.check();
      }
    }

    // WhatsApp Number (if enabled)
    if (details.whatsappNumber) {
      const whatsappInput = this.page.locator('input[type="tel"][disabled]');
      if (await whatsappInput.isEnabled()) {
        await whatsappInput.fill(details.whatsappNumber);
      }
    }

    await this.page.locator('input[name="jobTitle"]').fill(details.jobTitle);

    // Date of Birth
    await this.page.locator('input[placeholder="DD/MM/YYYY"]').fill(details.dateOfBirth);

    // Address
    await this.page.locator('input[name="personalAddress.addressLine"]').fill(details.addressLine);

    // Country
    await this.page.locator('.forms-group .p-dropdown-trigger[aria-label="Select"]').first().click();
    await this.page.locator(`.p-dropdown-item:has-text("${details.country}")`).click();

    // State
    await this.page.locator('.forms-group .p-dropdown-trigger[aria-label="Select"]').nth(1).click();
    await this.page.locator(`.p-dropdown-item:has-text("${details.state}")`).click();

    // City
    await this.page.locator('.forms-group .p-dropdown-trigger[aria-label="Select"]').nth(2).click();
    await this.page.locator(`.p-dropdown-item:has-text("${details.city}")`).click();

    // Zip code
    await this.page.locator('input[name="personalAddress.pinCode"]').fill(details.pinCode);

    // National Id Type
    await this.page.locator('input[name="nationalIdType"]').fill(details.nationalIdType);

    // National Id Number
    await this.page.locator('input[name="nationalIdNo"]').fill(details.nationalIdNo);

    // Click Save
    await this.page.locator('button[type="submit"]:has-text("Save")').click();
  }
  async getFirstNameValue() {
    return this.firstNameInput.inputValue();
  } 
  async getLastNameValue() {
    return this.lastNameInput.inputValue();
  }

}