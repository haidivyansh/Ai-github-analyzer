import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT bearer token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Clean and informative error formatting & handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized and not already on /login or /register, optionally clear token
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        // Token might have expired
      }
    }

    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        error.message = 'The request timed out while contacting the server. Please try again.';
      } else {
        error.message = 'Unable to connect to the backend server. Please verify that the backend server is running on port 5000.';
      }
    } else if (error.response.status === 502 || error.response.status === 503 || error.response.status === 504) {
      const serverMessage = (typeof error.response.data === 'object' && error.response.data?.message)
        ? error.response.data.message
        : null;
      const friendlyMessage = serverMessage || 'Backend server is not responding (502 Bad Gateway). Please ensure the backend server is running on port 5000.';
      error.message = friendlyMessage;
      if (!error.response.data || typeof error.response.data !== 'object') {
        error.response.data = { success: false, message: friendlyMessage };
      } else {
        error.response.data.message = friendlyMessage;
      }
    } else if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    return Promise.reject(error);
  }
);

// Auth API Functions
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Health Check API
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

// GitHub REST APIs
export const getGithubRepository = async (url) => {
  const response = await api.get('/github/repository', { params: { url } });
  return response.data;
};

export const getGithubLanguages = async (url) => {
  const response = await api.get('/github/languages', { params: { url } });
  return response.data;
};

export const getGithubFiles = async (url) => {
  const response = await api.get('/github/files', { params: { url } });
  return response.data;
};

export const getGithubContributors = async (url) => {
  const response = await api.get('/github/contributors', { params: { url } });
  return response.data;
};

export const getGithubCommits = async (url) => {
  const response = await api.get('/github/commits', { params: { url } });
  return response.data;
};

// AI Analysis API
export const analyzeGithubRepository = async (url) => {
  const response = await api.post('/ai/analyze', { url });
  return response.data;
};

// MongoDB Repositories API Functions
export const getSavedRepositories = async () => {
  const response = await api.get('/repositories');
  return response.data;
};

export const getSavedRepositoryById = async (id) => {
  const response = await api.get(`/repositories/${id}`);
  return response.data;
};

export const saveRepositoryToDb = async (repoData) => {
  const response = await api.post('/repositories', repoData);
  return response.data;
};

export const deleteSavedRepository = async (id) => {
  const response = await api.delete(`/repositories/${id}`);
  return response.data;
};

export default api;
