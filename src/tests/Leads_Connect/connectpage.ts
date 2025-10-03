// pages/ConnectPage.ts
import { Page } from '@playwright/test';

export class ConnectPage {
  constructor(private page: Page) {}

  async clickAddNewContact() {
    await this.page.getByRole('button', { name: 'Add New Contact Add New' }).click();
  }

  async fillContactForm(data: {
    name: string;
    company: string;
    email: string;
    phone: string;
    country: string;
    source: string;
  }) {
    await this.page.getByRole('textbox', { name: 'Enter Contact Name' }).fill(data.name);
    await this.page.getByRole('textbox', { name: 'Enter Company Name' }).fill(data.company);
    await this.page.getByRole('textbox', { name: 'Enter Email Id' }).fill(data.email);
    await this.page.getByRole('textbox', { name: 'Enter Phone Number' }).fill(data.phone);
    await this.page.locator('label').filter({ hasText: 'Same as Phone Number' }).locator('div span').click();

    await this.page.getByText('Select CountrySelect Country').click();
    await this.page.locator('.p-dropdown-filter').fill(data.country.slice(0, 3).toLowerCase());
    await this.page.getByText(data.country, { exact: true }).click();

    await this.page.locator('span').filter({ hasText: 'Select Source' }).click();
    await this.page.getByRole('option', { name: data.source }).click();
  }

  async submitContactForm() {
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }
}