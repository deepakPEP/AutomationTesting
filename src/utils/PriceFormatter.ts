// src/utils/PriceFormatter.ts

/**
 * Utility functions for handling price formatting in tests
 */
export class PriceFormatter {
  
  /**
   * Format a price number to the display format used in the application
   * @param price - Raw price as string or number (e.g., "1000" or 1000)
   * @param currency - Currency symbol (default: "₹")
   * @param includeUnit - Whether to include "/ per Unit" suffix
   * @returns Formatted price string (e.g., "₹ 1,000 / per Unit")
   */
  static formatDisplayPrice(
    price: string | number, 
    currency: string = "₹", 
    includeUnit: boolean = true
  ): string {
    const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^\d.]/g, '')) : price;
    
    if (isNaN(numPrice)) {
      throw new Error(`Invalid price: ${price}`);
    }

    // Format with commas for thousands
    const formattedNumber = numPrice.toLocaleString('en-IN');
    
    // Build the formatted price
    let formatted = `${currency} ${formattedNumber}`;
    
    if (includeUnit) {
      formatted += ' / per Unit';
    }
    
    return formatted;
  }

  /**
   * Format price for table/dashboard display
   * @param price - Raw price
   * @param currency - Currency symbol
   * @returns Formatted price for dashboard (e.g., "₹ 1,000 / per Unit")
   */
  static formatTablePrice(price: string | number, currency: string = "₹"): string {
    return this.formatDisplayPrice(price, currency, true);
  }

  /**
   * Extract numeric value from formatted price string
   * @param formattedPrice - Formatted price (e.g., "₹ 1,000 / per Unit")
   * @returns Numeric value (e.g., 1000)
   */
  static extractNumericPrice(formattedPrice: string): number {
    const numericString = formattedPrice.replace(/[^\d.]/g, '');
    return parseFloat(numericString);
  }

  /**
   * Compare two prices (handles formatted vs raw prices)
   * @param expected - Expected price (raw or formatted)
   * @param actual - Actual price (raw or formatted)
   * @returns True if prices match
   */
  static comparePrices(expected: string | number, actual: string): boolean {
    const expectedNum = typeof expected === 'string' ? 
      this.extractNumericPrice(expected) : expected;
    const actualNum = this.extractNumericPrice(actual);
    
    return expectedNum === actualNum;
  }

  /**
   * Format price for different contexts
   */
  static formatters = {
    // For dashboard/table display: "₹ 1,000 / per Unit"
    dashboard: (price: string | number) => this.formatTablePrice(price),
    
    // For preview display: "₹ 1,000"
    preview: (price: string | number) => this.formatDisplayPrice(price, "₹", false),
    
    // For simple display: "1,000"
    simple: (price: string | number) => {
      const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^\d.]/g, '')) : price;
      return numPrice.toLocaleString('en-IN');
    },
    
    // For API/raw: "1000"
    raw: (price: string | number) => {
      const numPrice = typeof price === 'string' ? this.extractNumericPrice(price) : price;
      return numPrice.toString();
    }
  };
}

/**
 * Quick utility functions for common price operations
 */

export function formatDashboardPrice(price: string | number,currency: string = "₹"): string {
  return PriceFormatter.formatTablePrice(price, currency);
}

export function formatPreviewPrice(price: string | number): string {
  return PriceFormatter.formatDisplayPrice(price, "₹", false);
}

export function extractPrice(formattedPrice: string): number {
  return PriceFormatter.extractNumericPrice(formattedPrice);
}

export function comparePrices(expected: string | number, actual: string): boolean {
  return PriceFormatter.comparePrices(expected, actual);
}

/**
 * Create flexible price matcher for Playwright assertions
 * @param expectedPrice - Expected price value
 * @returns RegExp pattern that matches various price formats
 */
export function createPriceMatcher(expectedPrice: string | number): RegExp {
  const numPrice = typeof expectedPrice === 'string' ? 
    PriceFormatter.extractNumericPrice(expectedPrice) : expectedPrice;
  
  const formattedPrice = numPrice.toLocaleString('en-IN');
  
  // Creates a regex that matches: ₹ 1,000 or ₹  1,000 or ₹1,000 (with optional spaces and "/ per Unit")
  return new RegExp(`₹\\s*${formattedPrice.replace(/,/g, ',?')}(?:\\s*/\\s*per\\s+Unit)?`, 'i');
}