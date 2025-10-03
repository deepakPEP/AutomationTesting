export class Product {
  // ✅ Mandatory fields
  name: string;
  price: string;
  department: string;

  // ✅ Optional fields
  description?: string;
  material?: string;
  imageFile?: string;

  constructor(data: any) {
    // Validate required fields
    if (!data.name || !data.price || !data.department) {
      throw new Error('Missing required product fields');
    }

    this.name = data.name;
    this.price = data.price;
    this.department = data.department;

    // Optional assignments
    this.description = data.description ?? '';
    this.material = data.material ?? '';
    this.imageFile = data.imageFile ?? '';
  }

  toString(): string {
    return `${this.name} (${this.department}) - $${this.price}`;
  }
}
