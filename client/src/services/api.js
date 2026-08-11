import axios from 'axios';

/**
 * Axios instance pre-configured for the LearnFlow API.
 * The base URL uses the Vite proxy in development (/api → :5000/api).
 */
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor — surface a clean error message from the API
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    // Attach clean message to the error for easy consumption in components
    error.userMessage = message;

    return Promise.reject(error);
  }
);

export default api;
