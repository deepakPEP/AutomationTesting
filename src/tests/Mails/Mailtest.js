const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');

async function readLatestEmail() {
  const config = {
    imap: {
      user: 'qa.pepagora@gmail.com',
      password: 'nmbf ydtt knjl rmpj',
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      authTimeout: 3000,

       tlsOptions: {
        rejectUnauthorized: false,
      },
    },
  };

  const connection = await imaps.connect(config);
  await connection.openBox('INBOX');

  const searchCriteria = ['SEEN'];
  const fetchOptions = { bodies: [''], markSeen: true };

  const messages = await connection.search(searchCriteria, fetchOptions);
  if (!messages.length) {
    throw new Error('No new emails found');
  }
  for (let i = 0; i < messages.length; i++) {
    const raw = messages[i].parts[0].body;
    const parsed = await simpleParser(raw);

    console.log('---------------------------');
    console.log(`Mail #${i + 1}`);
    console.log('Subject:', parsed.subject);
    console.log('From:', parsed.from?.text);
    console.log('Date:', parsed.date);
    console.log('Text:', parsed.text?.substring(0, 200)); // preview
    console.log('---------------------------');
  }

  await connection.end();
  
  const mail = messages[messages.length - 1];
  return await simpleParser(mail.parts[0].body);
}

module.exports = { readLatestEmail };
