const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL 
const API_KEY = import.meta.env.VITE_BACKEND_API_KEY;

export const getApiHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'x-api-key': API_KEY || ''
});

export const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'An error occurred');
  }
  return response.json();
};

export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const headers = {
    ...getApiHeaders(),
    ...(options.headers || {})
  };

  const config: RequestInit = {
    ...options,
    headers,
    mode: 'cors',
    credentials: 'include'
  };

  const response = await fetch(`${BACKEND_API_URL}/api${endpoint}`, config);
  return handleApiError(response);
}; 