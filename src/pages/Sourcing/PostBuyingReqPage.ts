import { Locator, Page } from "playwright-core";
// PricingPage.js (Page Object)
import {  selectCountry } from '../../utils/CommonFunctions';
import { selectCity } from '../../utils/CommonFunctions';
import { ProductInformationPage } from '../ProductISell/AddProductInfoPage';
import { getDDMMYYYY, getTodayAndFutureDate, getFormattedDate ,getconvertDateFormat} from '../../utils/Dateutlis';
import { get } from "http";

interface RFQ {
  [key: string]: string | number | boolean | string[];
}

export class PostBuyingReqPage {
  readonly page: Page;

  readonly inputProductName: Locator;
    readonly inputProductDescription: Locator;
    readonly inputProductImage: Locator;
    readonly inputProductCategory: Locator;
    readonly additionalBuyingReqDetails: Locator;
    readonly rfqTitle: Locator;
    readonly estimatedOrderQty: Locator;
    readonly preferredMinUnitPrice: Locator;
    readonly preferredMaxUnitPrice: Locator;
    readonly dropdownCurrency: Locator;
    readonly rfqValidityDate: Locator;
    readonly toggleAdditionalReq: Locator
    readonly destinationPort: Locator;
    readonly expectedDeliveryTime: Locator;
    readonly expressDeliveryOption: Locator;
    readonly continueButton: Locator;
    prodInfoPage : ProductInformationPage; // Instance of ProductInformationPage
  constructor(page: Page) {
    this.page = page;
    // Selector for Pricing Type options

    this.inputProductName = this.page.getByRole('textbox', { name: 'Enter Product Name' })
    this.inputProductDescription = this.page.locator('textarea[name="productDescription"]');


    this.inputProductImage = this.page.locator('input[name="product_image"]');
    this.inputProductCategory = this.page.locator('input[placeholder="Search for Category"]');
    this.additionalBuyingReqDetails = this.page.locator('textarea[name="additionalBuyingReqDetails"]');
    this.rfqTitle = this.page.locator('input[name="rfqTitle"]');
    this.estimatedOrderQty = this.page.locator('input[name="estOrderQuantity.quantity"]');
    this.preferredMinUnitPrice = this.page.locator('input[name="preferredUnitPrice.priceRange.minPrice"]');
    this.preferredMaxUnitPrice = this.page.locator('input[name="preferredUnitPrice.priceRange.maxPrice"]');
    this.dropdownCurrency = this.page.locator('div[role="button"][aria-label="Select Currency"]');
    this.rfqValidityDate = this.page.locator('input[placeholder="DD/MM/YY"]');
    this.toggleAdditionalReq = this.page.locator('div.forms-block svg.trigger-icon');
    this.inputProductImage = this.page.locator('#fileInput');
    this.destinationPort = this.page.locator('input[name="destinationPort"]');
    this.expectedDeliveryTime = this.page.locator("//label[text()='Expected Delivery Time']//parent::div//div[@role='button']");
    this.expressDeliveryOption = this.page.locator("//span[text()='Express']//parent::li");
    this.continueButton = this.page.locator("//span[text()='Continue']//parent::button");
    this.prodInfoPage = new ProductInformationPage(page); // Initialize ProductInformationPage
    //Paymentterms - we can resuse it from some file
    //
  }
  async selectUnit(unit:string) {
  // Locator for the dropdown item that matches the unit
  const unitLocator = this.page.locator(`li.p-dropdown-item:has(span.p-dropdown-item-label:text("${unit}"))`);

  // Wait for the dropdown items to be visible
  await unitLocator.waitFor({ state: 'visible' });
  
  // Click on the dropdown item that matches the unit
  await unitLocator.click();
    }

    // Preferred sourcing region
async clickPreferredSourcingRegion(value:string) {
  const radioButton = this.page.locator(`input[type="radio"][value="${value}"]`);
  await radioButton.click();
}
async selectCheckboxByLabel(labels: string[]) {
  for (const label of labels) {
    const checkboxLabel = await this.page.locator(`span:has-text("${label}")`);
    const checkboxInput = checkboxLabel.locator('..').locator('input.p-checkbox-input');

    // Check if the checkbox is already selected, and if not, click it
    const isSelected = await checkboxInput.isChecked();
    if (!isSelected) {
      await checkboxInput.click();
    }
  }
}
async generateRandomPriceRange(minLimit = 100, maxLimit = 1000) {
  const minPrice = Math.floor(Math.random() * (maxLimit - minLimit - 50)) + minLimit; // leave room for max
  const maxPrice = Math.floor(Math.random() * (maxLimit - minPrice)) + minPrice + 1; // ensure max > min
  return { minPrice, maxPrice };
}
async fillPostingBuyingReqForm(product:any) {
  const rfq : RFQ= {};
   await this.inputProductName.fill(product.name);
    rfq.productName = product.name;
   await this.inputProductDescription.fill('This is a sample product description.');
    rfq.productDescription = 'This is a sample product description.';
  //await this.prodInfoPage.uploadImage(); // Adjust the file path as needed
  await this.prodInfoPage.browseCategory(product.product_category || 'Electronics > Laptops > Gaming Laptops');
   rfq.productCategory = product.product_category || 'Electronics > Laptops > Gaming Laptops';

  await this.page.waitForTimeout(2000); // Wait for category selection to process
  await this.additionalBuyingReqDetails.fill('Additional details about the buying request.');
   rfq.additionalDetails = 'Additional details about the buying request.';
   
  await this.rfqTitle.fill('Sample Automation RFQ Title');
  rfq.rfqTitle = 'Sample Automation RFQ Title';

  await this.estimatedOrderQty.fill(product.moq || '100');
  rfq.estimatedOrderQty = product.moq || '100';
  
  await this.page.locator('[aria-label="Units"]').click();
  await this.selectUnit(product.unit || 'Pieces');
  const { minPrice, maxPrice } = await this.generateRandomPriceRange();
  rfq.preferredMinUnitPrice = '₹ ' + minPrice;
  rfq.preferredMaxUnitPrice = '₹ ' + maxPrice;
  rfq.rfqTitle = 'Sample Automation RFQ Title';
  rfq.rfqValidityDate = getTodayAndFutureDate(7).futureFormatted;
  await this.preferredMinUnitPrice.fill(minPrice.toString());
  await this.preferredMaxUnitPrice.fill(maxPrice.toString());
  await this.dropdownCurrency.click();
  //can be done dynamically
  await this.page.locator('li.p-dropdown-item:has(span.p-dropdown-item-label:text("INR"))').click();
  await this.rfqValidityDate.click();
  await this.page.waitForTimeout(2000); // Wait for the date picker to appear
  let { todayFormatted, futureFormatted } = getTodayAndFutureDate(7);

  console.log('futureFormatted: ', getconvertDateFormat(futureFormatted));

  await this.rfqValidityDate.fill(getconvertDateFormat(futureFormatted));
  await this.page.waitForTimeout(2000); // Wait for the date to be set
  // Toggle additional requirements
  await this.toggleAdditionalReq.click();
  await this.clickPreferredSourcingRegion('Nearby');
  // country selection can move to utility file
  //select city can move to utility file
  await this.destinationPort.fill('New York');
  rfq.destinationPort = 'New York';
  await selectCountry(this.page, 'India');
  await selectCity(this.page, 'Coimbatore');
  await this.expectedDeliveryTime.click();
  await this.page.locator('li.p-dropdown-item:has(span.p-dropdown-item-label:text("Express"))').click();
  rfq.expectedDeliveryTime = 'Express';
  // Assuming you have a method to select the unit, you can call it here
  await this.page.locator("//div[text()='Select Shipping Method']").click();
  await this.selectCheckboxByLabel(['Air', 'Road']);
  rfq.shippingMethods = ['Air', 'Road'];
  await this.page.waitForTimeout(5000); // Wait for the shipping method selection to process
  await this.continueButton.click();
  await this.page.waitForTimeout(5000); // Wait for the continue button action to process
  return rfq; // Return the filled RFQ object
}
// async fillPostingBuyingReqForm(product: any) {
//   const rfq : RFQ= {}; // Initialize the RFQ object

//   // Fill Product Name
//   await this.inputProductName.fill(product.name);
//   rfq.productName = product.name;

//   // Fill Product Description
//   await this.inputProductDescription.fill('This is a sample product description.');
//   rfq.productDescription = 'This is a sample product description.';

//   // Browse Category
//   await this.prodInfoPage.browseCategory(product.product_category || 'Electronics > Laptops > Gaming Laptops');
//   await this.page.waitForTimeout(2000); // Wait for category selection to process
//   rfq.productCategory = product.product_category || 'Electronics > Laptops > Gaming Laptops';

//   // Fill Additional Buying Request Details
//   await this.additionalBuyingReqDetails.fill('Additional details about the buying request.');
//   rfq.additionalDetails = 'Additional details about the buying request.';

//   // Fill RFQ Title
//   await this.rfqTitle.fill('Sample Automation RFQ Title');
//   rfq.rfqTitle = 'Sample Automation RFQ Title';

//   // Fill Estimated Order Quantity
//   await this.estimatedOrderQty.fill(product.moq || '100');
//   rfq.estimatedOrderQty = product.moq || '100';

//   // Select Unit
//   await this.page.locator('[aria-label="Units"]').click();
//   await this.selectUnit(product.unit || 'Pieces');
//   rfq.unit = product.unit || 'Pieces';

//   // Generate and set Price Range
//   const { minPrice, maxPrice } = await this.generateRandomPriceRange();
//   product.preferredMinUnitPrice = minPrice;
//   product.preferredMaxUnitPrice = maxPrice;
//   rfq.preferredMinUnitPrice = minPrice;
//   rfq.preferredMaxUnitPrice = maxPrice;
//     await this.preferredMinUnitPrice.fill(minPrice.toString());
//   await this.preferredMaxUnitPrice.fill(maxPrice.toString());
//   let { todayFormatted, futureFormatted } = getTodayAndFutureDate(7);
//   // Fill RFQ Validity Date
  
//   await this.rfqValidityDate.fill(getconvertDateFormat(futureFormatted));
//   rfq.rfqValidityDate = getconvertDateFormat(futureFormatted);

//   // Toggle Additional Requirements
//   await this.toggleAdditionalReq.click();
//   rfq.additionalRequirements = true;  // or false, depending on toggle state

//   // Select Preferred Sourcing Region
//   await this.clickPreferredSourcingRegion('Nearby');
//   rfq.preferredSourcingRegion = 'Nearby';

//   // Fill Destination Port
//   await this.destinationPort.fill('New York');
//   rfq.destinationPort = 'New York';

//   // Select Country and City
//   await selectCountry(this.page, 'India');
//   rfq.country = 'India';
//   await selectCity(this.page, 'Coimbatore');
//   rfq.city = 'Coimbatore';

//   // Select Expected Delivery Time
//   await this.expectedDeliveryTime.click();
//   await this.page.locator('li.p-dropdown-item:has(span.p-dropdown-item-label:text("Express"))').click();
//   rfq.expectedDeliveryTime = 'Express';

//   // Select Shipping Method
//   await this.page.locator("//div[text()='Select Shipping Method']").click();
//   await this.selectCheckboxByLabel(['Air', 'Road']);
//   rfq.shippingMethods = ['Air', 'Road'];

//   // Return the filled RFQ object
//   await this.continueButton.click();
//   await this.page.waitForTimeout(5000); // Wait for any potential navigation
//   console.log('RFQ Object:', JSON.stringify(rfq, null, 2));
//   return rfq; 
// }

}