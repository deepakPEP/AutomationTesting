import { request } from "@playwright/test";

async function globalSetup() {
  const phoneNo = '9591603604';
  //const phoneNo = process.env.TEST_PHONE_NO;

  if (!phoneNo) {
    throw new Error("TEST_PHONE_NO is not defined");
  }

  const apiContext = await request.newContext();

  const response = await apiContext.post(
    "http://13.234.126.192:4000/api/delete-user-related-data/sandbox",
    {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        phoneNo: phoneNo,
      },
    }
  );

  if (!response.ok()) {
    const text = await response.text();
    throw new Error(
      `Delete user data API failed: ${response.status()} - ${text}`
    );
  }

  console.log(`✅ User data deleted successfully for phone: ${phoneNo}`);
}

export default globalSetup;
