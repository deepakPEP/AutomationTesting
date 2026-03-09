import { expect, Locator, Page } from '@playwright/test';

export class Onboarding {
  readonly page: Page;
  readonly continueButton: Locator;
  

  constructor(page: Page) {
    this.page = page;
    this.continueButton = page.locator('.btn-comp.btn-c-primary.btn-c-lg');
  }

  async fillAboutYourselfForm(
  firstName: string,
  lastName: string,
  email: string,
  companyName?: string
) {
  await this.page.getByPlaceholder('Enter your first name').fill(firstName);

  await this.page.getByPlaceholder('Enter your last name').fill(lastName);

  await this.page.getByPlaceholder('Enter your email address').fill(email);

  if (companyName) {
    await this.page.getByPlaceholder('Enter your company name').fill(companyName);
  }

  await this.page.getByRole('button', { name: 'Create account' }).click();
}

  
  /**
   * Select a radio button by value and assert it is checked
   */
  async selectServiceOption(option: 'Sell' | 'Buy' | 'Both') {
    
    const radio = this.page.locator(`input[id="${option}"]`);
    await radio.click();
    await this.page.waitForTimeout(1000); // Wait for any UI updates
    await this.page.locator('.btn-comp.btn-right.btn-c-primary.btn-c-lg.service-continue-btn').click();
  }

  async clickContinue() {
    await this.page.locator('button.service-continue-btn').click();
  }
  
 
  /**
 * Assert dashboard navbar elements are visible
 */
async assertTopdNavbarElements() {
  // Logo
  await expect(this.page.locator('.dashboard-navbar-comp .site-logo-head img[alt="Logo"]')).toBeVisible();

  // All Categories
  await expect(this.page.locator('.dashboard-navbar-comp #p-all-categories')).toBeVisible();

  // Search bar
  await expect(this.page.locator('.dashboard-navbar-comp .p-main-search input[placeholder="Search for Product and Services"]')).toBeVisible();

  // Language selector
  await expect(this.page.locator('div.language-input .p-dropdown-trigger[role="button"]').nth(0)).toBeVisible();

  // Country flag
  await expect(this.page.locator('.dashboard-navbar-comp .flag img[alt="Country Flag"]')).toBeVisible();

  // Currency dropdown
  await expect(this.page.locator('.dashboard-navbar-comp .currency-dropdown')).toBeVisible();

  // RFQ enquiry cart
  await expect(this.page.locator('.dashboard-navbar-comp .rfq-cart-trigger').nth(0)).toBeVisible();

  // Post Buying Requirement button
  await expect(this.page.locator('.dashboard-navbar-comp button:has-text("Post Buying Requirement")')).toBeVisible();

  // Profile icon
  await expect(this.page.locator('.dashboard-navbar-comp .language-input-comp svg').nth(1)).toBeVisible();
}

  async assertUserNameInProfile(userName: string) {
    // Click profile icon to open dropdown
    // Assert username is visible and correct
    await expect(this.page.locator('.p-u-l-title')).toHaveText('Hi, ' + userName);

// Assert "View Profile & Settings" link is visible
    await expect(this.page.locator('.p-u-new-customer a:has-text("View Profile & Settings")')).toBeVisible();
  }
  async clickProfileIcon(){
    await this.page.locator('.rfq-cart-trigger').nth(1).click();
    await this.page.waitForTimeout(1000);
  }

  /**
 * Assert Business Tools items visibility by array of link texts
 */
async assertBusinessToolsItemsVisible(itemTexts: string[]) {
  for (const text of itemTexts) {
    await expect(
      this.page.locator('.d-m-item .d-m-i-title:has-text("Business Tools") + a:has-text("' + text + '")')
    ).toBeVisible();
  }
  // Assert "Account Settings" link is visible
  await expect(this.page.locator('.d-m-item a:has-text("Account Settings")')).toBeVisible();

  // Assert "Sign Out" button is visible
  await expect(this.page.locator('.d-m-link-button:has-text("Sign Out")')).toBeVisible();
  }


async clickCloseSidebar() {
  await this.page.locator('.s-c-close-block').click();  
}
/**
 * Assert sidebar navigation items and their icons are visible by text
 */
async assertSidebarNavItemsWithIconsVisible(itemTexts: string[]) {
  for (const text of itemTexts) {
    const navItem = this.page.locator('.dashboard-sidebar-comp .s-c-nav-items:has(.s-c-n-i-txt:has-text("' + text + '"))');
    await expect(navItem).toBeVisible();
    await expect(navItem.locator('svg')).toBeVisible();
  }
}
/**
 * Assert dashboard card headings are visible by array of titles
 */
async assertDashboardCardHeadingsVisible(cardTitles: string[]) {
  for (const title of cardTitles) {
    await expect(
      this.page.locator('.explore-card-comp .e-c-c-c-w-title:has-text("' + title + '")')
    ).toBeVisible();
  }
}
  //new onboarding flow method
  async fillMobileNumberAndSubmit(mobileNumber: string) {
    await this.page.locator('.custom-country-selector .country-arrow').click();
    await this.page.waitForTimeout(1000); // Wait for dropdown to open
    await this.page.locator('.country-option .country-name', { hasText: 'India' }).click();
    //await this.page.pause();
    await this.page.locator('input[placeholder="Enter mobile number"]').fill(mobileNumber);
    await this.continueButton.click();
  }
}