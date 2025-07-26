// Types for the API client
export interface ApiRequestConfig {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
  status: number;
  needsVerification?: boolean;
  email?: string;
}

// Default headers
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function apiRequest<T = any>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
  const {
    endpoint,
    method = 'GET',
    body
  } = config;

  try {
    // Construct the full URL
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: {
        ...DEFAULT_HEADERS
      }
    };

    // Add body for non-GET requests
    if (body && method !== 'GET') {
      if (body instanceof FormData) {
        // Remove Content-Type header for FormData (let browser set it)
        const headers = requestOptions.headers as Record<string, string>;
        delete headers['Content-Type'];
        requestOptions.body = body;
      } else {
        requestOptions.body = JSON.stringify(body);
      }
    }

    // Make the request
    const response = await fetch(url, requestOptions);
    
    // Parse response
    let responseData;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // Return successful response
    if (response.ok) {
      return {
        data: responseData,
        success: true,
        status: response.status,
        message: responseData?.message || 'Success',
        needsVerification: responseData?.needsVerification,
        email: responseData?.email
      };
    }

    // Handle error responses
    return {
      success: false,
      status: response.status,
      error: responseData?.error || responseData?.message || `HTTP ${response.status}: ${response.statusText}`,
      message: responseData?.message || 'Request failed',
      needsVerification: responseData?.needsVerification,
      email: responseData?.email
    };

  } catch (error) {
    // Handle network errors
    console.error('API Request Error:', error);
    
    return {
      success: false,
      status: 0,
      error: error instanceof Error ? error.message : 'Network error occurred',
      message: 'Failed to connect to server'
    };
  }
}

// Convenience methods for common HTTP operations
export const api = {
  /**
   * GET request
   */
  get: <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
    return apiRequest<T>({ endpoint, method: 'GET' });
  },

  /**
   * POST request
   */
  post: <T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> => {
    return apiRequest<T>({ endpoint, method: 'POST', body });
  },

  /**
   * PUT request
   */
  put: <T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> => {
    return apiRequest<T>({ endpoint, method: 'PUT', body });
  },

  /**
   * DELETE request
   */
  delete: <T = any>(endpoint: string): Promise<ApiResponse<T>> => {
    return apiRequest<T>({ endpoint, method: 'DELETE' });
  },

  /**
   * PATCH request
   */
  patch: <T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> => {
    return apiRequest<T>({ endpoint, method: 'PATCH', body });
  }
};

// Helper function to get authorization headers
export function getAuthHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Helper function for authenticated requests
async function authenticatedRequest<T = any>(config: ApiRequestConfig, token?: string): Promise<ApiResponse<T>> {
  const {
    endpoint,
    method = 'GET',
    body
  } = config;

  try {
    // Construct the full URL
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    // Prepare request options with auth headers
    const requestOptions: RequestInit = {
      method,
      credentials: 'include',
      headers: {
        ...DEFAULT_HEADERS,
        ...getAuthHeaders(token)
      }
    };

    // Add body for non-GET requests
    if (body && method !== 'GET') {
      if (body instanceof FormData) {
        // Remove Content-Type header for FormData (let browser set it)
        const headers = requestOptions.headers as Record<string, string>;
        delete headers['Content-Type'];
        requestOptions.body = body;
      } else {
        requestOptions.body = JSON.stringify(body);
      }
    }

    // Make the request
    const response = await fetch(url, requestOptions);
    
    // Parse response
    let responseData;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // Return successful response
    if (response.ok) {
      return {
        data: responseData,
        success: true,
        status: response.status,
        message: responseData?.message || 'Success',
        needsVerification: responseData?.needsVerification,
        email: responseData?.email
      };
    }

    // Handle error responses
    return {
      success: false,
      status: response.status,
      error: responseData?.error || responseData?.message || `HTTP ${response.status}: ${response.statusText}`,
      message: responseData?.message || 'Request failed',
      needsVerification: responseData?.needsVerification,
      email: responseData?.email
    };

  } catch (error) {
    // Handle network errors
    console.error('API Request Error:', error);
    
    return {
      success: false,
      status: 0,
      error: error instanceof Error ? error.message : 'Network error occurred',
      message: 'Failed to connect to server'
    };
  }
}

// Helper function for authenticated requests
export const authApi = {
  // Authenticated GET request  
  get: <T = any>(endpoint: string, token?: string): Promise<ApiResponse<T>> => {
    return authenticatedRequest<T>({ endpoint, method: 'GET' }, token);
  },

  // Authenticated POST request
  post: <T = any>(endpoint: string, body?: any, token?: string): Promise<ApiResponse<T>> => {
    return authenticatedRequest<T>({ endpoint, method: 'POST', body }, token);
  },

  // Authenticated PUT request
  put: <T = any>(endpoint: string, body?: any, token?: string): Promise<ApiResponse<T>> => {
    return authenticatedRequest<T>({ endpoint, method: 'PUT', body }, token);
  },

  // Authenticated DELETE request
  delete: <T = any>(endpoint: string, token?: string): Promise<ApiResponse<T>> => {
    return authenticatedRequest<T>({ endpoint, method: 'DELETE' }, token);
  },

  // Authenticated PATCH request
  patch: <T = any>(endpoint: string, body?: any, token?: string): Promise<ApiResponse<T>> => {
    return authenticatedRequest<T>({ endpoint, method: 'PATCH', body }, token);
  }
};

export default api;
