// import { test } from '@playwright/test';
// import { LoginPage as LeadLoginPage } from '../../pages/LoginPage';
// import { LeadsPage } from './AddLeadsPage';
// import { LeadDashboardPage } from './leadsdashboardPage';
// import { generateLeadData, LeadData } from './LeadFormData';

// test('Login, create dynamic lead, and verify first lead row in dashboard', async ({ page }) => {
//   test.setTimeout(120000); // 2-minute timeout

//   const loginPage = new LeadLoginPage(page);
//   const leadsPage = new LeadsPage(page);
//   const dashboardPage = new LeadDashboardPage(page);

//   // Step 1: Login
//   await loginPage.goto();
//   await loginPage.loginWithPhone('+80984-58992');
//   await loginPage.enterOTP([]);
//   await page.waitForTimeout(5000); // wait after OTP

//   // Step 2: Navigate to Leads page
//   await dashboardPage.page.locator('div', { hasText: /^Sales$/ }).locator('path').nth(1).click();
//   await dashboardPage.page.getByRole('link', { name: 'Leads' }).click();

//   // Step 3: Generate dynamic lead data
//   const leadData: LeadData = generateLeadData();

//   // Step 4: Fill and submit lead form
//   await leadsPage.clickAddLead();
//   await leadsPage.fillLeadForm({
//     name: leadData.name,
//     email: leadData.email,
//     phone: leadData.phone,
//     jobTitle: leadData.jobTitle,
//     company: leadData.company,
//     productSearch: 'h',
//     productSelect: leadData.product,
//     source: 'Social Media',
//     stage: 'New Inquiry',
//     permission: 'Allowed',
//   });
//   await leadsPage.submitForm();

//   // Step 5: Validate lead row in dashboard table
//   await page.waitForTimeout(5000); // wait for table to refresh

//   await dashboardPage.validateFirstLeadRow({
//     name: leadData.name,
//     email: leadData.email,
//     phone: leadData.phone,
//     company: leadData.company,
//     source: 'Social Media',
//     status: 'New Inquiry',
//     lastContactDate: new Date().toLocaleDateString('en-GB'), // format: DD/MM/YYYY
//   });

//   await page.waitForTimeout(5000);
// });