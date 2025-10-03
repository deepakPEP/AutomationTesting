 import { expect, Locator, Page } from '@playwright/test';
// import {  assertNormalizedText } from '../utils/CommonFunctions';
 export class AssertionBusinessProfilePage {
  readonly page: Page;


  constructor(page: Page) {
    this.page = page;
 }
 // ...existing code...

  /**
   * Assert Business Details section
   */
  async assertBusinessDetails(details: {
    legalBusinessName: string,
    businessName: string,
    ownerName: string,
    businessType: string,
    employeeCount: string,
    mainProducts: string[],
    industry: string,
    establishment: string,
    country: string,
    businessAddress: string,
    state: string,
    city: string,
    pinCode: string,
    mobile: string,
    email: string
  }) {
    await expect(this.page.locator('input[name="legalBusinessName"]')).toHaveValue(details.legalBusinessName);
    await expect(this.page.locator('input[name="businessName"]')).toHaveValue(details.businessName);
    await expect(this.page.locator('input[name="ownerName"]')).toHaveValue(details.ownerName);
    await expect(this.page.locator('.forms-select-2[data-pc-name="multiselect"] .p-multiselect-label')).toContainText(details.businessType);
    await expect(this.page.locator('select[name="employeeCount"]')).toHaveValue(details.employeeCount);
    for (const product of details.mainProducts) {
      await expect(this.page.locator('.p-chips-token-label')).toContainText(product);
    }
    await expect(this.page.locator('.category-multi-select .p-dropdown-label')).toContainText(details.industry);
    await expect(this.page.locator('input[name="establishment"]')).toHaveValue(details.establishment);
    await expect(this.page.locator('.forms-group:has(label:has-text("Country")) .p-dropdown-label')).toContainText(details.country);
    await expect(this.page.locator('input[name="businessAddress.addressLine"]')).toHaveValue(details.businessAddress);
    await expect(this.page.locator('.forms-group:has(label:has-text("State")) .p-dropdown-label')).toContainText(details.state);
    await expect(this.page.locator('.forms-group:has(label:has-text("City")) .p-dropdown-label')).toContainText(details.city);
    await expect(this.page.locator('input[name="businessAddress.pinCode"]')).toHaveValue(details.pinCode);
    await expect(this.page.locator('input[type="tel"]')).toHaveValue(details.mobile);
    await expect(this.page.locator('input[name="email"]')).toHaveValue(details.email);
  }

  /**
   * Assert Company Registration Details section
   */
  async assertCompanyRegistrationDetails(details: {
    documentType: string,
    documentId: string
  }) {
    await expect(this.page.locator('.forms-group:has(label:has-text("Document Type")) .p-dropdown-label')).toContainText(details.documentType);
    await expect(this.page.locator('input[name="businessRegistration.documentId"]')).toHaveValue(details.documentId);
  }

  /**
   * Assert Additional Information section
   */
  async assertAdditionalInformation(details: {
    shippingAddress: string,
    country: string,
    state: string,
    city: string,
    pinCode: string,
    annualTurnover: string,
    website: string
  }) {
    await expect(this.page.locator('input[name="shippingAddress.addressLine"]')).toHaveValue(details.shippingAddress);
    await expect(this.page.locator('.f-g-input-horiz-inside .p-dropdown-label')).toContainText(details.country);
    await expect(this.page.locator('.f-g-input-horiz-inside .p-dropdown-label')).toContainText(details.state);
    await expect(this.page.locator('.f-g-input-horiz-inside .p-dropdown-label')).toContainText(details.city);
    await expect(this.page.locator('input[name="shippingAddress.pinCode"]')).toHaveValue(details.pinCode);
    await expect(this.page.locator('.forms-group:has(label:has-text("Annual Turnover")) .p-dropdown-label')).toContainText(details.annualTurnover);
    await expect(this.page.locator('input[name="website"]')).toHaveValue(details.website);
  }

// ...existing code...

  /**
   * Assert Company Logo
   */
  async assertCompanyLogo(expectedSrc: string) {
    const logoImg = this.page.locator('#accordion-tab-BrandingMedia .a-f-b-subtxt:has-text("Company Logo") ~ .t-f-g-img img');
    await expect(logoImg).toHaveAttribute('src', expectedSrc);
  }

  /**
   * Assert Company Video
   */
  async assertCompanyVideo(expectedSrc: string) {
    const videoFrame = this.page.locator('#accordion-tab-BrandingMedia .a-f-b-subtxt:has-text("Company Video") ~ .t-f-g-video iframe');
    await expect(videoFrame).toHaveAttribute('src', expectedSrc);
  }

  /**
   * Assert Company Brochures
   */
  async assertCompanyBrochures(expectedBrochures: { filename: string, size: string }[]) {
    for (const brochure of expectedBrochures) {
      const brochureBlock = this.page.locator(`#accordion-tab-BrandingMedia .a-f-b-subtxt:has-text("Company Brochures") ~ .tabs-content .b-d-b-filename:has-text("${brochure.filename}")`);
      await expect(brochureBlock).toBeVisible();
      const sizeBlock = brochureBlock.locator('..').locator('.b-d-b-size');
      await expect(sizeBlock).toHaveText(brochure.size);
    }
  }

  /**
   * Assert Own Brands
   */
  async assertOwnBrands(expectedBrands: { name: string, size: string }[]) {
    for (const brand of expectedBrands) {
      const brandBlock = this.page.locator(`#accordion-tab-BrandingMedia .a-f-b-subtxt:has-text("Own Brands") ~ .tabs-content .b-d-b-filename:has-text("${brand.name}")`);
      await expect(brandBlock).toBeVisible();
      const sizeBlock = brandBlock.locator('..').locator('.b-d-b-size');
      await expect(sizeBlock).toHaveText(brand.size);
    }
  }

  /**
   * Assert Other Brands
   */
  async assertOtherBrands(expectedBrands: { name: string, size: string }[]) {
    for (const brand of expectedBrands) {
      const brandBlock = this.page.locator(`#accordion-tab-BrandingMedia .a-f-b-subtxt:has-text("Other brands") ~ .tabs-content .b-d-b-filename:has-text("${brand.name}")`);
      await expect(brandBlock).toBeVisible();
      const sizeBlock = brandBlock.locator('..').locator('.b-d-b-size');
      await expect(sizeBlock).toHaveText(brand.size);
    }
  }

  /**
   * Assert Awards & Recognition
   */
  async assertAwardsRecognition(expectedAwards: { label: string, filename: string, size: string }[]) {
    for (const award of expectedAwards) {
      const awardLabel = this.page.locator(`#accordion-tab-BrandingMedia .a-f-b-subtxt:has-text("Awards & Recognition") ~ .tabs-content .t-f-g-label:has-text("${award.label}")`);
      await expect(awardLabel).toBeVisible();
      const awardFile = awardLabel.locator('..').locator('.b-d-b-filename:has-text("' + award.filename + '")');
      await expect(awardFile).toBeVisible();
      const sizeBlock = awardFile.locator('..').locator('.b-d-b-size');
      await expect(sizeBlock).toHaveText(award.size);
    }
  }

  /**
   * Assert Certificates & Quality Standards
   */
  async assertCertificates(expectedCertificates: { name: string, size: string }[]) {
    for (const cert of expectedCertificates) {
      const certBlock = this.page.locator(`#accordion-tab-BrandingMedia .a-f-b-subtxt:has-text("Certificates & Quality Standards") ~ .tabs-content .b-d-b-filename:has-text("${cert.name}")`);
      await expect(certBlock).toBeVisible();
      const sizeBlock = certBlock.locator('..').locator('.b-d-b-size');
      await expect(sizeBlock).toHaveText(cert.size);
    }
  }

  /**
   * Assert Social Media Links
   */
  async assertSocialMediaLinks(expectedLinks: { name: string, url: string }[]) {
    for (const link of expectedLinks) {
      const linkBlock = this.page.locator(`#accordion-tab-BrandingMedia .a-f-b-subtxt:has-text("Social Media Links") ~ .tabs-content .s-l-g-item:has-text("${link.name}")`);
      await expect(linkBlock).toHaveAttribute('href', link.url);
    }
  }
  async assertBrandingAndMedia(){//details: {
//     await page.assertCompanyLogo('/_next/image?url=https%3A%2F%2Fpepupload.s3.ap-southeast-1.amazonaws.com%2F&w=3840&q=75');
// await page.assertCompanyVideo('https://www.youtube.com/embed/L98hfqZ1puk?autoplay=1&rel=0');
// await page.assertCompanyBrochures([{ filename: 'h-3JfRB4YCQqTSpASHTak.pdf', size: '0.1 MB' }]);
// await page.assertOwnBrands([{ name: 'brand1', size: '0.07 MB' }, { name: 'brand2', size: '0.03 MB' }]);
// await page.assertOtherBrands([{ name: 'other brand1', size: '0 MB' }, { name: 'other brand2', size: '0 MB' }]);
// await page.assertAwardsRecognition([{ label: 'award1', filename: '087Vqi3Uhinl7enCFppfJ.png', size: '0.10 MB' }, { label: 'award2', filename: 'vsm5C2IYBPKlkdNMH5zb6.jpeg', size: '0.07 MB' }]);
// await page.assertCertificates([{ name: 'cert1', size: '0.1 MB' }]);
// await page.assertSocialMediaLinks([
//   { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=123456789' },
//   { name: 'YouTube', url: 'https://www.youtube.com/watch?v=CR3BF1ZkT2Y' },
//   { name: 'Instagram', url: 'https://www.instagram.com/nasa/' },
//   { name: 'LinkedIn', url: 'https://www.linkedin.com/company/nasa/' }
// ]);
  }
  // ...existing code...

  /**
   * Assert Market & Logistics section
   */
  async assertMarketAndLogistics(details: {
    mainMarkets: string[],
  }) {
    for (const market of details.mainMarkets) {
      await expect(
        this.page.locator('#accordion-tab-MarketLogistics .tabs-form-group:has(label:has-text("Main Markets")) .t-f-g-txt')
      ).toContainText(market);
    }
  }

  /**
   * Assert Shipping & Payments section
   */
  async assertShippingAndPayments(details: {
    shippingMode: string,
    paymentMethod: string,
    paymentTerms: string,
    acceptedCurrencies: string[],
    deliveryTerms: string[]
  }) {
    await expect(
      this.page.locator('#accordion-tab-MarketLogistics .tabs-form-group:has(label:has-text("Shipping Mode")) .t-f-g-txt')
    ).toContainText(details.shippingMode);

    await expect(
      this.page.locator('#accordion-tab-MarketLogistics .tabs-form-group:has(label:has-text("Payment Method")) .t-f-g-txt')
    ).toContainText(details.paymentMethod);

    await expect(
      this.page.locator('#accordion-tab-MarketLogistics .tabs-form-group:has(label:has-text("Payment Terms")) .t-f-g-txt')
    ).toContainText(details.paymentTerms);

    for (const currency of details.acceptedCurrencies) {
      await expect(
        this.page.locator('#accordion-tab-MarketLogistics .tabs-form-group:has(label:has-text("Accepted Payment Currency")) .t-f-g-txt')
      ).toContainText(currency);
    }

    for (const term of details.deliveryTerms) {
      await expect(
        this.page.locator('#accordion-tab-MarketLogistics .tabs-form-group:has(label:has-text("Accepted Delivery Terms")) .t-f-g-txt')
      ).toContainText(term);
    }
  }

  /**
   * Assert Market & Logistics Additional Information section
   */
  async assertMarketLogisticsAdditionalInfo(details: {
    iecNumber: string,
    exportPercent: string,
    nearestPort: string,
    languagesSpoken: string[],
    averageLeadTime: string,
    minOrderValue: string
  }) {
    await expect(
      this.page.locator('#accordion-tab-MarketLogistics .tabs-form-group:has(label:has-text("IEC Number")) .t-f-g-txt')
    ).toContainText(details.iecNumber);

    await expect(
      this.page.locator('#accordion-tab-MarketLogistics .tabs-form-group:has(label:has-text("Export Percentage")) .t-f-g-txt')
    ).toContainText(details.exportPercent);

    await expect(
      this.page.locator('#accordion-tab-MarketLogistics .tabs-form-group:has(label:has-text("Nearest Port")) .t-f-g-txt')
    ).toContainText(details.nearestPort);

    for (const lang of details.languagesSpoken) {
      await expect(
        this.page.locator('#accordion-tab-MarketLogistics .tabs-form-group:has(label:has-text("Languages Spoken")) .t-f-g-txt')
      ).toContainText(lang);
    }

    await expect(
      this.page.locator('#accordion-tab-MarketLogistics .tabs-form-group:has(label:has-text("Average Lead Time")) .t-f-g-txt')
    ).toContainText(details.averageLeadTime);

    await expect(
      this.page.locator('#accordion-tab-MarketLogistics .tabs-form-group:has(label:has-text("Minimum Order Value")) .t-f-g-txt')
    ).toContainText(details.minOrderValue);
  }

  /**
   * Assert Manufacturing Terms section
   */
  async assertManufacturingTerms(details: {
    contractManufacturing: string[]
  }) {
    for (const term of details.contractManufacturing) {
      await expect(
        this.page.locator('#accordion-tab-FactoryWarehouseDetails .tabs-form-group:has(label:has-text("Contract Manufacturing")) .t-f-g-txt')
      ).toContainText(term);
    }
  }

  /**
   * Assert Manufacturing Additional Information section
   */
  async assertManufacturingAdditionalInfo(details: {
    factoryAddress?: string,
    warehouseAddress?: string,
    factoryArea?: string,
    warehouseArea?: string,
    certifications?: string[]
  }) {
    if (details.factoryAddress) {
      await expect(
        this.page.locator('#accordion-tab-FactoryWarehouseDetails .tabs-form-group:has(label:has-text("Factory Address")) .t-f-g-txt')
      ).toContainText(details.factoryAddress);
    }
    if (details.warehouseAddress) {
      await expect(
        this.page.locator('#accordion-tab-FactoryWarehouseDetails .tabs-form-group:has(label:has-text("Warehouse Address")) .t-f-g-txt')
      ).toContainText(details.warehouseAddress);
    }
    if (details.factoryArea) {
      await expect(
        this.page.locator('#accordion-tab-FactoryWarehouseDetails .tabs-form-group:has(label:has-text("Factory Area")) .t-f-g-txt')
      ).toContainText(details.factoryArea);
    }
    if (details.warehouseArea) {
      await expect(
        this.page.locator('#accordion-tab-FactoryWarehouseDetails .tabs-form-group:has(label:has-text("Warehouse Area")) .t-f-g-txt')
      ).toContainText(details.warehouseArea);
    }
    if (details.certifications) {
      for (const cert of details.certifications) {
        await expect(
          this.page.locator('#accordion-tab-FactoryWarehouseDetails .tabs-form-group:has(label:has-text("Certifications")) .t-f-g-txt')
        ).toContainText(cert);
      }
    }
  }
}
