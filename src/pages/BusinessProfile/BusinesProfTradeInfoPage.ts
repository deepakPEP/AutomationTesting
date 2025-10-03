
// import { Locator, Page } from "playwright-core";
// import { expect } from "@playwright/test";
// import {AddProdShippingLogisticsDetails} from './AddProdShippingLogisticsDetails'
// import {AddProdTradeDetails} from './AddProdTradeDetails'

// // BusinessProfTradeInfoPage.js (Page Object)

// export class BusinessProfTradeInfoPage {
//   readonly page: Page;
//     readonly shippingPage: AddProdShippingLogisticsDetails;
//     readonly tradeDetailsPage: AddProdTradeDetails;
//      readonly iecNumberInput: Locator;
//   readonly iecDocumentInput: Locator;
//   readonly exportPercentInput: Locator;
//   readonly languagesSpokenInput: Locator;
//   readonly nearestPortInput: Locator;
//   readonly averageLeadTimeInput: Locator;
//   readonly minOrderValueInput: Locator;
//   readonly acceptedDeliveryTermsInput: Locator;
//   readonly languagesDropdown: Locator;
//   readonly languageOption: Locator;
  
//   readonly saveBtn: Locator;
//   readonly cancelBtn: Locator;
  
//   constructor(page: Page) {
//     this.page = page;
//     this.shippingPage = new AddProdShippingLogisticsDetails(page);
//     this.tradeDetailsPage = new AddProdTradeDetails(page);
//     this.iecNumberInput = page.locator('input[name="iecNumber"]');
//     this.iecDocumentInput = page.locator('input[type="file"][name="iecDocument"]');
//     this.exportPercentInput = page.locator('input[name="exportPercent"]');
//     this.languagesSpokenInput = page.locator('input[name="languagesSpoken"]');
//     this.nearestPortInput = page.locator('input[name="nearestPort"]');
//     this.averageLeadTimeInput = page.locator('input[name="averageLeadTime.value"]');
//     this.minOrderValueInput = page.locator('input[name="minOrderValue.value"]');
//     this.acceptedDeliveryTermsInput = page.locator('input[name="acceptedDeliveryTerms"]');
//     this.languagesSpokenInput = page.locator('input[role="combobox"]');

//     // Trigger to open the dropdown
//     this.languagesDropdown = page.locator('.p-multiselect-trigger');  // .p-multiselect-trigger triggers the dropdown

//     // You can adjust this to select specific languages from the dropdown
//     this.languageOption = page.locator('li.p-multiselect-item');

//     // Action buttons
//     this.saveBtn = page.locator('button[type="submit"]:has-text("Save")');
//     this.cancelBtn = page.locator('button[type="button"]:has-text("Cancel")');
//   }

//   // Methods for interacting with pricing options
//   async selectMainMarkets(value: string) {
//     const trigger = this.page.locator(
//       '.forms-group:has(label.f-g-label:has-text("Main Market")) .p-dropdown [data-pc-section="trigger"]'
//     );
//     await trigger.click();

//     // pick option
//     const option = this.page.locator(
//         `//li[@role="option"]//span[normalize-space()="${value}"]`
//     );
//     await option.click();

//     // optional: verify the selection showed in the label
//     await expect(
//         this.page.locator(
//         '.forms-group:has(label.f-g-label:has-text("Main Market")) .p-dropdown .p-inputtext, ' +
//         '.forms-group:has(label.f-g-label:has-text("Main Market")) .p-dropdown .p-dropdown-label'
//         )
//     ).toContainText(value);

//   }
//   async fillShippingAndPaymentTerms(shipping_mode:string,payment_method:string,payment_terms:string){
//     await this.shippingPage.selectShippingMode(shipping_mode);
//     await this.tradeDetailsPage.setPaymentTerms(payment_terms,payment_method);
//   }
//   async  selectAcceptedPaymentCurrency(page: Page, currency: string) {
//   // Find the dropdown trigger
//         const currencyDropdownTrigger = page.locator('.forms-select-2 .p-multiselect-trigger').nth(2);
        
//         // Open the dropdown
//         await currencyDropdownTrigger.click();
        
//         // Select the option based on the visible text (currency name)
//         const currencyOption = page.locator(
//             `//li[@role="option"]//span[normalize-space()="${currency}"]`
//         );
        
//         // Click on the currency option to select it
//         await currencyOption.click();
        
//         // Optionally, verify the selected currency in the dropdown label
//         const selectedCurrencyLabel = page.locator('.p-multiselect-label');
//         await selectedCurrencyLabel.waitFor(); // wait for the label to be visible
//         await expect(selectedCurrencyLabel).toContainText(currency);
//     }
//     async fillTradeAdditonalDetails(details: any) {
//         if(details.iec_number) {
//             await this.iecNumberInput.fill(details.iec_number);
//         }
//         if (details.iecDocumentFile) {
//       const fileInput = this.iecDocumentInput.locator('input[type="file"]');
//       await fileInput.setInputFiles(details.iecDocumentFile);

//     await this.exportPercentInput.fill(details.exportPercent);

//     }
//     async selectLanguages(languages: string[]) {
//     // Click on the dropdown to open it
//     await this.languagesDropdown.click();

//     for (const language of languages) {
//       // Click the option based on the language text
//       const option = this.page.locator(`li.p-multiselect-item:has-text("${language}")`);
//       await option.click(); // Select the language
//     }
//   }
// }
import { Locator, Page } from "playwright-core";
import { expect } from "@playwright/test";
import { AddProdShippingLogisticsDetails } from '../ProductISell/AddProdShippingLogisticsDetails'
import { AddProdTradeDetails } from '../ProductISell/AddProdTradeDetails'

// BusinessProfTradeInfoPage.js (Page Object)

export class BusinessProfTradeInfoPage {
  readonly page: Page;
  readonly shippingPage: AddProdShippingLogisticsDetails;
  readonly tradeDetailsPage: AddProdTradeDetails;
  readonly iecNumberInput: Locator;
  readonly iecDocumentInput: Locator;
  readonly exportPercentInput: Locator;
  readonly languagesSpokenInput: Locator;
  readonly nearestPortInput: Locator;
  readonly averageLeadTimeInput: Locator;
  readonly minOrderValueInput: Locator;
  readonly acceptedDeliveryTermsInput: Locator;
  readonly languagesDropdown: Locator;
  readonly languageOption: Locator;

  readonly saveBtn: Locator;
  readonly cancelBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.shippingPage = new AddProdShippingLogisticsDetails(page);
    this.tradeDetailsPage = new AddProdTradeDetails(page);
    this.iecNumberInput = page.locator('input[name="iecNumber"]');
    this.iecDocumentInput = page.locator('input[type="file"][name="iecDocument"]');
    this.exportPercentInput = page.locator('input[name="exportPercent"]');
    this.languagesSpokenInput = page.locator('input[name="languagesSpoken"]');
    this.nearestPortInput = page.locator('input[name="nearestPort"]');
    this.averageLeadTimeInput = page.locator('input[name="averageLeadTime.value"]');
    this.minOrderValueInput = page.locator('input[name="minOrderValue.value"]');
    this.acceptedDeliveryTermsInput = page.locator('input[name="acceptedDeliveryTerms"]');
    this.languagesSpokenInput = page.locator('input[role="combobox"]');

    // Trigger to open the dropdown
    this.languagesDropdown = page.locator('.p-multiselect-trigger');  // .p-multiselect-trigger triggers the dropdown

    // You can adjust this to select specific languages from the dropdown
    this.languageOption = page.locator('li.p-multiselect-item');

    // Action buttons
    this.saveBtn = page.locator('button[type="submit"]:has-text("Save")');
    this.cancelBtn = page.locator('button[type="button"]:has-text("Cancel")');
  }

  // Methods for interacting with pricing options
  async selectMainMarkets(value: string) {
    const trigger = this.page.locator(
      '.forms-group:has(label.f-g-label:has-text("Main Market")) .p-dropdown [data-pc-section="trigger"]'
    );
    await trigger.click();

    // pick option
    const option = this.page.locator(
        `//li[@role="option"]//span[normalize-space()="${value}"]`
    );
    await option.click();

    // optional: verify the selection showed in the label
    await expect(
        this.page.locator(
        '.forms-group:has(label.f-g-label:has-text("Main Market")) .p-dropdown .p-inputtext, ' +
        '.forms-group:has(label.f-g-label:has-text("Main Market")) .p-dropdown .p-dropdown-label'
        )
    ).toContainText(value);
  }

  async fillShippingAndPaymentTerms(shipping_mode: string, payment_method: string, payment_terms: string) {
    await this.shippingPage.selectShippingMode(shipping_mode);
    await this.tradeDetailsPage.setPaymentTerms(payment_terms, payment_method);
  }

  async selectAcceptedPaymentCurrency(page: Page, currency: string) {
    // Find the dropdown trigger
    const currencyDropdownTrigger = page.locator('.forms-select-2 .p-multiselect-trigger').nth(2);

    // Open the dropdown
    await currencyDropdownTrigger.click();

    // Select the option based on the visible text (currency name)
    const currencyOption = page.locator(
        `//li[@role="option"]//span[normalize-space()="${currency}"]`
    );

    // Click on the currency option to select it
    await currencyOption.click();

    // Optionally, verify the selected currency in the dropdown label
    const selectedCurrencyLabel = page.locator('.p-multiselect-label');
    await selectedCurrencyLabel.waitFor(); // wait for the label to be visible
    await expect(selectedCurrencyLabel).toContainText(currency);
  }

  async fillTradeAdditonalDetails(details: any) {
    if (details.iec_number) {
      await this.iecNumberInput.fill(details.iec_number);
    }
    if (details.iecDocumentFile) {
      const fileInput = this.iecDocumentInput.locator('input[type="file"]');
      await fileInput.setInputFiles(details.iecDocumentFile);
    }
    await this.exportPercentInput.fill(details.exportPercent);
    await this.nearestPortInput.fill(details.nearestPort);
    await this.selectLanguages(details.languagesSpoken);

    await this.averageLeadTimeInput.fill(details.averageLeadTime);
    // Initialize locators
    const dropdownTrigger = this.page.locator('.p-dropdown-trigger');
    const daysOption = this.page.locator('li.p-multiselect-item:has-text("Days")');
    await dropdownTrigger.click();

    // Click the "Days" option from the dropdown
    await daysOption.click();

    for (const term of details.deliveryTerms) {
    const option = this.page.locator(`li.p-multiselect-item:has-text("${term}")`);
    await option.click();
    }

  // Assert that selected terms are shown in the label
    for (const term of details.deliveryTerms) {
        await expect(this.page.locator('.p-multiselect-label')).toContainText(term);
    }
    await this.minOrderValueInput.fill(details.minOrderValue);
    await this.saveBtn.click();
    await this.page.waitForTimeout(3000);
  }

  async selectLanguages(languages: string[]) {
    // Click on the dropdown to open it
    await this.languagesDropdown.click();

    for (const language of languages) {
      // Click the option based on the language text
      const option = this.page.locator(`li.p-multiselect-item:has-text("${language}")`);
      await option.click(); // Select the language
    }
  }
// q: What is the purpose of the selectLanguages method?
//function to calculate factorial of a number




}
