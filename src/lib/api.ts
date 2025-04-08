// Use environment variable for API URL with fallback
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://196.188.249.24:3010/api";

// Utility function to get the full API URL for a specific endpoint
export const getApiUrl = (endpoint: string) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_URL}/${cleanEndpoint}`;
};

// Utility function for making API requests with authentication
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(getApiUrl(endpoint), {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
};

export const loginUser = async (username: string, password: string) => {
  const res = await fetch(getApiUrl('auth/login'), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid username or password");
  }

  return res.json(); // { token: "..." }
};

export const saveToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};
