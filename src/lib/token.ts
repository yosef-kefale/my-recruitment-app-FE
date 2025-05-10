import { API_URL } from './api';

// Token storage keys
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Save tokens to localStorage
export const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

// Get access token
export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Get refresh token
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

// Clear tokens
export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Refresh token function
export const refreshToken = async () => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    saveTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch (error) {
    clearTokens();
    throw error;
  }
};

// Create an axios interceptor to handle token refresh
export const setupAxiosInterceptors = (axios: any) => {
  axios.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      const originalRequest = error.config;

      // If the error is 401 and we haven't tried to refresh the token yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newToken = await refreshToken();
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // If refresh token fails, redirect to login
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
}; 