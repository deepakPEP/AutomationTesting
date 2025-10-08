// src/utils/CurrencySelector.ts

import { Page, Locator } from '@playwright/test';

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
  displayText: string;
}

/**
 * Currency selector utility for handling currency dropdown selections
 */
export class CurrencySelector {
  private page: Page;

  // Predefined currency mappings
  static readonly currencies: Record<string, CurrencyOption> = {
    'AED': { code: 'AED', symbol: 'د.إ', name: 'United Arab Emirates Dirham', displayText: 'د.إ - AED' },
    'INR': { code: 'INR', symbol: '₹', name: 'Indian Rupee', displayText: '₹ - INR' },
    'USD': { code: 'USD', symbol: '$', name: 'United States Dollar', displayText: '$ - USD' },
    'EUR': { code: 'EUR', symbol: '€', name: 'Euro', displayText: '€ - EUR' },
    'GBP': { code: 'GBP', symbol: '£', name: 'British Pound', displayText: '£ - GBP' },
    'JPY': { code: 'JPY', symbol: '¥', name: 'Japanese Yen', displayText: '¥ - JPY' }
  };

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Select currency by currency code (e.g., 'INR', 'USD')
   * @param currencyCode - Currency code to select
   */
  async selectCurrencyByCode(currencyCode: string): Promise<void> {
    const currency = CurrencySelector.currencies[currencyCode.toUpperCase()];
    if (!currency) {
      throw new Error(`Unsupported currency code: ${currencyCode}`);
    }

    console.log(`💰 Selecting currency: ${currency.displayText}`);
    
    // Click dropdown to open
    await this.openCurrencyDropdown();
    
    // Select by currency code or display text
    await this.page.locator(
      `.p-dropdown-item:has(.p-dropdown-item-label:has-text("${currency.displayText}"))`
    ).click();
    await this.page.waitForTimeout(1000); // Wait for selection to register
    console.log(`✅ Currency selected: ${currency.displayText}`);
  }

  /**
   * Select currency by symbol (e.g., '₹', '$')
   * @param symbol - Currency symbol to select
   */
  async selectCurrencyBySymbol(symbol: string): Promise<void> {
    const currency = Object.values(CurrencySelector.currencies)
      .find(curr => curr.symbol === symbol);
    
    if (!currency) {
      throw new Error(`Unsupported currency symbol: ${symbol}`);
    }

    await this.selectCurrencyByCode(currency.code);
  }

  /**
   * Select currency by display text (e.g., '₹ - INR')
   * @param displayText - Full display text to select
   */
  async selectCurrencyByDisplayText(displayText: string): Promise<void> {
    console.log(`💰 Selecting currency by display text: ${displayText}`);
    
    await this.openCurrencyDropdown();
    
    await this.page.locator(
      `.p-dropdown-item:has(.p-dropdown-item-label:has-text("${displayText}"))`
    ).click();
    
    console.log(`✅ Currency selected: ${displayText}`);
  }

  /**
   * Select currency by aria-label (e.g., 'Indian Rupee')
   * @param ariaLabel - Aria label to select by
   */
  async selectCurrencyByAriaLabel(ariaLabel: string): Promise<void> {
    console.log(`💰 Selecting currency by aria-label: ${ariaLabel}`);
    
    await this.openCurrencyDropdown();
    
    await this.page.locator(
      `.p-dropdown-item[aria-label="${ariaLabel}"]`
    ).click();
    
    console.log(`✅ Currency selected: ${ariaLabel}`);
  }

  /**
   * Open the currency dropdown
   */
  private async openCurrencyDropdown(): Promise<void> {
    await this.page.locator('.p-dropdown-trigger[aria-label="Select Currency"]').click();
    await this.page.waitForTimeout(2000); // Wait for dropdown animation
  }

  /**
   * Get all available currencies from the dropdown
   */
  async getAvailableCurrencies(): Promise<string[]> {
    await this.openCurrencyDropdown();
    
    const currencyLabels = await this.page.locator('.p-dropdown-item-label').allTextContents();
    
    // Close dropdown
    await this.page.keyboard.press('Escape');
    
    return currencyLabels;
  }

  /**
   * Get currently selected currency
   */
  async getSelectedCurrency(): Promise<string> {
    // Look for the selected value in the dropdown trigger area
    const selectedValue = await this.page.locator('.p-dropdown-label').textContent();
    return selectedValue?.trim() || '';
  }

  /**
   * Verify currency is selected
   * @param expectedCurrency - Expected currency code, symbol, or display text
   */
  async verifyCurrencySelected(expectedCurrency: string): Promise<void> {
    const selectedCurrency = await this.getSelectedCurrency();
    
    // Check if it matches by code, symbol, or display text
    const currency = CurrencySelector.currencies[expectedCurrency.toUpperCase()];
    
    if (currency) {
      const isMatch = selectedCurrency.includes(currency.symbol) || 
                     selectedCurrency.includes(currency.code) ||
                     selectedCurrency === currency.displayText;
      
      if (!isMatch) {
        throw new Error(`Expected currency ${currency.displayText}, but got ${selectedCurrency}`);
      }
    } else {
      // Direct text comparison
      if (!selectedCurrency.includes(expectedCurrency)) {
        throw new Error(`Expected currency containing ${expectedCurrency}, but got ${selectedCurrency}`);
      }
    }
    
    console.log(`✅ Currency verification passed: ${selectedCurrency}`);
  }
}

/**
 * Standalone functions for quick currency selection
 */

export async function selectCurrency(page: Page, currency: string): Promise<void> {
  const selector = new CurrencySelector(page);
  
  // Auto-detect selection method based on input
  if (currency.length === 3 && currency.toUpperCase() === currency) {
    // Looks like currency code (INR, USD, etc.)
    await selector.selectCurrencyByCode(currency);
  } else if (currency.length <= 2) {
    // Looks like symbol (₹, $, etc.)
    await selector.selectCurrencyBySymbol(currency);
  } else {
    // Looks like display text or aria-label
    await selector.selectCurrencyByDisplayText(currency);
  }
}

export async function selectINR(page: Page): Promise<void> {
  const selector = new CurrencySelector(page);
  await selector.selectCurrencyByCode('INR');
}

export async function selectUSD(page: Page): Promise<void> {
  const selector = new CurrencySelector(page);
  await selector.selectCurrencyByCode('USD');
}

export async function selectEUR(page: Page): Promise<void> {
  const selector = new CurrencySelector(page);
  await selector.selectCurrencyByCode('EUR');
}