// src/utils/ApiHelpers.ts

import { APIRequestContext, expect } from '@playwright/test';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

export interface DeleteByPhoneResponse {
  results: Array<{
    userId: string;
    businessId: string;
    userDeleted: boolean;
    businessDeleted: boolean;
  }>;
}

/**
 * API Helper class for common API operations
 */
export class ApiHelpers {
  private baseUrl: string;
  private request: APIRequestContext;

  constructor(request: APIRequestContext, baseUrl: string = 'http://13.234.126.192:4000') {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  /**
   * Delete user and business data by phone number
   * @param phoneNo - Phone number to delete (e.g., "9999664400")
   * @returns Promise with deletion results
   */
  async deleteByPhone(phoneNo: string): Promise<ApiResponse<DeleteByPhoneResponse>> {
    try {
      console.log(`🗑️ Deleting data for phone: ${phoneNo}`);
      
      const response = await this.request.post(`${this.baseUrl}/api/delete-by-phone`, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          phoneNo: phoneNo
        }
      });

      const status = response.status();
      const responseBody = await response.json().catch(() => ({}));

      if (status >= 200 && status < 300) {
        console.log(`✅ Successfully deleted data for phone: ${phoneNo}`);
        console.log('📋 Deletion results:', JSON.stringify(responseBody, null, 2));
        
        return {
          success: true,
          data: responseBody as DeleteByPhoneResponse,
          status
        };
      } else {
        console.error(`❌ Failed to delete data for phone: ${phoneNo}. Status: ${status}`);
        return {
          success: false,
          error: `HTTP ${status}: ${JSON.stringify(responseBody)}`,
          status
        };
      }
    } catch (error) {
      console.error(`❌ API Error deleting phone ${phoneNo}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 0
      };
    }
  }

  /**
   * Generic POST request helper
   * @param endpoint - API endpoint (e.g., "/api/users")
   * @param data - Request body data
   * @param headers - Additional headers
   */
  async post<T = any>(
    endpoint: string, 
    data: any, 
    headers: Record<string, string> = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.request.post(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        data
      });

      const status = response.status();
      const responseBody = await response.json().catch(() => ({}));

      return {
        success: status >= 200 && status < 300,
        data: responseBody,
        status,
        error: status >= 400 ? `HTTP ${status}` : undefined
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 0
      };
    }
  }

  /**
   * Generic GET request helper
   * @param endpoint - API endpoint
   * @param headers - Additional headers
   */
  async get<T = any>(
    endpoint: string, 
    headers: Record<string, string> = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.request.get(`${this.baseUrl}${endpoint}`, {
        headers
      });

      const status = response.status();
      const responseBody = await response.json().catch(() => ({}));

      return {
        success: status >= 200 && status < 300,
        data: responseBody,
        status,
        error: status >= 400 ? `HTTP ${status}` : undefined
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 0
      };
    }
  }

  /**
   * Validate deletion was successful
   * @param result - Delete API response
   * @param expectUserDeleted - Whether user should be deleted
   * @param expectBusinessDeleted - Whether business should be deleted
   */
  validateDeletion(
    result: DeleteByPhoneResponse, 
    expectUserDeleted: boolean = true, 
    expectBusinessDeleted: boolean = true
  ) {
    if (!result.results || result.results.length === 0) {
      throw new Error('No deletion results found');
    }

    const deletionResult = result.results[0];
    
    if (expectUserDeleted) {
      expect(deletionResult.userDeleted).toBe(true);
      console.log(`✅ User deleted: ${deletionResult.userId}`);
    }
    
    if (expectBusinessDeleted) {
      expect(deletionResult.businessDeleted).toBe(true);
      console.log(`✅ Business deleted: ${deletionResult.businessId}`);
    }
  }
}

/**
 * Standalone function for quick phone deletion
 * @param request - Playwright APIRequestContext
 * @param phoneNo - Phone number to delete
 */
export async function deleteUserByPhone(
  request: APIRequestContext, 
  phoneNo: string
): Promise<ApiResponse<DeleteByPhoneResponse>> {
  const apiHelper = new ApiHelpers(request);
  return await apiHelper.deleteByPhone(phoneNo);
}

/**
 * Clean up test data before/after tests
 * @param request - Playwright APIRequestContext
 * @param phoneNumbers - Array of phone numbers to clean up
 */
export async function cleanupTestData(
  request: APIRequestContext, 
  phoneNumbers: string[]
): Promise<void> {
  console.log(`🧹 Cleaning up test data for ${phoneNumbers.length} phone numbers...`);
  
  const apiHelper = new ApiHelpers(request);
  
  for (const phoneNo of phoneNumbers) {
    await apiHelper.deleteByPhone(phoneNo);
  }
  
  console.log('✅ Test data cleanup completed');
}