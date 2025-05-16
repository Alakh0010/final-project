import { useState, useEffect, useCallback } from 'react';
import { queryService } from '../services/api';
import { useDatabase } from '../context/DatabaseContext';
import { IQuery } from '../types/models';

interface QueryServiceHookResult {
  queries: IQuery[];
  loading: boolean;
  error: Error | null;
  fetchQueries: () => Promise<void>;
  fetchQueryById: (id: string) => Promise<IQuery | null>;
  fetchQueriesByUser: (userId: string) => Promise<IQuery[]>;
  fetchQueriesByStatus: (status: string) => Promise<IQuery[]>;
  createQuery: (queryData: Partial<IQuery>) => Promise<IQuery | null>;
  updateQuery: (id: string, queryData: Partial<IQuery>) => Promise<IQuery | null>;
  deleteQuery: (id: string) => Promise<boolean>;
}

/**
 * Custom hook for query-related operations
 */
export const useQueryService = (): QueryServiceHookResult => {
  const [queries, setQueries] = useState<IQuery[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { isConnected } = useDatabase();

  const fetchQueries = useCallback(async () => {
    if (!isConnected) {
      console.log('⚠️ Database not connected - cannot fetch queries');
      return;
    }
    
    console.log('🔍 Attempting to fetch queries from MongoDB...');
    setLoading(true);
    setError(null);
    
    try {
      const data = await queryService.getQueries();
      console.log(`✅ Successfully fetched ${data.length} queries:`, data);
      setQueries(data);
    } catch (err) {
      setError(err as Error);
      console.error('❌ Error fetching queries:', err);
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  const fetchQueryById = useCallback(async (id: string): Promise<IQuery | null> => {
    if (!isConnected) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const query = await queryService.getQueryById(id);
      return query;
    } catch (err) {
      setError(err as Error);
      console.error(`Error fetching query ${id}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  const fetchQueriesByUser = useCallback(async (userId: string): Promise<IQuery[]> => {
    if (!isConnected) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const userQueries = await queryService.getQueriesByUser(userId);
      return userQueries;
    } catch (err) {
      setError(err as Error);
      console.error(`Error fetching queries for user ${userId}:`, err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  const fetchQueriesByStatus = useCallback(async (status: string): Promise<IQuery[]> => {
    if (!isConnected) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const statusQueries = await queryService.getQueriesByStatus(status);
      return statusQueries;
    } catch (err) {
      setError(err as Error);
      console.error(`Error fetching queries with status ${status}:`, err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  const createQuery = useCallback(async (queryData: Partial<IQuery>): Promise<IQuery | null> => {
    if (!isConnected) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const newQuery = await queryService.createQuery(queryData);
      if (newQuery) {
        setQueries(prev => [newQuery, ...prev]);
      }
      return newQuery;
    } catch (err) {
      setError(err as Error);
      console.error('Error creating query:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  const updateQuery = useCallback(async (id: string, queryData: Partial<IQuery>): Promise<IQuery | null> => {
    if (!isConnected) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedQuery = await queryService.updateQuery(id, queryData);
      
      if (updatedQuery) {
        setQueries(prev => 
          prev.map(query => query._id === id ? updatedQuery : query)
        );
      }
      
      return updatedQuery || null;
    } catch (err) {
      setError(err as Error);
      console.error(`Error updating query ${id}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  const deleteQuery = useCallback(async (id: string): Promise<boolean> => {
    if (!isConnected) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const success = await queryService.deleteQuery(id);
      
      if (success) {
        setQueries(prev => prev.filter(query => query._id !== id));
      }
      
      return success;
    } catch (err) {
      setError(err as Error);
      console.error(`Error deleting query ${id}:`, err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  // Load queries when the database is connected
  useEffect(() => {
    if (isConnected) {
      fetchQueries();
    }
  }, [isConnected, fetchQueries]);

  return {
    queries,
    loading,
    error,
    fetchQueries,
    fetchQueryById,
    fetchQueriesByUser,
    fetchQueriesByStatus,
    createQuery,
    updateQuery,
    deleteQuery
  };
};

export default useQueryService;
