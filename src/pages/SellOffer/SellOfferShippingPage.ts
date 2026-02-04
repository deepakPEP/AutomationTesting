// src/pages/SellOfferShippingPage.ts
import { Page, expect } from '@playwright/test';
import { AddProdTradeDetails } from '../ProductISell/AddProdTradeDetails';
import {AddProdShippingLogisticsDetails} from '../ProductISell/AddProdShippingLogisticsDetails'

export class SellOfferShippingPage {
  
  readonly page: Page;
  readonly prodTradeDetails: AddProdTradeDetails;
  readonly prodShippingDetails: AddProdShippingLogisticsDetails;

  constructor(page: Page) {
    this.page = page;
    this.prodTradeDetails = new AddProdTradeDetails(page);
    this.prodShippingDetails = new AddProdShippingLogisticsDetails(page);
  }

  async fillShippingDetails(): Promise<void> {
    await this.page.getByText('Payment & Shipping').click({ timeout: 60000 });
    await this.page.locator('label').filter({ hasText: 'Credit Card' }).locator('span').nth(1).click({ timeout: 60000 });
    await this.page.getByText('Select Payment Term').click({ timeout: 60000 });
    await this.page.getByRole('option', { name: '% Advance / 50% on Dispatch' }).click({ timeout: 60000 });
    await this.page.locator('span').filter({ hasText: 'Select Lead Time' }).click({ timeout: 60000 });
    await this.page.locator('#dropdownItem_2').click({ timeout: 60000 });
    await this.page.getByText('Upon Request').click({ timeout: 60000 });
    await this.page.locator('label').filter({ hasText: 'Air' }).locator('span').nth(1).click({ timeout: 60000 });
    await this.page.locator('label').filter({ hasText: 'Sea' }).locator('span').nth(1).click({ timeout: 60000 });
    await this.page.waitForTimeout(5000);
    await this.page.click("//span[normalize-space()='Continue']",{ timeout: 60000 });
  }
  async fillShipping(product:any): Promise<void> {
    const paymentMethodsArray = product.payment_methods.split(',').map((m: string) => m.trim());
    await this.prodTradeDetails.selectPaymentMethods(paymentMethodsArray);
    await this.prodShippingDetails.is_Ships_Internationally(product?.ships_internationally || false);
    await this.prodTradeDetails.setPaymentTerms(product?.payment_terms || '100% Advance');
    await this.prodShippingDetails.selectShippingMode(product?.shipping_modes || 'Air');
  // Select incoterms
  //await this.prodShippingDetails.selectIncoterms(product?.incoterms || 'EXW');
  //  await this.page.getByRole('button', { name: 'Select Lead Time' }).click();
    await this.selectDispatchLeadTime(product?.shipping_lead_time || 'Default Lead Time');
    
  // Fill port of dispatch
  }
  async selectDispatchLeadTime(option: string) {
  // Click the dropdown label
  //await this.page.locator('span.p-dropdown-label').click();
    // Assert "Select Lead Time" is visible before clicking
    
await expect(this.page.locator('span.p-dropdown-label', { hasText: 'Select Lead Time' })).toBeVisible();

// Now click the dropdown
await this.page.locator('span.p-dropdown-label', { hasText: 'Select Lead Time' }).click({ force: true, timeout: 60000 });
  // Select the option dynamically by text
  await console.log('Selecting dispatch lead time option:', option);
  await this.page.locator(`.p-dropdown-item-label:text-is("${option}")`).click({ force: true, timeout: 60000 });
}
  async confirmAndSubmitOffer(): Promise<void> {
    await expect(this.page.locator("//h6[normalize-space()='Sell offer created successfully.']")).toBeVisible();
    await expect(this.page.locator("//div[@class='m-c-h-left']")).toBeVisible();

    await this.page.getByText('Toggle').first().click();
    await this.page.click("//label[@for='SendToContacts'][normalize-space()='Toggle']");
    await this.page.getByRole('button', { name: 'Select All' }).click();
    await this.page.getByRole('button', { name: 'Select All' }).click();
    await this.page.getByRole('button', { name: 'Submit' }).click();
    await this.page.getByRole('button', { name: 'Update' }).click();
  }

  async verifyRedirectedSellOffer(url: string): Promise<void> {
    await this.page.goto(url);
    await this.page.waitForTimeout(5000);
    await expect(this.page).toHaveURL(url);
  }
}
