import { PricingType } from './enums/PricingType';
import { StockStatus } from './enums/StockStatus';
import { SampleAvailability } from './enums/SampleAvailability';
import { ShippingOption } from './enums/ShippingOption';
import { Incoterms } from './enums/Incoterms';


export class Product {
  // ✅ Required
  name: string;
  sku_model: string;
  department: string; // derived from product_category[0]
  moq: number;
  unit: string;
  pricing_type: PricingType;
  country_of_origin: string;
  currency: string;
  available_stock: StockStatus;
  sample_availablity: SampleAvailability;
  payment_terms: string;
  ships_internationally: ShippingOption;
  incoterms: Incoterms;
  dispatch_lead_time: string;

  // ✅ Optional
  short_description?: string;
  product_category?: string[]; // [main, sub, leaf]
  product_description?: string;
  product_specification?: string;
  production_lead_time?: string;
  production_capacity?: {
    value: number;
    unit: string;
    duration: string;
  };
  sample_price?: {
    value: number;
    unit: string;
  };
  payment_methods?: string[];
  shipping_modes?: string[];
  port_of_dispatch?: string;
  packaging_type?: string;
  units_per_package?: number;
  barcode?: string;
  product_keywords?: string[];
  brand?: string;
  product_group?: string;
  product_video?: string;
  certification_title?: string;
  certifications?: string[];
  faqs?: {
    question: string;
    answer: string;
  }[];

  constructor(data: any) {
    // ✅ Validate required fields
    const required = [
      'name', 'sku_model', 'moq', 'unit', 'pricing_type',
      'country_of_origin', 'currency', 'available_stock',
      'sample_availablity', 'payment_terms',
      'ships_internationally', 'incoterms', 'dispatch_lead_time'
    ];

    for (const field of required) {
      if (!data[field]) throw new Error(`Missing required field: ${field}`);
    }

    // ✅ Assign required
    this.name = data.name;
    this.sku_model = data.sku_model;
    this.department = data.product_category?.[0] ?? 'Unknown';
    this.moq = data.moq;
    this.unit = data.unit;
    this.pricing_type = data.pricing_type;
    this.country_of_origin = data.country_of_origin;
    this.currency = data.currency;
    this.available_stock = data.available_stock;
    this.sample_availablity = data.sample_availablity;
    this.payment_terms = data.payment_terms;
    this.ships_internationally = data.ships_internationally;
    this.incoterms = data.incoterms;
    this.dispatch_lead_time = data.dispatch_lead_time;

    // ✅ Optional fields
    this.short_description = data.short_description;
    this.product_category = data.product_category;
    this.product_description = data.product_description;
    this.product_specification = data.product_specification;
    this.production_lead_time = data.production_lead_time;
    this.production_capacity = data.production_capacity;
    this.sample_price = data.sample_price;
    this.payment_methods = data.payment_methods;
    this.shipping_modes = data.shipping_modes;
    this.port_of_dispatch = data.port_of_dispatch;
    this.packaging_type = data.packaging_type;
    this.units_per_package = data.units_per_package;
    this.barcode = data.barcode;
    this.product_keywords = data.product_keywords;
    this.brand = data.brand;
    this.product_group = data.product_group;
    this.product_video = data.product_video;
    this.certification_title = data.certification_title;
    this.certifications = data.certifications;
    this.faqs = data.faqs;
  }

  static fromFormData(data: any): Product {
    return new Product(data);
  }

  toJSON(): Record<string, any> {
    return { ...this };
  }

  toString(): string {
    return `${this.name} [${this.sku_model}] - ${this.pricing_type}, ${this.currency} ${this.moq}/${this.unit}`;
  }
  private validateEnum<T>(enumType: any, value: any, fieldName: string): T {
    if (!Object.values(enumType).includes(value)) {
      throw new Error(`Invalid value for ${fieldName}: ${value}`);
    }
    return value;
  }
}
