const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const { expect } = require('@playwright/test');
 
async function readAndManageSuperadminMails({
  email,
  appPassword,
  subjectSearch = null,
  expectedValues = [],
  deleteAfterRead = false,
}) {
  const config = {
  imap: {
    user: process.env.IMAP_USER || 'qa.pepagora@gmail.com',
    // Yet to configure. please add it as secret in github repo and access it here
    password: process.env.IMAP_PASS,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    authTimeout: 10000,
    tlsOptions: {
      servername: 'imap.gmail.com',
      rejectUnauthorized: false,   // 🔥 FIX
    },
  },
};
  const connection = await imaps.connect(config);
  await connection.openBox('Superadmin Mails');

  // ✅ Dynamic search criteria
  const searchCriteria = subjectSearch
    ? [['HEADER', 'SUBJECT', subjectSearch]]
    : ['ALL'];

  const fetchOptions = { bodies: [''], struct: true };

  const messages = await connection.search(searchCriteria, fetchOptions);

  const latestMessage = messages[messages.length - 1];

const raw = latestMessage.parts.find(p => p.which === '').body;
const parsed = await simpleParser(raw);

const body = parsed.text || parsed.html;


console.log("Latest email validated successfully",body);
if (typeof expectedValues === "string") {
    expectedValues = expectedValues.split(",").map(v => v.trim());
  }

await console.log("Validating dynamic content...");
for (const value of expectedValues) {
    await expect(body).toContain(value);
  }
  

  // ✅ Delete if required
  if (deleteAfterRead) {
    const uids = messages.map(msg => msg.attributes.uid);
    await connection.addFlags(uids, '\\Deleted');
    await connection.imap.expunge();
    console.log(`Deleted ${uids.length} emails`);
  }

  await connection.end();
  //return parsedMails;
}

async function readAndManageUserMails({
  email,
  appPassword,
  subjectSearch = null,
  expectedValues = [],
  deleteAfterRead = false
}){
  const config = {
  imap: {
   
   user: email,
    password: appPassword,
   host: 'imap.gmail.com',
    port: 993,
    tls: true,
    authTimeout: 10000,
    tlsOptions: {
      servername: 'imap.gmail.com',
      rejectUnauthorized: false,   // 🔥 FIX
    },
  },
};
  const connection = await imaps.connect(config);
  await connection.openBox('Inbox');

  // ✅ Dynamic search criteria
  const searchCriteria = subjectSearch
    ? [['HEADER', 'SUBJECT', subjectSearch]]
    : ['ALL'];

  const fetchOptions = { bodies: [''], struct: true };

  const messages = await connection.search(searchCriteria, fetchOptions);

  const latestMessage = messages[messages.length - 1];

const raw = await latestMessage.parts.find(p => p.which === '').body;
const parsed = await simpleParser(raw);

const body = parsed.textAsHtml || parsed.text || parsed.html;
const cleanBody = body
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();

console.log("Latest email validated successfully",body);
if (typeof expectedValues === "string") {
    expectedValues = expectedValues.split(",").map(v => v.trim());
  }

await console.log("Validating dynamic content...");
for (const value of expectedValues) {
    await expect(cleanBody).toContain(value.toLowerCase());
  }
  

  // ✅ Delete if required
  if (deleteAfterRead) {
    const uids = await messages.map(msg => msg.attributes.uid);
    await connection.addFlags(uids, '\\Deleted');
    await connection.imap.expunge();
    console.log(`Deleted ${uids.length} emails`);
  }

  await connection.end();
} 
export {
  readAndManageSuperadminMails,
  readAndManageUserMails
};  