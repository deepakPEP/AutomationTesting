// src/pages/SellOfferSignInPage.ts
import { Page } from '@playwright/test';

export class SellOfferSignInPage {
  async goto() {
      await this.page.goto('https://sandbox.pepagora.org/en/authenticate');
      //await this.page.goto('https://sanity.pepagora.com/en/authenticate');
  }
  constructor(private page: Page) {}

  async gotoHomePage() {
    await this.page.goto('http://183.82.251.239:3000/en');
  }

  async signIn(phone: string) {
    await this.page.getByRole('link', { name: 'Sign In & Sign Up' }).click();
    await this.page.getByRole('textbox', { name: 'Enter phone number' }).fill(phone);
    await this.page.getByRole('button', { name: 'Continue with Phone' }).click();

    // Wait for the OTP input to appear after clicking continue
    await this.page.getByRole('textbox', { name: 'Enter OTP' }).waitFor({ state: 'visible' });
    // await this.page.getByRole('textbox', { name: 'Enter OTP' }).fill('123456'); // Replace with actual OTP if needed
    await this.page.getByRole('button', { name: 'Verify OTP' }).click();             
  }
}
    
    