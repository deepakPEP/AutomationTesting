import { Page } from '@playwright/test';

export class FormHelper {
  constructor(private page: Page) {}

  async fillTextField(selector: string, value: string) {
    if (value) {
      await this.page.fill(selector, value);
    }
  }

  async selectDropdown(selector: string, value: string) {
    if (value) {
      await this.page.selectOption(selector, value);
    }
  }

  async clickRadio(name: string, value: string) {
    if (value) {
      await this.page.click(`input[type="radio"][name="${name}"][value="${value}"]`);
    }
  }

  async checkCheckbox(name: string, values: string[]) {
    for (const val of values) {
      await this.page.check(`input[type="checkbox"][name="${name}"][value="${val}"]`);
    }
  }

  async uploadFile(selector: string, filePath: string) {
    await this.page.setInputFiles(selector, filePath);
  }

  async fillCompositeField(baseSelector: string, data: { value: number, unit: string, duration?: string }) {
    await this.page.fill(`${baseSelector} .value`, data.value.toString());
    await this.page.selectOption(`${baseSelector} .unit`, data.unit);
    if (data.duration) {
      await this.page.selectOption(`${baseSelector} .duration`, data.duration);
    }
  }

  async fillMultiLevelCategory(categoryArray: string[]) {
    await this.selectDropdown('#category-main', categoryArray[0]);
    await this.selectDropdown('#category-sub', categoryArray[1]);
    await this.selectDropdown('#category-leaf', categoryArray[2]);
  }

  async handleSampleAvailability(type: string, price?: { value: number; unit: string }) {
    await this.selectDropdown('#sample-availability', type);
    if (type === 'Paid' && price) {
      await this.fillTextField('#sample-price', price.value.toString());
      await this.selectDropdown('#sample-unit', price.unit);
    }
  }
}
