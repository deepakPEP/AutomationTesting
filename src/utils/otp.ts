const imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;

const config = {
  imap: {
    user: 'anusuya2011cse@gmail.com',
    password: 'zvhj dvai jsjd gdmf',
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    authTimeout: 5000,
  },
};

export async function fetchOTP(): Promise<string | null> {
  try {
    const connection = await imaps.connect(config);
    await connection.openBox('INBOX');

    const searchCriteria = ['UNSEEN', ['FROM', 'no-reply@pepagora.com']];
    const fetchOptions = { bodies: [''], markSeen: true };

    const messages = await connection.search(searchCriteria, fetchOptions);

    for (const message of messages) {
      const all = message.parts.find((part: any) => part.which === '')?.body;
      if (!all) continue;

      const parsed = await simpleParser(all); // parses HTML body, plain text, headers

      const text = parsed.text || parsed.html || '';
      const otpMatch = text.match(/\b\d{6}\b/); // exact 6-digit pattern

      if (otpMatch) {
        console.log('✅ OTP found:', otpMatch[0]);
        connection.end();
        return otpMatch[0];
      }
    }

    connection.end();
    console.warn('⚠️ OTP not found in any email.');
    return null;
  } catch (err) {
    console.error('❌ OTP Fetch Failed:', err);
    return null;
  }
}
