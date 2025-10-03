import { Page } from '@playwright/test';

interface LeadFormInput {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  company: string;
  productSearch: string;
  productSelect: string;
  source: string;
  stage: string;
  permission: string;
}

export class LeadsPage {
  constructor(private page: Page) {}

  async goToLeadsPage() {
    await this.page.getByRole('link', { name: 'Leads' }).click();
  }

  async clickAddLead() {
    await this.page.getByRole('button', { name: 'Add Lead Add Lead' }).click();
  }

  async fillLeadForm(data: LeadFormInput) {
    await this.page.getByRole('textbox', { name: 'Enter Name' }).fill(data.name);
    await this.page.getByRole('textbox', { name: 'Enter Email' }).fill(data.email);
    await this.page.getByRole('textbox', { name: 'Enter Phone' }).fill(data.phone);
    await this.page.getByRole('textbox', { name: 'Enter Job Title' }).fill(data.jobTitle);
    await this.page.getByRole('textbox', { name: 'Enter Company' }).fill(data.company);

    await this.page.getByRole('combobox', { name: 'Search' }).fill(data.productSearch);
    await this.page.getByRole('option', { name: new RegExp(data.productSelect, 'i') }).click();

    await this.page.getByRole('button', { name: 'Enter Source' }).click();
    await this.page.getByLabel(data.source).getByText(data.source).click();

    await this.page.getByRole('button', { name: 'Enter Stage' }).click();
    await this.page.getByLabel(data.stage).getByText(data.stage).click();

    await this.page.getByRole('button', { name: 'Enter Permission to Contact' }).click();
    await this.page.getByLabel(data.permission, { exact: true }).getByText(data.permission).click();
  }

  async submitForm() {
    await this.page.getByRole('button', { name: 'Continue', exact: true }).click();
  }
}