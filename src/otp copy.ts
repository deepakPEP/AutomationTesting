// src/otp.ts
const imaps = require('imap-simple');

const config = {
  imap: {
    user: 'anusuya2011cse@gmail.com',
    password: 'your-app-password', // Use your real app password here
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    authTimeout: 3000,
  },
};

export async function fetchOTP(): Promise<string | null> {
  try {
    const connection = await imaps.connect(config);
    await connection.openBox('INBOX');

    const searchCriteria = ['UNSEEN', ['FROM', 'no-reply@pepagora.com']];
    const fetchOptions = { bodies: ['TEXT'], markSeen: true };

    const messages = await connection.search(searchCriteria, fetchOptions);

    for (const message of messages) {
      //const body = message.parts.find(part :any=> part.which === 'TEXT')?.body;
      const body = (message.parts.find((part: any) => part.which === 'TEXT') as any)?.body;
      const otpMatch = body?.match(/\d{6}/);
      console.log('Found OTP:', otpMatch);
      if (otpMatch) return otpMatch[0];
    }

    connection.end();
    return null;
  } catch (err) {
    console.error('OTP Fetch Failed:', err);
    return null;
  }
}
