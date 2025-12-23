import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (username, email, password) =>
    api.post('/api/auth/register', { username, email, password }),

  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),

  getCurrentUser: () =>
    api.get('/api/auth/me'),
};

// Saved Items API calls
export const savedItemsAPI = {
  getAll: () =>
    api.get('/api/saved-items'),

  search: (query) =>
    api.get('/api/saved-items/search', { params: { q: query } }),

  getById: (id) =>
    api.get(`/api/saved-items/${id}`),

  create: (itemData) =>
    api.post('/api/saved-items', itemData),

  update: (id, itemData) =>
    api.put(`/api/saved-items/${id}`, itemData),

  delete: (id) =>
    api.delete(`/api/saved-items/${id}`),

  addTag: (itemId, tagId) =>
    api.post(`/api/saved-items/${itemId}/tags`, { tagId }),

  removeTag: (itemId, tagId) =>
    api.delete(`/api/saved-items/${itemId}/tags/${tagId}`),

  markAsRead: (id) =>
    api.patch(`/api/saved-items/${id}/read`),

  bulkMarkAsRead: (itemIds) =>
    api.post('/api/saved-items/bulk/mark-read', { itemIds }),

  bulkMarkAsUnread: (itemIds) =>
    api.post('/api/saved-items/bulk/mark-unread', { itemIds }),

  bulkDelete: (itemIds) =>
    api.post('/api/saved-items/bulk/delete', { itemIds }),
};

// Tags API calls
export const tagsAPI = {
  getAll: () =>
    api.get('/api/tags'),

  getById: (id) =>
    api.get(`/api/tags/${id}`),

  create: (tagData) =>
    api.post('/api/tags', tagData),

  update: (id, tagData) =>
    api.put(`/api/tags/${id}`, tagData),

  delete: (id) =>
    api.delete(`/api/tags/${id}`),

  getItems: (tagId) =>
    api.get(`/api/tags/${tagId}/items`),
};

export default api;
