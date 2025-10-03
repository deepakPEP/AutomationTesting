import { Locator, Page } from "playwright-core";
import { expect } from "@playwright/test";

export class PricingMOQPage {
  readonly page: Page;
  readonly logoInput: Locator;
  readonly videoInput: Locator;
  readonly addBrochureInput: Locator;
  readonly ownBrandName: Locator;
  readonly ownBrandFile: Locator;
  readonly addOwnBrandBtn: Locator;
  readonly otherBrandName: Locator;
  readonly otherBrandFile: Locator
  readonly addOtherBrandBtn: Locator;
  readonly awardTitle0: Locator

  readonly awardYear0: Locator;
  readonly awardFile0: Locator
  readonly addAwardBtn: Locator;
  readonly certTitle0: Locator;
  readonly certFile0: Locator
  readonly addCertBtn: Locator;
  readonly socialFacebook: Locator
  readonly socialYoutube: Locator;
  readonly socialInstagram: Locator
  readonly socialLinkedin: Locator;
  
    constructor(page: Page) {
    this.page = page;

    this.logoInput=this.page.locator('label:has(.f-u-c-c-txt:has-text("Drag")) input[type="file"].f-u-c-input');

  // ---- Company Video (YouTube iframe preview already present) ----
  // (Usually you’ll paste a URL into a text box—if you have one. If not, remove/replace.)
  // Example (adjust if your UI has a URL input):
  // companyVideoUrl: 'input[name="companyVideoUrl"]',
  this.videoInput=this.page.locator('.f-u-c-video .remove-img:has-text("Remove Video")');

  // ---- Company Brochures ----
  this.addBrochureInput=this.page.locator('label.add-image-small input#addImageSmall');   // accepts multiple

  // ---- Own Brands (0th row) ----
  this.ownBrandName = this.page.locator('input[name="ownBrands.0.name"]');
  this.ownBrandFile = this.page.locator('.add-certifications-block-group:has(.a-f-b-subtxt:has-text("Own Brands")) input[type="file"].f-u-c-input');
  this.addOwnBrandBtn = this.page.locator('.add-certifications-block-group:has(.a-f-b-subtxt:has-text("Own Brands")) button:has-text("Add Own Brands")');

  // ---- Other Brands (0th row) ----
  this.otherBrandName = this.page.locator('input[name="otherBrands.0.name"]');
  this.otherBrandFile = this.page.locator('.add-certifications-block-group:has(.a-f-b-subtxt:has-text("Other brands")) input[type="file"].f-u-c-input');
  this.addOtherBrandBtn = this.page.locator('.add-certifications-block-group:has(.a-f-b-subtxt:has-text("Other brands")) button:has-text("Add Other Brands")');

  // ---- Awards & Recognition (0th row) ----
  this.awardTitle0 = this.page.locator('input[name="awards.0.name"]');
  this.awardYear0 = this.page.locator('input[name="awards.0.year"]');
  this.awardFile0 = this.page.locator('.add-certifications-block-group:has(.a-f-b-subtxt:has-text("Awards")) input[type="file"].f-u-c-input');
  this.addAwardBtn = this.page.locator('.add-certifications-block-group:has(.a-f-b-subtxt:has-text("Awards")) button:has-text("Add Awards")');

  // ---- Certificates & Quality Standards (0th row) ----
  this.certTitle0 = this.page.locator('input[name="certificates.0.name"]');
  this.certFile0 =  this.page.locator('.add-certifications-block-group:has(.a-f-b-subtxt:has-text("Certificates")) input[type="file"].f-u-c-input');
  this.addCertBtn =  this.page.locator('.add-certifications-block-group:has(.a-f-b-subtxt:has-text("Certificates")) button:has-text("Add Certificates")');

  // ---- Social Media Links ----
  this.socialFacebook = this.page.locator('input[name="socialMediaLinks.facebook"]');
  this.socialYoutube =  this.page.locator('input[name="socialMediaLinks.youtube"]');
  this.socialInstagram = this.page.locator('input[name="socialMediaLinks.instagram"]');
  this.socialLinkedin = this.page.locator('input[name="socialMediaLinks.linkedin"]');


    
    }
    type FileLike = string | { name?: string; mimeType?: string; buffer?: Buffer };

type OwnBrand = { name: string; file?: FileLike };
type OtherBrand = { name: string; file?: FileLike };
type Award = { title: string; year?: string; file?: FileLike };
type Certificate = { title: string; file?: FileLike };

type AssetsData = {
  // Company Logo
  companyLogo?: FileLike;

  // Company Video
  videoUrl?: string;   // if you have a URL input; otherwise omit
  removeExistingVideo?: boolean;

  // Brochures (accepts multiple)
  brochures?: FileLike[];

  // Brands / Awards / Certificates
  ownBrands?: OwnBrand[];
  otherBrands?: OtherBrand[];
  awards?: Award[];
  certificates?: Certificate[];

  // Social links
  facebook?: string;
  youtube?: string;
  instagram?: string;
  linkedin?: string;

  // Submit or not
  submit?: boolean;
};

 async  fillProfileAssets(page: Page, d: AssetsData) {
  // --- Logo upload ---
  if (d.companyLogo) {
    await page.setInputFiles(L.logoInput, d.companyLogo);
  }

  // --- Video ---
  if (d.removeExistingVideo) {
    if (await page.locator(L.removeVideoBtn).isVisible().catch(() => false)) {
      await page.click(L.removeVideoBtn);
    }
  }
  // If you have a video URL input, uncomment / adjust:
  // if (d.videoUrl) {
  //   await page.fill(L.companyVideoUrl, d.videoUrl);
  // }

  // --- Brochures (multi) ---
  if (d.brochures?.length) {
    await page.setInputFiles(L.addBrochureInput, d.brochures);
  }

  // --- Own Brands ---
  if (d.ownBrands?.length) {
    for (let i = 0; i < d.ownBrands.length; i++) {
      const { name, file } = d.ownBrands[i];
      // For i > 0, click "Add Own Brands" to create the next row
      if (i > 0) await page.click(L.addOwnBrandBtn);
      await page.fill(dyn.ownBrandName(i), name ?? '');
      if (file) {
        await page.setInputFiles(dyn.ownBrandFileAt(i), file);
      }
    }
  }

  // --- Other Brands ---
  if (d.otherBrands?.length) {
    for (let i = 0; i < d.otherBrands.length; i++) {
      const { name, file } = d.otherBrands[i];
      if (i > 0) await page.click(L.addOtherBrandBtn);
      await page.fill(dyn.otherBrandName(i), name ?? '');
      if (file) {
        await page.setInputFiles(dyn.otherBrandFileAt(i), file);
      }
    }
  }

  // --- Awards ---
  if (d.awards?.length) {
    for (let i = 0; i < d.awards.length; i++) {
      const { title, year, file } = d.awards[i];
      if (i > 0) await page.click(L.addAwardBtn);
      await page.fill(dyn.awardTitle(i), title ?? '');
      if (year) await page.fill(dyn.awardYear(i), year);
      if (file) await page.setInputFiles(dyn.awardFileAt(i), file);
    }
  }

  // --- Certificates ---
  if (d.certificates?.length) {
    for (let i = 0; i < d.certificates.length; i++) {
      const { title, file } = d.certificates[i];
      if (i > 0) await page.click(L.addCertBtn);
      await page.fill(dyn.certTitle(i), title ?? '');
      if (file) await page.setInputFiles(dyn.certFileAt(i), file);
    }
  }

  // --- Social links ---
  if (d.facebook)  await page.fill(L.socialFacebook, d.facebook);
  if (d.youtube)   await page.fill(L.socialYoutube, d.youtube);
  if (d.instagram) await page.fill(L.socialInstagram, d.instagram);
  if (d.linkedin)  await page.fill(L.socialLinkedin, d.linkedin);

  // --- Submit (optional) ---
  if (d.submit) {
    await page.click(L.saveBtn);
    await expect(page.locator(L.saveBtn)).toBeVisible(); // sanity wait; replace with your own success check
  }
    }
    export const dyn = {
  ownBrandName: (i: number) => `input[name="ownBrands.${i}.name"]`,
  ownBrandFileAt: (i: number) =>
    `.add-certifications-block-group:has(.a-f-b-subtxt:has-text("Own Brands")) .loop-block:nth-of-type(${i + 1}) input[type="file"].f-u-c-input`,

  otherBrandName: (i: number) => `input[name="otherBrands.${i}.name"]`,
  otherBrandFileAt: (i: number) =>
    `.add-certifications-block-group:has(.a-f-b-subtxt:has-text("Other brands")) .loop-block:nth-of-type(${i + 1}) input[type="file"].f-u-c-input`,

  awardTitle: (i: number) => `input[name="awards.${i}.name"]`,
  awardYear: (i: number) => `input[name="awards.${i}.year"]`,
  awardFileAt: (i: number) =>
    `.add-certifications-block-group:has(.a-f-b-subtxt:has-text("Awards")) .loop-block:nth-of-type(${i + 1}) input[type="file"].f-u-c-input`,

  certTitle: (i: number) => `input[name="certificates.${i}.name"]`,
  certFileAt: (i: number) =>
    `.add-certifications-block-group:has(.a-f-b-subtxt:has-text("Certificates")) .loop-block:nth-of-type(${i + 1}) input[type="file"].f-u-c-input`,
};
