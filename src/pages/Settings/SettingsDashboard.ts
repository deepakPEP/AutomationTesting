import { Page,expect } from '@playwright/test';

export class SettingsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Assert Personal Settings and Account Settings cards are visible
   */
  async assertSettingsCards() {
    // Personal Settings cards
    await expect(this.page.locator('.dashboard-section-block:has(h2.setting-sub-title:has-text("Personal Settings")) .st-explore-card-comp:has(.st-c-c-c-w-title:has-text("Profile"))')).toBeVisible();
    await expect(this.page.locator('.dashboard-section-block:has(h2.setting-sub-title:has-text("Personal Settings")) .st-explore-card-comp:has(.st-c-c-c-w-title:has-text("Notification Preferences"))')).toBeVisible();

    // Account Settings cards
//     await expect(
//   this.page.locator('.st-explore-card-comp:has(span.st-c-c-c-w-title:has-text("Business Settings"))')
// ).toBeVisible();
    await expect(this.page.locator('span.st-c-c-c-w-title:has-text("Tax Settings")')).toBeVisible();
    await expect(this.page.locator('span.st-c-c-c-w-title:has-text("Compliance Settings")')).toBeVisible();
    //await expect(this.page.locator('.dashboard-section-block:has(h2.setting-sub-title:has-text("Account settings")) .st-explore-card-comp:has(.st-c-c-c-w-title:has-text("Data & Privacy Settings"))')).toBeVisible();
    await expect(this.page.locator('span.st-c-c-c-w-title:has-text("Data & Privacy Settings")')).toBeVisible();
  }

  /**
   * Click a settings card by its title
   */
  async clickSettingsCard(cardTitle: string) {
    await this.page.locator(`.st-explore-card-comp:has(.st-c-c-c-w-title:has-text("${cardTitle}"))`).click();
  }

  async clickSettingsSidebarIcon() {
    await this.page.locator('.dashboard-sidebar-comp .s-c-nav-items:has(.s-c-n-i-txt:has-text("Settings")) svg').click();
    await this.page.waitForTimeout(5000);
  }
}