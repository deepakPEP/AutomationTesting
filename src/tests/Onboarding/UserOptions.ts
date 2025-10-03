import { test, expect } from '@playwright/test';

test('Click all radio buttons on Choose Service page', async ({ page }) => {
  // Replace with your actual URL
  await page.goto('http://localhost:3000/onboarding1.html');

  // Radio button labels
  const options = [
    'Buy Products or Services',
    'Sell Products or Services',
    'Do Both'
  ];

  for (const option of options) {
    const radio = page.locator(`input[type="radio"][id="${option}"]`);
    await expect(radio).toBeVisible();
    await radio.check();
    console.log(`Clicked radio button: ${option}`);
    await page.waitForTimeout(1000); // just to observe visually
  }
});

async function selectDropdownByText(page: Page, dropdownLabel: string, optionText: string) {
  const dropdownTrigger = page.locator(`label:has-text("${dropdownLabel}")`).locator('xpath=..').locator('button');
  await dropdownTrigger.click();

  const option = page.locator(`.p-dropdown-item-label`, { hasText: optionText });
  await expect(option).toBeVisible();
  await option.click();
}
async function selectRadioByLabelText(page: Page, labelText: string) {
  const radio = page.locator(`label:has-text("${labelText}") input[type="radio"]`);
  await expect(radio).toBeVisible();
  await radio.check();
}


test('Assert Step Titles on Onboarding Page', async ({ page }) => {
  await page.goto('http://localhost:3000/onboarding2.html');

  // Assert the step titles
  await expect(page.locator('text=Sourcing Details')).toBeVisible();
  await expect(page.locator('text=Business Details')).toBeVisible();
});

