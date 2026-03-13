import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchTasks = (params = {}) =>
  apiClient.get('/tasks', { params }).then((res) => res.data);

export const searchTasks = ({ q, status }) =>
  apiClient
    .get('/tasks/search', {
      params: { q, status }
    })
    .then((res) => res.data);

export const createTask = (payload) =>
  apiClient.post('/tasks', payload).then((res) => res.data);

export const updateTask = (id, payload) =>
  apiClient.put(`/tasks/${id}`, payload).then((res) => res.data);

export const deleteTask = (id) => apiClient.delete(`/tasks/${id}`);

