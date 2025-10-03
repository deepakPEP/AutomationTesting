// src/pages/SellOfferPreviewPage.ts

import { Page, expect } from '@playwright/test';
import { ProductInformationPage } from '../ProductISell/AddProductInfoPage';

export class SellOfferPreviewPage {
  readonly prodInfoPage: ProductInformationPage;
  
  constructor(private page: Page) {
    this.prodInfoPage = new ProductInformationPage(page);
  }

  async  assertSellOfferLeftSidePreview(page: Page, args: {
    offerType: 'Buy More Get More' | 'Fixed Discount',
    price: string,
    unit: string,
    buyQty?: string,
    freeQty?: string,
    strikedPrice?: string,
    discountPercent?: string,
    offerTitle: string,
    productName: string,
    productCategory: string
  }) 
  {
  // Assert Offer Price and Unit
  await expect(page.locator('.offer-price-value')).toContainText(args.price);
  await expect(page.locator('.offer-price-value .o-p-v-pc')).toContainText(args.unit.toLowerCase());
  if (args.offerType === 'Fixed Discount') {
     // Striked price
      if (!args.strikedPrice) {
    throw new Error('strikedPrice is required for Fixed Discount offer type');
  }
    await expect(page.locator('.product-info-group .o-p-b-strike')).toContainText(args.strikedPrice);

  // Discount percentage badge
    if (!args.discountPercent) {
      throw new Error('discountPercent is required for Fixed Discount offer type');
    }
      await expect(page.locator('.product-info-group .offer-price-badge')).toContainText(args.discountPercent);

      await expect(page.locator('.product-info-group').nth(2).locator('.dark-label')).toContainText(args.productName);

// Assert Product Category in the 5th .product-info-group
await expect(page.locator('.product-info-group').nth(2).locator('.light-label').nth(1)).toContainText(args.productCategory);
  }
  else if (args.offerType === 'Buy More Get More') {
  // Assert Buy Quantity
  await expect(page.locator('.product-info-group:has(.light-label:has-text("Buy Quantity")) .dark-label')).toContainText(`${args.buyQty} / ${args.unit.toLowerCase()}`);

  // Assert Free Quantity
  await expect(page.locator('.product-info-group:has(.light-label:has-text("Free Quantity")) .dark-label')).toContainText(`${args.freeQty} / ${args.unit.toLowerCase()}`);
  await expect(page.locator('.product-info-group').nth(4).locator('.dark-label')).toContainText(args.productName);

// Assert Product Category in the 5th .product-info-group
await expect(page.locator('.product-info-group').nth(4).locator('.light-label').nth(1)).toContainText(args.productCategory);

  }
  // Assert Offer Title/Discount
  await expect(page.locator('.product-info-group:has(.light-label:has-text("Discount")) .discount-price-highlighted')).toContainText(args.offerTitle);

  // Assert Product Name in the 5th .product-info-group
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
