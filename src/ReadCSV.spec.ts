import { test, expect } from '@playwright/test';
import { getProductByName } from './utils/getProductFromCSV'; // Adjust the path based on your project structure

const product = getProductByName('Electric Screwdriver');

test('Fill form using CSV product by name', async ({ page }) => {
  if (!product) throw new Error('Product not found in CSV');
  else {
    console.log('Product found:', product);
    console.log('product.sku_model : ', product.sku_model);
  }
});