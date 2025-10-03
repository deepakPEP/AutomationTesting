// utils/getOtp.ts
import { APIRequestContext, expect } from '@playwright/test';

export type GetOtpOptions = {
  url: string;                  // Full URL of the OTP endpoint
  method?: 'GET' | 'POST';      // Default: 'GET'
  headers?: Record<string, string>;
  body?: any;                   // For POST bodies (JSON)
};

export async function getOtpFromApi(request: APIRequestContext, opts: GetOtpOptions): Promise<string> {
  const { url, method = 'POST', headers = {}, body } = opts;
  // console.log('--- OTP API Request ---');
  // console.log('URL:', url);
  // console.log('Method:', method);
  // console.log('Headers:', JSON.stringify(headers, null, 2));
  // console.log('Body:', JSON.stringify(body, null, 2));
  const res = await request.post(url, { headers, data: body })


//  expect(res.ok()).toBeTruthy(); // fail fast if non-2xx
if (!res.ok()) {
    // Log the response for debugging
    
    console.error('Failed OTP request:', res.status(), await res.body());
    throw new Error(`Failed to get OTP: ${res.status()}`);
  }

  const json = await res.json();
  console.log('--- OTP API Response ---',json);
  // Try path 1: data.parameteres[].name === 'Verification Code'
  // const p = json?.data?.parameteres;
  // const codeFromParameters =
  //   Array.isArray(p)
  //     ? p.find((x: any) => (x?.name || '').toLowerCase() === 'verification code')?.value
  //     : undefined;

  // if (codeFromParameters) return String(codeFromParameters).trim();

  // // Try path 2: data.contact.customParams[].name === 'verification_code'
  // const cp = json?.data?.contact?.customParams;
  // const codeFromCustomParams =
  //   Array.isArray(cp)
  //     ? cp.find((x: any) => (x?.name || '').toLowerCase() === 'verification_code')?.value
  //     : undefined;

  // if (codeFromCustomParams) return String(codeFromCustomParams).trim();

 // throw new Error('OTP not found in API response.');
 return json?.otp || '';
}

