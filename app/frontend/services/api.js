import axios from 'axios';

// Create API instance with base URL
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API service object with methods for all endpoints
const api = {
  // Auth
  login: (email, password) => apiClient.post('/users/login', { email, password }),
  register: (userData) => apiClient.post('/users/register', userData),
  getCurrentUser: () => apiClient.get('/users/me'),
  
  // Users
  getUsers: () => apiClient.get('/users'),
  getUser: (id) => apiClient.get(`/users/${id}`),
  updateUser: (id, data) => apiClient.put(`/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
  
  // Queries
  getQueries: () => apiClient.get('/queries'),
  getUserQueries: () => apiClient.get('/queries/my-queries'),
  getQuery: (id) => apiClient.get(`/queries/${id}`),
  createQuery: (data) => apiClient.post('/queries', data),
  updateQuery: (id, data) => apiClient.put(`/queries/${id}`, data),
  deleteQuery: (id) => apiClient.delete(`/queries/${id}`),
  addComment: (queryId, text) => apiClient.post(`/queries/${queryId}/comments`, { text })
};

export default api;
