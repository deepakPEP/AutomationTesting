import { Page } from 'playwright-core';
import { expect } from '@playwright/test';

export async function selectCountry(page: Page, countryName: string): Promise<void> {
  // Open the dropdown by clicking the "Select Country" field
  await page.click('select.forms-select:nth-of-type(1)');
  await page.waitForTimeout(1000); // Wait for the dropdown to open
  // Wait for the options to be visible
  //await page.waitForSelector('option');
     // Pause to inspect the dropdown if needed
  // Select the country option by matching the countryName argument
  await page.selectOption('select.forms-select', { label: countryName });

  // Optionally, you can verify that the country has been selected
 const selectedCountry = await page.$eval('select.forms-select', (el: HTMLElement) => {
  // Cast the element to HTMLSelectElement to access the 'value' property
  return (el as HTMLSelectElement).value;
});
console.log('Selected Country:', selectedCountry);
}
export async function selectCity(page: Page, cityName: string): Promise<void> {
  // Open the dropdown by clicking the "Select City" field
  await page.click('select.forms-select:nth-of-type(2)');

  // Wait for the options to be visible
  //await page.waitForSelector('option');

  // Select the city option by matching the cityName argument
  //await page.selectOption('select.forms-select', { label: cityName });
  await page.selectOption('select.forms-select:nth-of-type(2)', { label: cityName });

  // Optionally, you can verify that the city has been selected
 const selectedCity = await page.$eval('select.forms-select', (el: HTMLElement) => {
  // Cast the element to HTMLSelectElement to access the 'value' property
  return (el as HTMLSelectElement).value;
});
console.log('Selected City:', selectedCity);
}


/**
 * Asserts that two strings are equal ignoring extra spaces, optional spaces around dashes, and case.
 * @param actualText Text from the page
 * @param expectedText Text you expect
 */
// export async function assertNormalizedText(actualText: string, expectedText: string) {
//   // Normalize: remove extra spaces, allow optional spaces around dash, ignore case
//   const normalize = (str: string) =>
//     str
//       .trim()                        // Remove leading/trailing spaces
//       .replace(/\s*-\s*/g, '-')      // Normalize spaces around dashes
//       .replace(/\s+/g, ' ')          // Replace multiple spaces with single space
//       .toLowerCase();                // Ignore case

//   console.log('Actual in util Text:', normalize(actualText));
//   console.log('Expected in util Text:', normalize(expectedText));
//   await expect(normalize(actualText)).toBe(normalize(expectedText));
// }
export async function assertNormalizedText(actualText: string, expectedText: string) {
  // Normalize: remove extra spaces, allow optional spaces around dash, ignore case, and trim spaces around commas
  const normalize = (str: string) =>
    str
      .trim()                        // Remove leading/trailing spaces
      .replace(/\s*-\s*/g, '-')      // Normalize spaces around dashes
      .replace(/\s+/g, ' ')          // Replace multiple spaces with single space
      .replace(/\s*,\s*/g, ',')      // Trim spaces around commas
      .toLowerCase();                // Ignore case

  console.log('Actual in util Text:', normalize(actualText));
  console.log('Expected in util Text:', normalize(expectedText));
  
  await expect(normalize(actualText)).toBe(normalize(expectedText));
}


