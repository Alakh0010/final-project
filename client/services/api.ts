import axios from 'axios';
import { IUser, IQuery, IAuthResponse, IApiResponse } from '../shared/interfaces';

// Configure Axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// User services
export const userService = {
  // Get all users
  getUsers: async (): Promise<IUser[]> => {
    try {
      const response = await api.get('/users');
      return response.data.users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id: string): Promise<IUser | null> => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data.user;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      return null;
    }
  },

  // Create new user
  createUser: async (userData: Partial<IUser>): Promise<IUser> => {
    try {
      const response = await api.post('/users/register', userData);
      return response.data.user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (id: string, userData: Partial<IUser>): Promise<IUser | null> => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data.user;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      return null;
    }
  },

  // Delete user
  deleteUser: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/users/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      return false;
    }
  },

  // Authenticate user
  login: async (email: string, password: string): Promise<{ user: IUser, token: string } | null> => {
    try {
      const response = await api.post('/users/login', { email, password });
      // Store token in localStorage for the interceptor to use
      if (response.data.success && response.data.user.token) {
        localStorage.setItem('token', response.data.user.token);
      }
      return response.data.success ? { 
        user: response.data.user,
        token: response.data.user.token 
      } : null;
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }
};

// Query services
export const queryService = {
  // Get all queries
  getQueries: async (): Promise<IQuery[]> => {
    try {
      const response = await api.get('/queries');
      return response.data.queries;
    } catch (error) {
      console.error('Error fetching queries:', error);
      return [];
    }
  },

  // Get query by ID
  getQueryById: async (id: string): Promise<IQuery | null> => {
    try {
      const response = await api.get(`/queries/${id}`);
      return response.data.query;
    } catch (error) {
      console.error(`Error fetching query with ID ${id}:`, error);
      return null;
    }
  },

  // Create new query
  createQuery: async (queryData: Partial<IQuery>): Promise<IQuery | null> => {
    try {
      const response = await api.post('/queries', queryData);
      return response.data.query;
    } catch (error) {
      console.error('Error creating query:', error);
      return null;
    }
  },

  // Update query
  updateQuery: async (id: string, queryData: Partial<IQuery>): Promise<IQuery | null> => {
    try {
      const response = await api.put(`/queries/${id}`, queryData);
      return response.data.query;
    } catch (error) {
      console.error(`Error updating query ${id}:`, error);
      return null;
    }
  },

  // Delete query
  deleteQuery: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/queries/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting query ${id}:`, error);
      return false;
    }
  },

  // Add comment to query
  addComment: async (queryId: string, text: string): Promise<IQuery | null> => {
    try {
      const response = await api.post(`/queries/${queryId}/comments`, { text });
      return response.data.query;
    } catch (error) {
      console.error(`Error adding comment to query ${queryId}:`, error);
      return null;
    }
  }
};

// Default export with named services
export default {
  userService,
  queryService
};
