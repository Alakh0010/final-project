import axios from 'axios';
import { IUser, IQuery, IAuthResponse, IApiResponse } from '../shared/interfaces';
import { AuthResponse } from '../types/models';

// Configure Axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      return Promise.reject({
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error: No response received', error.request);
      return Promise.reject({ message: 'No response from server. Please check your connection.' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
      return Promise.reject({ message: error.message || 'An error occurred' });
    }
  }
);

// Add token to requests if available
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Mock data for development
const mockUsers: IUser[] = [
  {
    _id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0
  }
];

// Mock API services for development
const userService = {
  // Get all users
  getUsers: async (): Promise<IUser[]> => {
    console.log('Using mock data for getUsers');
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => resolve(mockUsers), 500);
    });
  },

  // Get user by ID
  getUserById: async (id: string): Promise<IUser | null> => {
    try {
      const user = mockUsers.find(user => user._id === id);
      return user || null;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      return null;
    }
  },

  // Create new user
  createUser: async (userData: Partial<IUser>): Promise<IUser> => {
    console.log('Using mock data for createUser', userData);
    return new Promise((resolve) => {
      const newUser: IUser = {
        ...userData,
        _id: `user${mockUsers.length + 1}`,
        name: userData.name || 'New User',
        email: userData.email || '',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0
      };
      mockUsers.push(newUser);
      setTimeout(() => resolve(newUser), 500);
    });
  },

  // Update user
  updateUser: async (id: string, userData: Partial<IUser>): Promise<IUser | null> => {
    try {
      const userIndex = mockUsers.findIndex(user => user._id === id);
      if (userIndex !== -1) {
        const updatedUser = { 
          ...mockUsers[userIndex], 
          ...userData,
          updatedAt: new Date()
        } as IUser;
        mockUsers[userIndex] = updatedUser;
        return updatedUser;
      }
      return null;
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
  authenticate: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/users/login', { email, password });
      const { user, token } = response.data;

      // Store token in localStorage for the interceptor to use
      localStorage.setItem('token', token);

      return {
        success: true,
        user,
        token,
        isAdmin: user.role === 'admin',
      };
    } catch (error) {
      console.error('Authentication error:', error);
      throw new Error('Authentication failed');
    }
  },
};

// Query services with mock data
const mockQueries: IQuery[] = [];

const queryService = {
  // Get all queries
  getQueries: async (): Promise<IQuery[]> => {
    console.log('Using mock data for getQueries');
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => resolve([...mockQueries]), 500);
    });
  },

  // Get query by ID
  getQueryById: async (id: string): Promise<IQuery | null> => {
    console.log('Using mock data for getQueryById:', id);
    return new Promise((resolve) => {
      const query = mockQueries.find(q => q._id === id) || null;
      setTimeout(() => resolve(query), 500);
    });
  },

  // Get queries by user
  getQueriesByUser: async (userId: string): Promise<IQuery[]> => {
    console.log('Using mock data for getQueriesByUser:', userId);
    return new Promise((resolve) => {
      const userQueries = mockQueries.filter(q => 
        typeof q.user === 'string' ? q.user === userId : q.user?._id === userId
      );
      setTimeout(() => resolve(userQueries), 500);
    });
  },

  // Create new query
  createQuery: async (queryData: Partial<IQuery>): Promise<IQuery> => {
    console.log('Using mock data for createQuery', queryData);
    return new Promise((resolve) => {
      const newQuery: IQuery = {
        ...queryData,
        _id: `query_${Date.now()}`,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0
      } as IQuery;
      
      mockQueries.push(newQuery);
      console.log('New query created:', newQuery);
      
      setTimeout(() => resolve(newQuery), 500);
    });
  },

  // Update query
  updateQuery: async (id: string, queryData: Partial<IQuery>): Promise<IQuery | null> => {
    try {
      const queryIndex = mockQueries.findIndex(query => query._id === id);
      if (queryIndex !== -1) {
        const updatedQuery = { 
          ...mockQueries[queryIndex], 
          ...queryData,
          updatedAt: new Date()
        } as IQuery;
        mockQueries[queryIndex] = updatedQuery;
        console.log('Updated query:', updatedQuery);
        return updatedQuery;
      }
      console.error(`Query with ID ${id} not found`);
      return null;
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

  // Get queries by status
  getQueriesByStatus: async (status: string): Promise<IQuery[]> => {
    try {
      const response = await api.get(`/queries?status=${status}`);
      return response.data.queries;
    } catch (error) {
      console.error(`Error fetching queries with status ${status}:`, error);
      return [];
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
  },
};

// Export the services individually
export { userService, queryService };

// Named API object for proper export
const API = {
  userService,
  queryService,
};

export default API;
