import { faker } from '@faker-js/faker';

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  company: string;
  product: string;
}

export const generateLeadData = (): LeadData => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: `98${faker.helpers.replaceSymbols('########')}`,
    jobTitle: faker.person.jobTitle(),
    company: faker.company.name(),
    product: 'Grey shirt' // You can randomize this later
  };
}; 