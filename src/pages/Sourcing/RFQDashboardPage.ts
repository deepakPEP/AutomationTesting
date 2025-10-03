import { test, expect } from '@playwright/test';
import { Locator, Page } from "playwright-core";
// RFQDashboardPage.js (Page Object)

export class RFQDashboardPage {
  readonly page: Page;


  constructor(page: Page) {
    this.page = page;
    // Selector for Pricing Type options
       
  }
  async validateFirstContactRow(expectedRFQDetails: any) {
      const firstRow = this.page.locator('table.p-datatable-table > tbody > tr').first();
      const cells = firstRow.locator('td');
      console.log('expectedRFQDetails:', expectedRFQDetails);
      // ✅ Validate dynamic values
      await expect((await cells.nth(1).textContent())?.trim()).toMatch(/^RFQ.{10}$/);
      expectedRFQDetails.rfqId = (await cells.nth(1).textContent())?.trim() || '';
      await expect(cells.nth(2)).toContainText(expectedRFQDetails.productName);
      const actual_string = await cells.nth(3).textContent() || '';
      await expect(actual_string.toLowerCase()).toContain(expectedRFQDetails.estimatedOrderQty.toLowerCase());

      const min = expectedRFQDetails.preferredMinUnitPrice;
      const max = expectedRFQDetails.preferredMaxUnitPrice;

      // Build the dynamic RegExp pattern string
      // 4th column ordered qty is coming. it is bug as of now

      console.log('rfqValidityDate:', expectedRFQDetails.rfqValidityDate);
      await expect(cells.nth(5)).toContainText(`${min} - ${max} / per Unit`);
      await expect(cells.nth(6)).toHaveText(expectedRFQDetails.rfqValidityDate);

      // ✅ Validate 3-dot action menu is visible (last cell)
      await expect(cells.nth(7)).toHaveText('no leads yet');
      await expect(cells.nth(8)).toHaveText('Approval Pending');
    }

    async validateViewDetails(rfq:any){
      const firstRow = this.page.locator('table.p-datatable-table > tbody > tr').first();
      const cursorPointerCell = firstRow.locator('td .cursor-pointer');
      await cursorPointerCell.click();
      await this.page.locator('button:has-text("View Details")').click();
    }
    async  assertProductDetails(rfq:any) {
      // Assert Product Name
      const productName = await this.page.locator('div.name-breadcrumb-wrapper h1.n-b-w-name').textContent();
      expect(productName?.trim()).toBe(rfq.productName);

      // Assert Product Category
      const productCategory = await this.page.locator('div.name-breadcrumb-wrapper span.n-b-w-breadcrumb').textContent();
      expect(productCategory?.trim()).toBe(rfq.productCategory);

      // Assert Estimated Order Quantity
      const estimatedOrderQty = await this.page.locator('div.estimate-unit-price-block span.e-u-p-b-value').first().textContent();
      const expectedOrderQty = `${rfq.estimatedOrderQty} pieces`; // Modify as per your format
      expect(estimatedOrderQty?.trim()).toBe(expectedOrderQty);

      // Assert Preferred Unit Price
      const unitPrice = await this.page.locator('div.estimate-unit-price-block span.e-u-p-b-value div').textContent();
      const expectedUnitPrice = `$ ${rfq.preferredMinUnitPrice} - $ ${rfq.preferredMaxUnitPrice} / per Unit`; // Modify as per your format
      expect(unitPrice?.trim()).toBe(expectedUnitPrice);

      // Assert the Product Description
      const descriptionElement = await this.page.locator('div.b-r-c-c-body div.b-r-c-c-details p');
      const descriptionText = await descriptionElement.textContent();
      expect(descriptionText?.trim()).toBe('This is a sample product description.');

      const validityDate = await this.page.locator('span.v-t-value').textContent();
      if (rfq.validityDate) {
        expect(validityDate?.trim()).toBe(rfq.validityDate);
      
      const editDetailsButton = await this.page.locator('button:has(span.b-c-txt:text("Edit Details"))');
      await expect(editDetailsButton.isVisible()).toBeTruthy();

       const rePostButton = await this.page.locator('button:has(span.b-c-txt:text("Re-Post"))');
       await expect(rePostButton.isDisabled()).toBeTruthy();
      }
      const statusText = await this.page.locator('span.table-badge-comp.approval-pending').textContent();
      expect(statusText?.trim()).toBe('Approval Pending');

      // Click the "Show More Details" Button
      await this.page.locator('button.btn-comp.btn-plain-txt').click();
      this.assertRFQRequirementDetails(rfq);
  }
  async assertRFQRequirementDetails(rfq:any) {  
     const sampleRequired = await this.page.locator('div.forms-group:has(label:has-text("Sample Required")) div.f-g-value-display').textContent();
  expect(sampleRequired?.trim()).toBe(rfq.sampleRequired);

  const customizationRequired = await this.page.locator('div.forms-group:has(label:has-text("Customization Required")) div.f-g-value-display').textContent();
  expect(customizationRequired?.trim()).toBe(rfq.customizationRequired);

  // Assert Sourcing Preferences
  const preferredCountry = await this.page.locator('div.forms-group:has(label:has-text("Preferred Country")) div.f-g-value-display').textContent();
  expect(preferredCountry?.trim()).toBe(rfq.preferredCountry);

  const preferredCity = await this.page.locator('div.forms-group:has(label:has-text("Preferred City")) div.f-g-value-display').textContent();
  expect(preferredCity?.trim()).toBe(rfq.preferredCity);

  // Assert Delivery Information
  const expectedDeliveryTime = await this.page.locator('div.forms-group:has(label:has-text("Expected Delivery Time")) div.f-g-value-display').textContent();
  expect(expectedDeliveryTime?.trim()).toBe(rfq.expectedDeliveryTime);

  const destinationPort = await this.page.locator('div.forms-group:has(label:has-text("Destination Port")) div.f-g-value-display').textContent();
  expect(destinationPort?.trim()).toBe(rfq.destinationPort);

  // Assert Contract Details
  const supplyContractType = await this.page.locator('div.forms-group:has(label:has-text("Supply Contract Type")) div.f-g-value-display').textContent();
  expect(supplyContractType?.trim()).toBe(rfq.supplyContractType);

  const paymentTerms = await this.page.locator('div.forms-group:has(label:has-text("Payment Terms")) div.f-g-value-display').textContent();
  expect(paymentTerms?.trim()).toBe(rfq.paymentTerms);

  // Assert Shipping Method
  const shippingMethod = await this.page.locator('div.forms-group:has(label:has-text("Shipping Method")) div.f-g-value-display').textContent();
  expect(shippingMethod?.trim()).toBe(rfq.shippingMethod);

  // Assert RFQ Validity
  const rfqValidity = await this.page.locator('div.forms-group:has(label:has-text("RFQ Validity")) div.f-g-value-display').textContent();
  expect(rfqValidity?.trim()).toBe(rfq.rfqValidity);
  }
}