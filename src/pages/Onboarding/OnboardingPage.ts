import { expect, Locator, Page } from '@playwright/test';

export class Onboarding {
  readonly page: Page;
  readonly continueButton: Locator;
  

  constructor(page: Page) {
    this.page = page;
    this.continueButton = page.locator("//button//span[text()='Continue']")
  }


  /**
   * Assert onboarding radio buttons and heading visibility
   */
  async assertOnboardingOptions() {
    // Assert heading and subheading are visible
    await expect(this.page.locator('h1.title-txt')).toBeVisible();
    await expect(this.page.locator('h2.sub-txt')).toBeVisible();

    // Assert radio buttons are visible
    await expect(this.page.locator('input[id="Sell Products"]')).toBeVisible();
    await expect(this.page.locator('input[id="Buy Products"]')).toBeVisible();
    await expect(this.page.locator('input[id="Do Both"]')).toBeVisible();
  }

  /**
   * Select a radio button by value and assert it is checked
   */
  async selectServiceOption(option: 'Sell Products' | 'Buy Products' | 'Do Both') {
    const radio = this.page.locator(`input[id="${option}"]`);
    await radio.check();
    await expect(radio).toBeChecked();
    await this.clickContinue();
  }

  async clickContinue() {
    await this.page.locator('button.service-continue-btn').click();
  }
  /**
   * Assert timeline, heading, and radio buttons visibility
   */
  async assertBusinessDetailsStep() {
    // Timeline steps visible
    await expect(this.page.locator('.timeline-steps-comp')).toBeVisible();
    await expect(this.page.locator('.t-s-c-ul li')).toHaveCount(4);

    // Heading and subheading visible
    await expect(this.page.locator('h1.title-txt')).toHaveText("Let's Start with the Basics");
    await expect(this.page.locator('h2.sub-txt')).toBeVisible();

    // Business type radio buttons visible
    await expect(this.page.locator('input[id="unregister"]')).toBeVisible();
    await expect(this.page.locator('input[id="register"]')).toBeVisible();
    await expect(this.page.locator('input[id="nonprofit"]')).toBeVisible();
  }

  /**
   * Select business type radio button by value and assert it is checked
   */
  async selectBusinessType(option: 'unregister' | 'register' | 'nonprofit') {
    const radio = this.page.locator(`input[id="${option}"]`);
    await radio.check();
    await expect(radio).toBeChecked();
    await this.page.locator('button:has(span.b-c-txt:has-text("Continue"))').click();
  }
  /**
   * Assert timeline steps and headings for Business Representative
   */
  async assertBusinessRepresentativeStep() {
    // Timeline steps visible and correct
    await expect(this.page.locator('.timeline-steps-comp')).toBeVisible();
    await expect(this.page.locator('.t-s-c-ul li')).toHaveCount(3);
    await expect(this.page.locator('.t-s-c-ul li.active')).toContainText(['Business Details', 'Personal Information']);

    // Heading and subheading
    await expect(this.page.locator('h1.title-txt')).toHaveText('Verify Your Business Representative Details');
    await expect(this.page.locator('h2.sub-txt')).toBeVisible();
  }

  /**
   * Fill seller step1 - seller - unregistered Business Representative form
   */
  async fillBusinessRepresentativeFormWithUnregisteredUser(details: {
    firstName: string,
    middleName?: string,
    lastName: string,
    workEmail: string,
    workPhoneNo: string
  }) {
    await this.page.locator('input[name="firstName"]').fill(details.firstName);
    if (details.middleName !== undefined) {
      await this.page.locator('input[name="middleName"]').fill(details.middleName);
    }
    await this.page.locator('input[name="lastName"]').fill(details.lastName);
    await this.page.locator('input[name="workEmail"]').fill(details.workEmail);
    await this.page.locator('input[name="workPhoneNo"]').fill(details.workPhoneNo);
    await this.clickBusinessRepresentativeContinue();
  }

  /**
   * Click the Continue button on Business Representative form
   */
  async clickBusinessRepresentativeContinue() {
    await this.page.locator('button:has(span.b-c-txt:has-text("Continue"))').click();
  }
  /**
   * Assert timeline steps and headings for Business Information step
   */
  async assertBusinessInformationStep() {
    // Timeline steps visible and correct
    await expect(this.page.locator('.timeline-steps-comp')).toBeVisible();
    await expect(this.page.locator('.t-s-c-ul li')).toHaveCount(3);
    await expect(this.page.locator('.t-s-c-ul li.active')).toContainText(['Business Details', 'Personal Information', 'Business Information']);

    // Heading and subheading
    await expect(this.page.locator('h1.title-txt')).toHaveText('Tell us more about your business ');
    await expect(this.page.locator('h2.sub-txt')).toBeVisible();
  }

  /**
   * Fill seller Business Information form
   */
  async fillBusinessInformationFormWithUnregisteredUser(details: {
    industry: string,
    website?: string,
    productBrief: string
  }) {
    // Select industry from dropdown
    await this.page.locator('.category-multi-select .p-dropdown-trigger').click();
    await this.page.locator(`.p-dropdown-item:has-text("${details.industry}")`).click();

    // Fill website if provided
    if (details.website) {
      await this.page.locator('input[name="website"]').fill(details.website);
    }

    // Fill product/service description
    await this.page.locator('textarea[name="productBrief"]').fill(details.productBrief);

    // Click Continue
    await this.page.locator('button:has(span.b-c-txt:has-text("Continue"))').click();
  }

  /**
   * Assert timeline steps and headings for Business Information step (with Legal Business Name)
   */
  async assertBusinessInformationStepRegisteredUser() {
    // Timeline steps visible and correct
    await expect(this.page.locator('.timeline-steps-comp')).toBeVisible();
    await expect(this.page.locator('.t-s-c-ul li')).toHaveCount(4);
    await expect(this.page.locator('.t-s-c-ul li.active')).toContainText(['Business Details', 'Business Information']);

    // Heading and subheading
    await expect(this.page.locator('h1.title-txt')).toHaveText('Tell us more about your business ');
    await expect(this.page.locator('h2.sub-txt')).toBeVisible();
  }

  /**
   * Fill Business Information form with Legal Business Name
   */
  async fillBusinessInformationFormWithRegisteredUser(details: {
    legalBusinessName: string,
    industry: string,
    website?: string,
    productBrief: string
  }) {
    // Fill legal business name
    await this.page.locator('input[name="legalBusinessName"]').fill(details.legalBusinessName);

    // Select industry from dropdown
    await this.page.locator('.category-multi-select .p-dropdown-trigger').click();
    await this.page.locator(`.p-dropdown-item:has-text("${details.industry}")`).click();

    // Fill website if provided
    if (details.website) {
      await this.page.locator('input[name="website"]').fill(details.website);
    }

    // Fill product/service description
    await this.page.locator('textarea[name="productBrief"]').fill(details.productBrief);

    // Click Continue
    await this.page.locator('button:has(span.b-c-txt:has-text("Continue"))').click();
  }

  /**
   * Assert timeline steps and headings for Contact Information step
   */
  async assertContactInformationStep() {
    // Timeline steps visible and correct
    await expect(this.page.locator('.timeline-steps-comp')).toBeVisible();
    await expect(this.page.locator('.t-s-c-ul li')).toHaveCount(4);
    await expect(this.page.locator('.t-s-c-ul li.active')).toContainText(['Business Details', 'Business Information', 'Contact Information']);

    // Heading and subheading
    await expect(this.page.locator('h1.title-txt')).toHaveText('How can we reach you? ');
    await expect(this.page.locator('h2.sub-txt')).toBeVisible();
  }

  /**
   * Fill Contact Information form
   */
  async fillContactInformationForm(details: {
    businessPhoneNo: string,
    businessEmail: string,
    country: string,
    addressLine: string,
    state: string,
    city: string,
    pinCode: string
  }) {
    await this.page.locator('input[name="businessPhoneNo"]').fill(details.businessPhoneNo);
    await this.page.locator('input[name="businessEmail"]').fill(details.businessEmail);

    // Select country from dropdown
    await this.page.locator('.inputs-wrap .p-dropdown-trigger[aria-label="Select Country"]').click();
    await this.page.locator(`.p-dropdown-item:has-text("${details.country}")`).click();

    // Fill address line
    await this.page.locator('input[name="businessAddress.addressLine"]').fill(details.addressLine);

    // Select state from dropdown (if enabled)
    const stateDropdown = this.page.locator('.inputs-wrap .p-dropdown-trigger[aria-label="State"]');
    if (await stateDropdown.isEnabled()) {
      await stateDropdown.click();
      await this.page.locator(`.p-dropdown-item:has-text("${details.state}")`).click();
    }

    // Select city from dropdown (if enabled)
    const cityDropdown = this.page.locator('.inputs-wrap .p-dropdown-trigger[aria-label="Select City/Town"]');
    if (await cityDropdown.isEnabled()) {
      await cityDropdown.click();
      await this.page.locator(`.p-dropdown-item:has-text("${details.city}")`).click();
    }

    // Fill postal cod.e
    await this.page.locator('input[name="businessAddress.pinCode"]').fill(details.pinCode);

    // Click Continue
    await this.page.locator('button:has(span.b-c-txt:has-text("Continue"))').click();
  }
  /**
   * Assert timeline steps and headings for Business Representative step (latest-active)
   */
  async assertBusinessRepresentativeStepLatestActive() {
    // Timeline steps visible and correct
    await expect(this.page.locator('.timeline-steps-comp')).toBeVisible();
    await expect(this.page.locator('.t-s-c-ul li')).toHaveCount(4);
    await expect(this.page.locator('.t-s-c-ul li.active')).toContainText([
      'Business Details',
      'Business Information',
      'Contact Information',
      'Business Representative'
    ]);

    // Heading and subheading
    await expect(this.page.locator('h1.title-txt')).toHaveText('Verify Your Business Representative Details');
    await expect(this.page.locator('h2.sub-txt')).toBeVisible();
  }

  /**
   * Fill Business Representative form (with job title)
   */
  async fillBusinessRepresentativeForm(details: {
    firstName: string,
    middleName?: string,
    lastName: string,
    workEmail: string,
    jobTitle: string,
    workPhoneNo: string
  }) {
    await this.page.locator('input[name="firstName"]').fill(details.firstName);
    if (details.middleName !== undefined) {
      await this.page.locator('input[name="middleName"]').fill(details.middleName);
    }
    await this.page.locator('input[name="lastName"]').fill(details.lastName);
    await this.page.locator('input[name="workEmail"]').fill(details.workEmail);
    await this.page.locator('input[name="jobTitle"]').fill(details.jobTitle);
    await this.page.locator('input[name="workPhoneNo"]').fill(details.workPhoneNo);

    // Click Continue
    await this.page.locator('button:has(span.b-c-txt:has-text("Continue"))').click();
  }

  /**
   * Assert timeline steps and which are active for Contact Information step
   */
  async assertContactInformationTimelineActive() {
    // Timeline steps visible
    await expect(this.page.locator('.timeline-steps-comp')).toBeVisible();
    await expect(this.page.locator('.t-s-c-ul li')).toHaveCount(4);

    // Assert active steps
    const activeSteps = await this.page.locator('.t-s-c-ul li.active span').allTextContents();
    expect(activeSteps).toEqual([
      'Business Details',
      'Business Information',
      'Contact Information'
    ]);
  }
  //for buyer flow
    /**
   * Assert timeline steps and headings for Sourcing Details step
   */
  async assertSourcingDetailsStep() {
    // Timeline steps visible and correct
    await expect(this.page.locator('.timeline-steps-comp')).toBeVisible();
    await expect(this.page.locator('.t-s-c-ul li')).toHaveCount(2);
    //await expect(this.page.locator('.t-s-c-ul li.active')).toContainText(['Business Details', 'Sourcing Details']);

    // Heading and subheading
    await expect(this.page.locator('h1.title-txt')).toHaveText('Sourcing Details ');
    await expect(this.page.locator('h2.sub-txt')).toBeVisible();
  }

  /**
   * Fill Sourcing Details form
   */
  async fillSourcingDetailsForm(details: {
    firstName: string,
    middleName?: string,
    lastName: string,
    workEmail: string,
    industry: string,
    productsISource: string[], // array of product names
    website?: string,
    businessName?: string
  }) {
    await this.page.locator('input[name="firstName"]').fill(details.firstName);
    if (details.middleName !== undefined) {
      await this.page.locator('input[name="middleName"]').fill(details.middleName);
    }
    await this.page.locator('input[name="lastName"]').fill(details.lastName);
    await this.page.locator('input[name="workEmail"]').fill(details.workEmail);

    // Select industry from dropdown
    await this.page.locator('.category-multi-select .p-dropdown-trigger').click();
    await this.page.locator(`.p-dropdown-item:has-text("${details.industry}")`).click();

    // Fill products I source (chips input)
    for (const product of details.productsISource) {
      const chipsInput = this.page.locator('.forms-input.p-chips input[placeholder="Enter product names"]');
      await chipsInput.fill(product);
      await chipsInput.press('Enter');
    }

    // Fill website if provided
    if (details.website) {
      await this.page.locator('input[name="website"]').fill(details.website);
    }

    // Fill business name if provided
    if (details.businessName) {
      await this.page.locator('input[name="businessName"]').fill(details.businessName);
    }

    // Click Continue
    await this.page.locator('button:has(span.b-c-txt:has-text("Continue"))').click();
  }
    /**
   * Assert buyer dashboard progress bar, sourcing icon, and main cards
   */
  async assertBuyerDashboard(userName: string) {
    // Assert progress percentage and bar
    // await expect(this.page.locator('.a-s-c-c-count')).toHaveText('20%');
    // await expect(this.page.locator('.progressbar-comp:has(label:has-text("Personal Details")) .p-c-value')).toHaveText('Completed 20%');

    // // Assert sourcing icon/card visible
    // await expect(this.page.locator('.explore-card-comp:has(.e-c-c-c-w-title:has-text("Post your requirements"))')).toBeVisible();

    // // Assert Browse Verified Suppliers card
    // await expect(this.page.locator('.explore-card-comp:has(.e-c-c-c-w-title:has-text("Browse Verified Suppliers"))')).toBeVisible();

    // // Assert Post your requirements card
    // await expect(this.page.locator('.explore-card-comp:has(.e-c-c-c-w-title:has-text("Post your requirements"))')).toBeVisible();

    // // Assert Complete Your KYC card
    // await expect(this.page.locator('.explore-card-comp:has(.e-c-c-c-w-title:has-text("Complete Your KYC"))')).toBeVisible();
    await this.clickProfileIcon();
    await this.assertUserNameInProfile(userName);
    await this.assertBusinessToolsItemsVisible(['Post a Buying Request (RFQ)']);
    await this.clickProfileIcon();
    await this.assertPostOnboardingStatus('20%','Buyer')
    await this.assertDashboardCardHeadingsVisible(['Browse Verified Suppliers','Post your requirements','Complete Your KYC']);
    await this.clickCloseSidebar();
    await this.assertSidebarNavItemsWithIconsVisible(['My Pepagora','Settings','Sourcing']);
    await this.assertTopdNavbarElements();
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

/**
 * Assert account setup percent, personal details progress, and continue setup button
 */
async assertPostOnboardingStatus(expectedPercent: string, user: 'Buyer'| 'Seller'|'Both') {
  // Assert percent completed
  await expect(this.page.locator('.a-s-c-c-count')).toHaveText(expectedPercent);

  // Assert Personal Details progress bar and label
  await expect(this.page.locator('.progressbar-comp label.p-c-label')).toHaveText('Personal Details');
  await expect(this.page.locator('.progressbar-comp .p-c-value')).toHaveText(`Completed ${expectedPercent}`);

  // Assert Continue Setup button is visible
  await expect(this.page.locator('button.continue-steup-btn:has-text("Continue Setup")')).toBeVisible();
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

}