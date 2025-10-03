import fs from 'fs';
import path from 'path';
//import { Product } from './utils/Product';
import { Product } from './utils/Product';

const data = JSON.parse(fs.readFileSync(path.resolve('src/data/products.json'), 'utf-8'));

const products: Product[] = [];

for (const raw of data) {
  try {
    const product = new Product(raw);
    products.push(product);
  } catch (err) {
  if (err instanceof Error) {
    console.error('❌ Failed to load product:', err.message);
  } else {
    console.error('❌ Unknown error:', err);
  }
}
}
// ✅ Use the class
products.forEach(p => console.log('✅', p.toString()));
