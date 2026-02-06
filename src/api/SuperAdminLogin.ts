import { APIRequestContext,expect } from '@playwright/test';

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export async function superAdminLogin(request: APIRequestContext): Promise<AuthTokens> {
  const response = await request.post(
    'https://identity-api.sandbox.pepagora.org/admin/auth/login',
    {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
       email: process.env.SUPER_ADMIN_EMAIL, // Access from environment variables
        password: process.env.SUPER_ADMIN_PASSWORD, // Access from environment variables
        ip: process.env.SUPER_ADMIN_IP,
      },
      timeout: 50000,
    }
  );
   const responseBody = await response.json();
  console.log('Response Status:', response.status());
  console.log('Response Body:', JSON.stringify(responseBody, null, 2));

  await expect(response.ok()).toBeTruthy();
 
    // ✅ VALIDATE TOKEN EXISTENCE
    const access_token = responseBody.data.access_token;
    const refresh_token = responseBody.data.refresh_token;

  console.log('Access Token:', access_token);
  console.log('Refresh Token:', refresh_token);
  return { access_token, refresh_token };
}