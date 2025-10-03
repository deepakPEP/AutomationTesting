import { expect, Locator, Page } from '@playwright/test';

export class ConnectDashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async validateFirstContactRow(expectedContact: {
    name: string;
    company: string;
    email: string;
    phone: string;
    type: string;
    source: string;
    status: string;
  }) {
    const firstRow = this.page.locator('table.p-datatable-table > tbody > tr').first();
    const cells = firstRow.locator('td');

    // ✅ Validate dynamic values
    await expect(cells.nth(1)).toContainText(expectedContact.name);
    await expect(cells.nth(2)).toContainText(expectedContact.company);
    await expect(cells.nth(3)).toContainText(expectedContact.email);
    await expect(cells.nth(4)).toContainText(expectedContact.phone);
    await expect(cells.nth(5)).toContainText(expectedContact.type);
    await expect(cells.nth(6)).toContainText(expectedContact.source);
    await expect(cells.nth(7)).toHaveText(expectedContact.status);

    // ✅ Validate 3-dot action menu is visible (last cell)
    const actionMenu = cells.nth(9).locator('svg.trigger-icon');
    await expect(actionMenu).toBeVisible();

    // ✅ Optional: Validate checkbox is present and not selected
    const checkbox = cells.nth(0).locator('input[type="checkbox"]');
    await expect(checkbox).toBeVisible();
    await expect(checkbox).not.toBeChecked();
  }
}
