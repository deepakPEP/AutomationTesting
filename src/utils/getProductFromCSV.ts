import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

/**
 * Reads the CSV and returns a product row matching the given name.
 * @param productName The name of the product to find (case-insensitive)
 * @returns A JSON object representing the row or null if not found
 */
export function getProductByName(productName: string): Record<string, string> | null {
  const filePath = path.resolve(__dirname, '../data/products.csv');
  const csvContent = fs.readFileSync(filePath, 'utf-8');

  const records = parse<Record<string, string>>(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  const product = records.find((row: Record<string, string>) =>
  (row.name || '').toLowerCase().trim() === productName.toLowerCase().trim()
);

  return product || null;
}
