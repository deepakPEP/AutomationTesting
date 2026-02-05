  const { readLatestEmail } = require('./Mailtest');
  import { test, expect } from '@playwright/test';

  test('@product_I_sell_without_variants', async () => {
    const email = await readLatestEmail();
    expect(email.subject).toContain('Welcome');
  });
