import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/api';
import { useDatabase } from '../context/DatabaseContext';
import { IUser, AuthResponse } from '../types/models';

interface UserServiceHookResult {
  users: Partial<IUser>[];
  loading: boolean;
  error: Error | null;
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: string) => Promise<Partial<IUser> | null>;
  createUser: (userData: Partial<IUser>) => Promise<Partial<IUser> | null>;
  updateUser: (id: string, userData: Partial<IUser>) => Promise<Partial<IUser> | null>;
  deleteUser: (id: string) => Promise<boolean>;
  authenticate: (email: string, password: string) => Promise<AuthResponse | null>;
}

/**
 * Custom hook for user-related operations
 */
export const useUserService = (): UserServiceHookResult => {
  const [users, setUsers] = useState<Partial<IUser>[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { isConnected } = useDatabase();

  const fetchUsers = useCallback(async () => {
    if (!isConnected) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  const fetchUserById = useCallback(async (id: string): Promise<Partial<IUser> | null> => {
    if (!isConnected) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const user = await userService.getUserById(id);
      return user;
    } catch (err) {
      setError(err as Error);
      console.error(`Error fetching user ${id}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  const createUser = useCallback(async (userData: Partial<IUser>): Promise<Partial<IUser> | null> => {
    if (!isConnected) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const newUser = await userService.createUser(userData);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating user:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  const updateUser = useCallback(async (id: string, userData: Partial<IUser>): Promise<Partial<IUser> | null> => {
    if (!isConnected) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await userService.updateUser(id, userData);
      
      if (updatedUser) {
        setUsers(prev => 
          prev.map(user => (user._id === id ? updatedUser : user))
        );
      }
      
      return updatedUser;
    } catch (err) {
      setError(err as Error);
      console.error(`Error updating user ${id}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    if (!isConnected) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const success = await userService.deleteUser(id);
      
      if (success) {
        setUsers(prev => prev.filter(user => user._id !== id));
      }
      
      return success;
    } catch (err) {
      setError(err as Error);
      console.error(`Error deleting user ${id}:`, err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  const authenticate = useCallback(async (email: string, password: string): Promise<AuthResponse | null> => {
    if (!isConnected) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await userService.authenticate(email, password);
      return result;
    } catch (err) {
      setError(err as Error);
      console.error('Authentication error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  // Load users when the database is connected
  useEffect(() => {
    if (isConnected) {
      fetchUsers();
    }
  }, [isConnected, fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    authenticate
  };
};

export default useUserService;
