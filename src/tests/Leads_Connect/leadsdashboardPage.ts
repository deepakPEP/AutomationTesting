import { expect, Locator, Page } from '@playwright/test';

export class LeadDashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async validateFirstLeadRow(expectedLead: {
    name: string;
    email: string;
    phone: string;
    company: string;
    source: string;
    status: string
    lastContactDate: string
  }) {
    const firstRow = this.page.locator('table.p-datatable-table > tbody > tr').first();
    const cells = firstRow.locator('td');

    // ✅ Validate dynamic values
    await expect(cells.nth(1)).toContainText(expectedLead.name);
    await expect(cells.nth(2)).toContainText(expectedLead.email);
    await expect(cells.nth(3)).toContainText(expectedLead.phone);
    await expect(cells.nth(4)).toContainText(expectedLead.company);
    await expect(cells.nth(5)).toContainText(expectedLead.source);

    // ✅ Validate status is always "Not Connected"
    await expect(cells.nth(7)).toHaveText('Not Connected');

    // ✅ Validate date format MM/DD/YYYY
    const dateText = await cells.nth(8).innerText();
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    expect(dateRegex.test(dateText)).toBeTruthy();

    // ✅ Button visibility
    await expect(
      firstRow.getByRole('button', { name: 'Send Quote' })
    ).toBeVisible();
  }
}
