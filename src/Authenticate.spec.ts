import { test, expect } from '@playwright/test';

test('Authenticate test', async ({ page }) => {
  await page.goto('http://183.82.251.239/en/authenticate');

  await page.getByRole('textbox', { name: 'Email' }).fill('pepoqareports@gmail.com');
  await page.getByRole('button', { name: 'Continue with Email' }).click();

  await page.locator('.forms-otp').nth(0).fill('9');
  await page.locator('input:nth-child(2)').first().fill('3');
  await page.locator('input:nth-child(3)').first().fill('7');
  await page.locator('div:nth-child(3) > input').first().fill('9');
  await page.locator('div:nth-child(3) > input:nth-child(2)').fill('2');
  await page.locator('div:nth-child(3) > input:nth-child(3)').fill('3');

  await page.locator('div').filter({ hasText: /^Sales$/ }).getByRole('img').click();
  await page.getByRole('link', { name: 'Product I Sell' }).click();
  await page.getByRole('button', { name: /Add Product/ }).click();
});
