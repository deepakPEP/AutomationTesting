import { expect, Locator, Page } from '@playwright/test';


// ---- Types (declare OUTSIDE the class) ----
// export type FileLike = string | { name?: string; mimeType?: string; buffer?: Buffer };

export type OwnBrand = { name: string; file?: string };
export type OtherBrand = { name: string; file?: string };
export type Award = { title: string; year?: string; file?: string };
export type Certificate = { title: string; file?: string };

export type AssetsData = {
  companyLogo?: string ; // string for URL, FileLike for upload
  videoFile?: string;          // optional: upload a local video file
  removeExistingVideo?: boolean; // click “Remove Video” if visible
  brochures?: string[];        // multiple files
  ownBrands?: string[];
  otherBrands?: string[];
  awards?: string[];
  certificates?: string[];
  facebook?: string;
  youtube?: string;
  instagram?: string;
  linkedin?: string;
  submit?: boolean;
};

export const dyn = {
  ownBrandName: (i: number) => `input[name="ownBrands.${i}.name"]`,
  ownBrandFileAt: (i: number) =>
    `.add-certifications-block-group:has(.a-f-b-subtxt:has-text("Own Brands"))
     .loop-block:nth-of-type(${i + 1}) input[type="file"].f-u-c-input`,

  otherBrandName: (i: number) => `input[name="otherBrands.${i}.name"]`,
  otherBrandFileAt: (i: number) =>
    `.add-certifications-block-group:has(.a-f-b-subtxt:has-text("Other brands"))
     .loop-block:nth-of-type(${i + 1}) input[type="file"].f-u-c-input`,

  awardTitle: (i: number) => `input[name="awards.${i}.name"]`,
  awardYear: (i: number) => `input[name="awards.${i}.year"]`,
  awardFileAt: (i: number) =>
    `.add-certifications-block-group:has(.a-f-b-subtxt:has-text("Awards"))
     .loop-block:nth-of-type(${i + 1}) input[type="file"].f-u-c-input`,

  certTitle: (i: number) => `input[name="certificates.${i}.name"]`,
  certFileAt: (i: number) =>
    `.add-certifications-block-group:has(.a-f-b-subtxt:has-text("Certificates"))
     .loop-block:nth-of-type(${i + 1}) input[type="file"].f-u-c-input`,
};

export class BrandingAndMediaPageCopy {
  readonly page: Page;

  // Logo
  readonly logoInput: Locator;

  // Video
  readonly videoInput: Locator;        // the <input type="file" accept="video/*">
  readonly removeVideoBtn: Locator;    // removes existing video

  // Brochures
  readonly addBrochureInput: Locator;

  // Own Brands (row 0)
  readonly ownBrandName: Locator;
  readonly ownBrandFile: Locator;
  readonly addOwnBrandBtn: Locator;

  // Other Brands (row 0)
  readonly otherBrandName: Locator;
  readonly otherBrandFile: Locator;
  readonly addOtherBrandBtn: Locator;

  // Awards (row 0)
  readonly awardTitle0: Locator;
  readonly awardYear0: Locator;
  readonly awardFile0: Locator;
  readonly addAwardBtn: Locator;

  // Certificates (row 0)
  readonly certTitle0: Locator;
  readonly certFile0: Locator;
  readonly addCertBtn: Locator;

  // Social
  readonly socialFacebook: Locator;
  readonly socialYoutube: Locator;
  readonly socialInstagram: Locator;
  readonly socialLinkedin: Locator;

  // Footer
  readonly saveBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    // Scope by section heading text to avoid duplicate #fileInput usage elsewhere
    this.logoInput = page.locator(
      '.forms-group:has(.a-f-b-subtxt:has-text("Company Logo")) input[type="file"].f-u-c-input'
    );

    // Actual video file input (from your last message)
    this.videoInput = page.locator('#fileInputVideo, input[type="file"][accept="video/*"]');
    this.removeVideoBtn = page.locator('.f-u-c-video .remove-img:has-text("Remove Video")');

    this.addBrochureInput = page.locator('label.add-image-small input#addImageSmall');

    // Own Brands (0)
    this.ownBrandName = page.locator('input[name="ownBrands.0.name"]');
    this.ownBrandFile = page.locator(
      '.add-certifications-block-group:has(.a-f-b-subtxt:has-text("Own Brands")) input[type="file"].f-u-c-input'
    );
    this.addOwnBrandBtn = page.locator(
      '.add-certifications-block-group:has(.a-f-b-subtxt:has-text("Own Brands")) button:has-text("Add Own Brands")'
    );

    // Other Brands (0)
    this.otherBrandName = page.locator('input[name="otherBrands.0.name"]');
    this.otherBrandFile = page.locator(
      '.add-certifications-block-group:has(.a-f-b-subtxt:has-text("Other brands")) input[type="file"].f-u-c-input'
    );
    this.addOtherBrandBtn = page.locator(
      '.add-certifications-block-group:has(.a-f-b-subtxt:has-text("Other brands")) button:has-text("Add Other Brands")'
    );

    // Awards (0)
    this.awardTitle0 = page.locator('input[name="awards.0.name"]');
    this.awardYear0 = page.locator('input[name="awards.0.year"]');
    this.awardFile0 = page.locator(
      '.add-certifications-block-group:has(.a-f-b-subtxt:has-text("Awards")) input[type="file"].f-u-c-input'
    );
    this.addAwardBtn = page.locator(
      '.add-certifications-block-group:has(.a-f-b-subtxt:has-text("Awards")) button:has-text("Add Awards")'
    );

    // Certificates (0)
    this.certTitle0 = page.locator('input[name="certificates.0.name"]');
    this.certFile0 = page.locator(
      '.add-certifications-block-group:has(.a-f-b-subtxt:has-text("Certificates")) input[type="file"].f-u-c-input'
    );
    this.addCertBtn = page.locator(
      '.add-certifications-block-group:has(.a-f-b-subtxt:has-text("Certificates")) button:has-text("Add Certificates")'
    );

    // Social
    this.socialFacebook = page.locator('input[name="socialMediaLinks.facebook"]');
    this.socialYoutube = page.locator('input[name="socialMediaLinks.youtube"]');
    this.socialInstagram = page.locator('input[name="socialMediaLinks.instagram"]');
    this.socialLinkedin = page.locator('input[name="socialMediaLinks.linkedin"]');

    // Footer
    this.saveBtn = page.locator('button[type="submit"]:has-text("Save")');
  }

  // Single entry-point to fill everything
  async fillProfileAssets(d: AssetsData) {
    // Logo
    if (d.companyLogo) {
      await this.logoInput.setInputFiles(d.companyLogo);
    }

    // Video
    if (d.removeExistingVideo && (await this.removeVideoBtn.isVisible())) {
      await this.removeVideoBtn.click();
    }
    if (d.videoFile) {
      await this.videoInput.setInputFiles(d.videoFile);
    }

    // Brochures
    if (d.brochures?.length) {
      await this.addBrochureInput.setInputFiles(d.brochures);
    }
    if (d.ownBrands?.length) {
    for (let i = 0; i < d.ownBrands.length; i++) {
      const name = d.ownBrands[i] ?? '';
      if (i > 0) await this.addOwnBrandBtn.click();
      await this.page.fill(dyn.ownBrandName(i), name);
      // no file upload because ownBrands is string[]
    }
  }

  // --- Other Brands (string[]) ---
  if (d.otherBrands?.length) {
    for (let i = 0; i < d.otherBrands.length; i++) {
      const name = d.otherBrands[i] ?? '';
      if (i > 0) await this.addOtherBrandBtn.click();
      await this.page.fill(dyn.otherBrandName(i), name);
      // no file upload because otherBrands is string[]
    }
  }

  // --- Awards (string[] => only title) ---
  if (d.awards?.length) {
    for (let i = 0; i < d.awards.length; i++) {
      const title = d.awards[i] ?? '';
      if (i > 0) await this.addAwardBtn.click();
      await this.page.fill(dyn.awardTitle(i), title);
      // no year/file because awards is string[]
    }
  }

  // --- Certificates (string[] => only title) ---
  if (d.certificates?.length) {
    for (let i = 0; i < d.certificates.length; i++) {
      const title = d.certificates[i] ?? '';
      if (i > 0) await this.addCertBtn.click();
      await this.page.fill(dyn.certTitle(i), title);
      // no file because certificates is string[]
    }
    }

    // Social links
    if (d.facebook)  await this.socialFacebook.fill(d.facebook);
    if (d.youtube)   await this.socialYoutube.fill(d.youtube);
    if (d.instagram) await this.socialInstagram.fill(d.instagram);
    if (d.linkedin)  await this.socialLinkedin.fill(d.linkedin);

    if (d.submit) {
      await this.saveBtn.click();
      // Replace with a real success toast/assertion if you have one
      await expect(this.saveBtn).toBeVisible();
    }
  }
}
