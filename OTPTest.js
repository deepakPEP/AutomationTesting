const { chromium } = require('playwright');  // or 'firefox' / 'webkit'
const imaps = require('imap-simple');

// Gmail IMAP Config
const config = {
  imap: {
    user: 'anusuya2011cse@gmail.com', // Your Gmail account
    password: 'zvhj dvai jsjd gdmf', // Gmail app password (if 2FA is enabled)
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false,
      //secureProtocol: 'TLS_method' // Disabling certificate validation
    },
    authTimeout: 3000,
  },
};

async function fetchOTP() {
  try {
    const connection = await imaps.connect(config);
    await connection.openBox('INBOX');
    // Search for emails from your OTP provider
    const searchCriteria = ['UNSEEN', ['FROM', 'hello@otp.dev']]; // Replace with your OTP sender
    const fetchOptions = { bodies: ['TEXT', 'HEADER.FIELDS (FROM SUBJECT DATE)'], markSeen: true };

    const messages = await connection.search(searchCriteria, fetchOptions);

    // Process the OTP email
    for (let message of messages) {
      const subject = message.parts.filter(part => part.which === 'HEADER.FIELDS (FROM SUBJECT DATE)')[0].body.subject;
      const body = message.parts.filter(part => part.which === 'TEXT')[0].body;

      console.log(`Found email with subject: ${subject}`);
      console.log(`Email Body: ${body}`);

      // Extract OTP (6-digit number)
      const otpRegex = /\d{6}/;  // Example for 6-digit OTP
      const otp = body.match(otpRegex);
      if (otp) {
        console.log('OTP:', otp[0]);
      }
    }

    // Close connection
    connection.end();
  } catch (error) {
    console.error('Error fetching OTP:', error);
  }
}

async function automateLogin() {
//   const browser = await chromium.launch({ headless: false });
//   const page = await browser.newPage();

//   // Step 1: Go to the OTP-triggering website (replace with the actual URL)
//   await page.goto('https://your-otp-trigger-website.com');
//   await page.click('button#send-otp');  // Adjust selector to trigger OTP

//   // Step 2: Wait for OTP to be sent and retrieve it from Gmail
      const otp = await fetchOTP();

//   // Step 3: Enter OTP in your test login form
//   await page.fill('input#otp', otp);
//   await page.click('button#submit');  // Submit login form

  console.log('OTP Submitted:', otp);

  // Step 4: Close the browser
  //await browser.close();
}

automateLogin();
