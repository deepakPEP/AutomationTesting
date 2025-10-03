// tests/connect.spec.ts
import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ConnectPage } from './connectpage';
import { ConnectDashboardPage } from './connectdashboard';
import { generateContactData } from './connects';

test('Login and add a new contact in Connect module', async ({ page }) => {
      test.setTimeout(120000); // 2-minute timeout

  const loginPage = new LoginPage(page);
  const connectPage = new ConnectPage(page);
  const dashboardPage = new ConnectDashboardPage(page);
  const contact = generateContactData();

  // await loginPage.gotoLogin();
  // await loginPage.enterPhoneAndContinue('+80984-58992');
  // await loginPage.enterOTP(''); // Replace with dynamic OTP fetching if needed
  //   await page.waitForTimeout(5000); // wait after OTP


  // await loginPage.goToConnectModule();
  // await connectPage.clickAddNewContact();
  // await connectPage.fillContactForm(contact);
  // await connectPage.submitContactForm();
  //   await page.waitForTimeout(5000); // wait for table to refresh


  // ✅ Validate contact appears on dashboard
  await dashboardPage.validateFirstContactRow({
    ...contact,
    type: 'lead',     // <-- Replace with actual default or selected value
    source: 'Website',
    status: 'active'        // <-- Replace with actual status if it's auto-set
  });
  await page.waitForTimeout(5000);

});