import { APIRequestContext, expect } from '@playwright/test';

export async function SuperAdminProductApproval(
  request: APIRequestContext,
  productId: string,
  adminSession: string
) {
  const response = await request.post(
    `https://api.sandbox.pepagora.org/sales/admin/approve-sales-product/${productId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        adminsession: adminSession
      },
      data: {
        id: productId
      },
      timeout: 50000,
    }
  );
  console.log('Response Status:', response.status());
  console.log('Response Body:', JSON.stringify(response, null, 2));

  expect(response.ok()).toBeTruthy();

  return response.json();
}
