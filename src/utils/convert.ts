import fs from 'fs';
import path from 'path';
const { Parser } = require('json2csv');

// 1. Load JSON file
const jsonFilePath = path.resolve(__dirname, '../data/products.json');
const rawData = fs.readFileSync(jsonFilePath, 'utf-8');
const products = JSON.parse(rawData);

// 2. Flatten nested fields for CSV
const flatProducts = products.map((p: any) => ({
  name: p.name,
  sku_model: p.sku_model,
  department: p.department,
  moq: p.moq,
  unit: p.unit,
  pricing_type: p.pricing_type,
  country_of_origin: p.country_of_origin,
  currency: p.currency,
  available_stock: p.available_stock,
  sample_availablity: p.sample_availablity,
  payment_terms: p.payment_terms,
  ships_internationally: p.ships_internationally,
  incoterms: p.incoterms,
  dispatch_lead_time: p.dispatch_lead_time,
  short_description: p.short_description || '',
  product_category: p.product_category?.join(' > ') || '',
  product_description: p.product_description || '',
  product_specification: p.product_specification || '',
  production_lead_time: p.production_lead_time || '',
  production_capacity_value: p.production_capacity?.value || '',
  production_capacity_unit: p.production_capacity?.unit || '',
  production_capacity_duration: p.production_capacity?.duration || '',
  sample_price_value: p.sample_price?.value || '',
  sample_price_unit: p.sample_price?.unit || '',
  payment_methods: p.payment_methods?.join(', ') || '',
  shipping_modes: p.shipping_modes?.join(', ') || '',
  port_of_dispatch: p.port_of_dispatch || '',
  packaging_type: p.packaging_type || '',
  units_per_package: p.units_per_package || '',
  barcode: p.barcode || '',
  product_keywords: p.product_keywords?.join(', ') || '',
  brand: p.brand || '',
  product_group: p.product_group || '',
  product_video: p.product_video || '',
  certification_title: p.certification_title || '',
  certifications: p.certifications?.join(', ') || '',
  faqs: (p.faqs || []).map((f: any) => `${f.question}=>${f.answer}`).join(' | ') || '',
  image: p.image || ''
}));

// 3. Convert to CSV and write to file
const parser = new Parser();
const csv = parser.parse(flatProducts);
const outputPath = path.resolve(__dirname, '../data/products.csv');
fs.writeFileSync(outputPath, csv);

console.log('✅ CSV generated at:', outputPath);
