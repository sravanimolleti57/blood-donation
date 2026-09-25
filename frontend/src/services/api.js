import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  const isBrowser = typeof window !== 'undefined';
  const isNonLocalhost =
    isBrowser && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

  // If VITE_API_URL is explicitly set:
  if (envUrl) {
    // Prevent localhost:5000 from being hardcoded into production builds deployed on Vercel or remote host
    if ((import.meta.env.PROD || isNonLocalhost) && envUrl.includes('localhost:5000')) {
      return '/api';
    }
    return envUrl.replace(/\/$/, '');
  }

  // Default for production / deployed non-localhost web environments:
  if (import.meta.env.PROD || isNonLocalhost) {
    return '/api';
  }

  // Default for local development:
  return 'http://localhost:5000/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token if present in localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 Session Expiry globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or unauthorized
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Dispatch custom session expired event or redirect
        window.dispatchEvent(new Event('session-expired'));
      }
    }
    return Promise.reject(error);
  }
);

export default API;
