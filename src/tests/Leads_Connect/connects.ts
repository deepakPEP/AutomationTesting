// utils/contactData.ts
import { faker } from '@faker-js/faker';

export const generateContactData = () => ({
  name: faker.person.fullName(),
  company: faker.company.name(),
  email: faker.internet.email(),
  phone: `98${faker.helpers.replaceSymbols('########')}`,
  country: 'India',
  source: 'Website',
});