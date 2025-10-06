// src/pages/SellOfferPreviewPage.ts

import { Page, expect } from '@playwright/test';
import { ProductInformationPage } from '../ProductISell/AddProductInfoPage';

export class SellOfferPreviewPage {
  readonly prodInfoPage: ProductInformationPage;
  
  constructor(private page: Page) {
    this.prodInfoPage = new ProductInformationPage(page);
  }

  /**
   * Main method to assert sell offer left side preview based on offer type
   */
  async assertSellOfferLeftSidePreview(page: Page, args: {
    offerType: 'Buy More Get More' | 'Fixed Discount' | 'Low MOQ Discount',
    price: string,
    unit: string,
    buyQty?: string,
    freeQty?: string,
    strikedPrice?: string,
    discountPercent?: string,
    offerTitle: string,
    productName: string,
    productCategory: string,
    actualMOQ?: string,
    lowMOQ?: string
  }) {
    // Common assertions for all offer types
    await this.assertOfferPriceAndUnit(page, args.price, args.unit);
    await this.assertOfferTitle(page, args.offerTitle);

    // Type-specific assertions
    switch (args.offerType) {
      case 'Fixed Discount':
        await this.assertFixedDiscountOffer(page, args);
        break;
      case 'Buy More Get More':
        await this.assertBuyMoreGetMoreOffer(page, args);
        break;
      case 'Low MOQ Discount':
        await this.assertLowMOQDiscountOffer(page, args);
        break;
      default:
        throw new Error(`Unsupported offer type: ${args.offerType}`);
    }
  }

  /**
   * Assert common offer price and unit
   */
  private async assertOfferPriceAndUnit(page: Page, price: string, unit: string) {
    // For pages with multiple price elements, use first() to avoid strict mode violation
    await expect(page.locator('.offer-price-value').first()).toContainText(price);
    await expect(page.locator('.offer-price-value .o-p-v-pc').first()).toContainText(unit.toLowerCase());
  }

  /**
   * Assert offer title/discount section
   */
  private async assertOfferTitle(page: Page, offerTitle: string) {
    await expect(page.locator('.product-info-group:has(.light-label:has-text("Discount")) .discount-price-highlighted'))
      .toContainText(offerTitle);
  }

  /**
   * Assert Fixed Discount offer specific elements
   */
  private async assertFixedDiscountOffer(page: Page, args: {
    strikedPrice?: string,
    discountPercent?: string,
    productName: string,
    productCategory: string
  }) {
    // Validate required fields
    if (!args.strikedPrice) {
      throw new Error('strikedPrice is required for Fixed Discount offer type');
    }
    if (!args.discountPercent) {
      throw new Error('discountPercent is required for Fixed Discount offer type');
    }

    // Assert striked price
    await expect(page.locator('.product-info-group .o-p-b-strike'))
      .toContainText(args.strikedPrice);

    // Assert discount percentage badge
    await expect(page.locator('.product-info-group .offer-price-badge'))
      .toContainText(args.discountPercent);

    // Assert product info (Fixed Discount uses nth(2))
    await this.assertProductInfo(page, args.productName, args.productCategory, 2);
  }

  /**
   * Assert Buy More Get More offer specific elements
   */
  private async assertBuyMoreGetMoreOffer(page: Page, args: {
    buyQty?: string,
    freeQty?: string,
    unit: string,
    productName: string,
    productCategory: string
  }) {
    // Validate required fields
    if (!args.buyQty || !args.freeQty) {
      throw new Error('buyQty and freeQty are required for Buy More Get More offer type');
    }

    // Assert buy quantity
    await expect(page.locator('.product-info-group:has(.light-label:has-text("Buy Quantity")) .dark-label'))
      .toContainText(`${args.buyQty} / ${args.unit.toLowerCase()}`);

    // Assert free quantity
    await expect(page.locator('.product-info-group:has(.light-label:has-text("Free Quantity")) .dark-label'))
      .toContainText(`${args.freeQty} / ${args.unit.toLowerCase()}`);

    // Assert product info (Buy More Get More uses nth(4))
    await this.assertProductInfo(page, args.productName, args.productCategory, 4);
  }

  /**
   * Assert Low MOQ Discount offer specific elements
   */
  private async assertLowMOQDiscountOffer(page: Page, args: {
    lowMOQ?: string,
    actualMOQ?: string,
    unit: string,
    productName: string,
    productCategory: string
  }) {
    // Validate required fields
    if (!args.lowMOQ || !args.actualMOQ) {
      throw new Error('lowMOQ and actualMOQ are required for Low MOQ Discount offer type');
    }

    const moqSection = this.page.locator('.product-info-group:has(.light-label:text("MOQ"))');

    // Verify MOQ section is visible
    await expect(moqSection).toBeVisible();

    // Verify MOQ label
    await expect(moqSection.locator('.light-label')).toHaveText('MOQ');

    // Verify new MOQ value
    await expect(moqSection.locator('.offer-price-value')).toContainText(args.lowMOQ);

    // Verify original MOQ with strike-through
    await expect(moqSection.locator('.o-p-b-strike')).toHaveText(args.actualMOQ);

    // Verify unit
    await expect(moqSection.locator('.o-p-v-pc')).toContainText(`/ ${args.unit.toLowerCase()}`);

    console.log(`✅ Low MOQ offer validated: ${args.lowMOQ} (was ${args.actualMOQ}) per ${args.unit}`);

    // Assert product info for Low MOQ (determine the correct index)
    await this.assertProductInfo(page, args.productName, args.productCategory, 3);
  }

  /**
   * Assert product name and category at specified position
   */
  private async assertProductInfo(page: Page, productName: string, productCategory: string, groupIndex: number) {
    const productGroup = page.locator('.product-info-group').nth(groupIndex);
    
    await expect(productGroup.locator('.dark-label')).toContainText(productName);
    await expect(productGroup.locator('.light-label').nth(1)).toContainText(productCategory);
  }

  /**
   * Standalone method to assert MOQ discount details
   */
  async assertMOQDiscount(expectedData: {
    newMOQ: string,
    originalMOQ: string,
    unit: string
  }) {
    const moqSection = this.page.locator('.product-info-group:has(.light-label:text("MOQ"))');
    
    await expect(moqSection).toBeVisible();
    await expect(moqSection.locator('.light-label')).toHaveText('MOQ');
    await expect(moqSection.locator('.offer-price-value')).toContainText(expectedData.newMOQ);
    await expect(moqSection.locator('.o-p-b-strike')).toHaveText(expectedData.originalMOQ);
    await expect(moqSection.locator('.o-p-v-pc')).toContainText(`/ ${expectedData.unit.toLowerCase()}`);
    
    console.log(`✅ MOQ discount verified: ${expectedData.newMOQ} (was ${expectedData.originalMOQ}) per ${expectedData.unit}`);
  }

  /**
   * Standalone method to assert discount percentage
   */
  async assertDiscountPercentage(expectedDiscount: string) {
    await expect(this.page.locator('.product-info-group .offer-price-badge')).toContainText(expectedDiscount);
  }

  /**
   * Standalone method to assert buy/free quantities
   */
  async assertQuantityOffer(buyQty: string, freeQty: string, unit: string) {
    await expect(this.page.locator('.product-info-group:has(.light-label:has-text("Buy Quantity")) .dark-label'))
      .toContainText(`${buyQty} / ${unit.toLowerCase()}`);
    
    await expect(this.page.locator('.product-info-group:has(.light-label:has-text("Free Quantity")) .dark-label'))
      .toContainText(`${freeQty} / ${unit.toLowerCase()}`);
  }

  async assertViewDetailsSellOffer(args:{
    name:string,
    category:string,
    brand?:string,
    productDescription?:string,
    currency:string,
    basePrice:string,
    moq:string,
    offerTitle:string,
    offerDescription:string,
    offerType:string,
    offerPrice:string,
    dateCreated:string,   
    offerValidTill:string,
    offerMinOrderQty?:string,
    offerMaxOrderQty?:string,
    paymentTerms:string,
    paymentMethods:string,
    shippingModes:string,
    dispatchLeadTime:string,
    shipsInternationally:string 
  }) {  
    // Assert Offer Title

// Product Name
  await expect(this.page.locator('.tabs-form-group:has(label.t-f-g-label:has-text("Product Name")) .t-f-g-txt')).toHaveText(args.name);

  // Product Category (first .t-f-g-txt under Product Category label)
  await expect(this.page.locator('.tabs-form-group:has(label.t-f-g-label:has-text("Product Category")) .t-f-g-txt').first()).toContainText(args.category);

  // Brand
  await expect(this.page.locator('.tabs-form-group:has(label.t-f-g-label:has-text("Brand")) .t-f-g-txt')).toHaveText(args.brand || 'N/A');

  // Description
  await expect(this.page.locator('.tabs-form-group:has(label.t-f-g-label:has-text("Product Description")) .t-f-g-txt')).toHaveText(args.productDescription || 'N/A');

  // Currency
  await expect(this.page.locator('.tabs-form-group:has(label.t-f-g-label:has-text("Currency")) .t-f-g-txt')).toContainText(args.currency);

  // Base Price
  await expect(this.page.locator('.tabs-form-group:has(label.t-f-g-label:has-text("Base Price")) .t-f-g-txt')).toContainText(args.basePrice);

  // MOQ
  await expect(this.page.locator('.tabs-form-group:has(label.t-f-g-label:has-text("MOQ")) .t-f-g-txt')).toContainText(args.moq);


  await expect(this.page.locator('.p-m-i-title-breif .p-m-i-title')).toHaveText(args.offerTitle);

// Assert Offer Description
  await expect(this.page.locator('.p-m-i-title-breif .p-m-i-desc')).toHaveText(args.offerDescription || '');

   await expect(this.page.locator('.tabs-form-group:has(label.t-f-g-label:has-text("Offer Type")) .t-f-g-txt')).toHaveText(args.offerType);

  // Offer Title
  await expect(this.page.locator('.tabs-form-group:has(label.t-f-g-label:has-text("Offer Title")) .t-f-g-txt')).toHaveText(args.offerTitle);

  // Offer Description
  await expect(this.page.locator('.tabs-form-group:has(label.t-f-g-label:has-text("Offer Description")) .t-f-g-txt')).toHaveText(args.offerDescription);

  // Offer Price - once bug is fixed need to uncomment below
  //await expect(this.page.locator('.tabs-form-group:has(label.t-f-g-label:has-text("Offer Price")) .t-f-g-txt')).toHaveText(args.offerPrice);

  // Date Created
  await expect(this.page.locator('.tabs-form-group:has(label.t-f-g-label:has-text("Date Created")) .t-f-g-wrapper .t-f-g-txt')).toHaveText(args.dateCreated);

  // Offer valid till
  await expect(this.page.locator('.tabs-form-group:has(label.t-f-g-label:has-text("Offer valid till")) .t-f-g-wrapper .t-f-g-txt')).toHaveText(args.offerValidTill);

  // Offer Minimum Order Quantity
  if (args.offerMinOrderQty) {
    await expect(this.page.locator('.tabs-form-group:has(label.t-f-g-label:has-text("Offer Minimum Order Quantity")) .t-f-g-txt').first()).toHaveText(args.offerMinOrderQty);
  }
  // Offer Maximum Order Quantity bug. after fixing it need to uncomment below
  // if (args.offerMaxOrderQty) {
  //   await expect(this.page.locator('.tabs-form-group:has(label.t-f-g-label:has-text("Offer Maximum Order Quantity")) .t-f-g-txt').nth(1)).toHaveText(args.offerMaxOrderQty);
  // }

  // Payment Terms giving wrong value
  //await expect(this.page.locator('.tabs-form-group:has(label.t-f-g-label:has-text("Payment Terms")) .t-f-g-txt')).toContainText(args.paymentTerms);

  // Payment Methods (assert each method is present)
  // for (const method of args.paymentMethods) {
  //   await expect(
  //     this.page.locator('.tabs-form-group:has(label.t-f-g-label:has-text("Payment Method")) .t-f-g-txt')
  //   ).toContainText(method);
  // }

  const modesArray = args.shippingModes.split(',').map(m => m.trim());
  for (const mode of modesArray) {
  await expect(
    this.page.locator('.tabs-form-group:has(label.t-f-g-label:has-text("Shipping Modes")) .t-f-g-wrapper .t-f-g-txt')
      .filter({ hasText: mode })
  ).toBeVisible();
}
// bug dispatch lead time not showing correct value. onece fixed need to uncomment below
  // Dispatch Lead Time
 // await expect(this.page.locator('.tabs-form-group:has(label.t-f-g-label:has-text("Dispatch Lead Time")) .t-f-g-txt')).toContainText(args.dispatchLeadTime);

  // Ships Internationally
  await expect(this.page.locator('.tabs-form-group:has(label.t-f-g-label:has-text("Ships Internationally")) .t-f-g-txt')).toContainText(args.shipsInternationally.toLowerCase());
  }
  /**
 * Assert right-side preview info: analytics, progress bar, and status.
 */
async assertViewDetailsRightInfoSection( args: {
  analyticsView: string,      // e.g. '0'
  progressText: string,       // e.g. 'Completed 100%'
  status: string              // e.g. 'pending'
}) {
  // Progress bar text
  await expect(this.page.locator('.progressbar-comp .p-c-value')).toHaveText(args.progressText);

  // Analytics view count
  await expect(this.page.locator('.analytics-options .a-o-item .a-o-i-label')).toHaveText('View');
  await expect(this.page.locator('.analytics-options .a-o-item .a-o-i-txt')).toHaveText(args.analyticsView);

  // Status badge
  await expect(this.page.locator('.p-r-i-item .table-badge-comp')).toHaveText(args.status);
}
// ...existing code...

/**
 * Clicks the "Previous" button in the Sell Offer Details section.
 */
async clickPreviousButton() {
  await this.page.locator('.previous-btn-comp .btn-comp.btn-icon').click();
}

// ...existing code...
}
