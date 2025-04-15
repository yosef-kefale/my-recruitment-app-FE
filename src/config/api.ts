// API Configuration
export const API_BASE_URL = 'http://196.188.249.24:3010/api';

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
}; 