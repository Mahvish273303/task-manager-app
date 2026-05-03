import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token when available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('tm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401 (expired / invalid token) — clear session and go to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tm_token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Task API
export const fetchTasks = (params = {}) =>
  apiClient.get('/tasks', { params }).then((res) => res.data);

export const searchTasks = ({ q, status }) =>
  apiClient.get('/tasks/search', { params: { q, status } }).then((res) => res.data);

export const createTask = (payload) =>
  apiClient.post('/tasks', payload).then((res) => res.data);

export const updateTask = (id, payload) =>
  apiClient.put(`/tasks/${id}`, payload).then((res) => res.data);

export const deleteTask = (id) => apiClient.delete(`/tasks/${id}`);

// Auth API
export const register = (payload) =>
  apiClient.post('/auth/register', payload).then((res) => res.data);

export const login = (payload) =>
  apiClient.post('/auth/login', payload).then((res) => res.data);
