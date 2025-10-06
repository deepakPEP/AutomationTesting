import { Locator, Page } from "playwright-core";
import { expect } from "@playwright/test";
import path from "path";

export class AddProdAdditionalInformationPage {
  readonly page: Page;

  readonly toggleCustomizationAvailability: Locator;
  readonly specifyCustomizationDetails: Locator;
  readonly productKeywords: Locator;
  readonly brandName : Locator;
  readonly pasteVideoURL: Locator;
  readonly faqQuestion: Locator;
  readonly faqAnswer: Locator;
  readonly keywordInput: Locator;
  readonly productGroupDropdown: Locator;
  readonly productGroupOption: (optionText: string) => Locator;
  readonly certificateTitleInput: Locator;  
  readonly certificateFileInput: Locator;
  readonly faqQuestionInput: (index: number) => Locator;
  readonly faqAnswerInput: (index: number) => Locator;
  readonly addFAQButton: Locator;
  readonly uploadButton: Locator;
  readonly pasteVideoURLInput: Locator;
  
  
  constructor(page: Page) {
    this.page = page;

    this.toggleCustomizationAvailability = this.page.locator('#isCustomizable');
    this.keywordInput = page.locator('input[placeholder="Enter keywords or pick suggestions"]');
    this.specifyCustomizationDetails = this.page.locator('input[name="isCustomizable"]');
    this.productKeywords = this.page.locator('input[placeholder="Enter keywords or pick suggestions"]');
    this.brandName = this.page.locator('input[placeholder="Enter Brand Name"]');
    
    this.productGroupDropdown = page.locator('.p-dropdown-trigger');
    this.productGroupOption = (optionText: string) =>
      page.getByRole('option', { name: optionText });

    this.certificateTitleInput = page.locator('input[name="certificates.0.name"]');
     this.certificateFileInput = page.locator('input#fileInput');

     this.faqQuestionInput = (index: number) =>
      page.locator(`input[name="faqs.${index}.question"]`);
    this.faqAnswerInput = (index: number) =>
      page.locator(`textarea[name="faqs.${index}.answer"]`);

    this.addFAQButton = page.getByRole('button', { name: 'Add FAQ' });
    
    this.uploadButton = page.locator('.btn-wrapper label.choose-file-btn');
    this.pasteVideoURLInput = page.locator('input[placeholder="Paste YouTube video URL"]');
    this.pasteVideoURL = this.page.locator('.btn-wrapper span.choose-file-btn');
    this.faqQuestion = this.page.locator('input[placeholder="Enter a Question"]');
    this.faqAnswer = this.page.locator('textarea[placeholder="Enter a relevant answer"]');
  }
  

  async fillAdditionalInformation(args:
    | { isCustomizable: true; customizationDetails: string; brandName: string }
    | { isCustomizable: false; brandName: string }) {
    // Toggle customization availability
    if (args.isCustomizable) {
      await this.toggleCustomizationAvailability.check();
      await this.specifyCustomizationDetails.fill(args.customizationDetails);
    }
    //await this.productKeywords.fill(keywords.join(', '));
    await this.brandName.fill(args.brandName);
    await this.page.waitForTimeout(7000);
    // as of now not handling keywords, prdouct group (bug not having add group)
    // const itemText = productGroup;
    // // Wait for the dropdown to appear and then select the item based on the text
    // await this.productGroupDropdown.click();
    // await this.productGroupOption(itemText).click();
    
    // Click the 'Choose from your computer' button
    await this.pasteVideoURL.click();
    await this.pasteVideoURLInput.fill('https://www.youtube.com/shorts/eBT4hQscYog'); // Example YouTube URL
    await this.page.waitForTimeout(7000); // Wait for the URL to be processed
    const filePath = path.resolve(__dirname, '../../data/4-mb-example-file.pdf');
    console.log('File path:', filePath);
    await this.addCertificate('Certification Title', filePath);
    await this.addFAQ(0, 'What is the warranty period?', 'The warranty period is 2 years.');
  }
  async enableCustomization() {
    await this.toggleCustomizationAvailability.check();
  }
  async setBrandName(brand: string) {
    await this.brandName.fill(brand);
  }
   async addCertificate(title: string, filePath: string) {
    await this.certificateTitleInput.fill(title);
    await this.page.waitForTimeout(8000);
    await this.page.locator("//span[text()='Choose File']").click();
    await this.certificateFileInput.setInputFiles(filePath);
    await this.page.waitForTimeout(30000); // Wait for the file to be uploaded
    
    // Verify the uploaded file is present
    // ✅ CORRECT - Create a Locator first, then use expect()
const uploadedFileSelector = '.b-d-b-filename';
const uploadedFile = this.page.locator(uploadedFileSelector);
await expect(uploadedFile).toBeVisible({ timeout: 15000 });
  }
    
  async addFAQ(index: number, question: string, answer: string) {
    await this.faqQuestionInput(index).fill(question);
    await this.faqAnswerInput(index).fill(answer);
  }

  async clickAddFAQ() {
    await this.addFAQButton.click();
  }
}