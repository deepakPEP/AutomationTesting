// src/utils/PhoneNumberGenerator.ts

/**
 * Simple phone number generator for test cases
 * Generates 10-digit numbers starting with 95000 + 5 random digits
 */

/**
 * Generate a random 10-digit phone number starting with 95000
 * @returns Phone number string (e.g., "9500012345")
 */
export function generateTestPhoneNumber(): string {
  const prefix = "95000";
  const randomSuffix = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return prefix + randomSuffix;
}