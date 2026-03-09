import { Locator, Page } from "playwright-core";
import { expect } from "@playwright/test";
import path from "path";

export class MyPepagoraPage {
  readonly page: Page;

  readonly closeIcon: Locator;
  
  
  constructor(page: Page) {
    this.page = page;

    this.closeIcon = this.page.locator('img.sidebar-close-icon');
    
  }
  
  async closeSidebar() {
    await this.closeIcon.click();
  }
  async clickBusinessProfile() {
    await this.page.locator('a.s-c-nav-items:has-text("Business Profile")').click();
  }
  async clickProfileIcon(){
    await this.page.locator('.rfq-cart-trigger').nth(1).click();
    await this.page.waitForTimeout(1000);
  }
  async assertProfileIconDetails(details: {
  name: string;
  company: string;
  plan: string;
}) {

  await expect(this.page.locator('.p-u-l-title'))
    .toHaveText(`Hi, ${details.name}`);

  await expect(this.page.locator('.p-u-new-customer span'))
    .toHaveText(details.company);

  await expect(this.page.locator('.p-u-l-title-container-userStatus'))
    .toHaveText(details.plan);
}
}