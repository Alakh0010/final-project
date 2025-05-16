import { useState, useCallback, useEffect } from 'react';
import { IQuery } from '../types';

// Helper function to convert Date to ISO string
const toISOString = (date: Date): string => date.toISOString();

const useQueries = () => {
  const [queries, setQueries] = useState<IQuery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedQuery, setSelectedQuery] = useState<IQuery | null>(null);

  // Mock data loading - replace with actual API calls
  useEffect(() => {
    const loadQueries = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch('/api/queries');
        // const data = await response.json();
        // setQueries(data);
        
        // Mock data for development
                const mockQueries: IQuery[] = [
          {
            _id: '1',
            title: 'Login Issue',
            description: 'Unable to login to the admin panel',
            status: 'pending',
            priority: 'high',
            createdAt: toISOString(new Date()),
            submittedBy: {
              _id: 'user1',
              name: 'John Doe',
              email: 'john@example.com'
            }
          },
          {
            _id: '2',
            title: 'Dashboard Loading',
            description: 'Dashboard takes too long to load',
            status: 'in-progress',
            priority: 'medium',
            createdAt: toISOString(new Date(Date.now() - 86400000)),
            submittedBy: {
              _id: 'user2',
              name: 'Jane Smith',
              email: 'jane@example.com'
            }
          },
          {
            _id: '3',
            title: 'Mobile Responsiveness',
            description: 'UI breaks on mobile devices',
            status: 'pending',
            priority: 'low',
            createdAt: toISOString(new Date(Date.now() - 172800000)),
            submittedBy: {
              _id: 'user3',
              name: 'Bob Johnson',
              email: 'bob@example.com'
            }
          }
        ];
        setQueries(mockQueries);
      } catch (err) {
        console.error('Error loading queries:', err);
        setError(err instanceof Error ? err : new Error('Failed to load queries'));
      } finally {
        setIsLoading(false);
      }
    };

    loadQueries();
  }, []);

  const updateQueryStatus = useCallback(async (queryId: string, status: IQuery['status']) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/queries/${queryId}/status`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ status }),
      //   headers: { 'Content-Type': 'application/json' },
      // });
      
      setQueries(prevQueries =>
        prevQueries.map(query =>
          query._id === queryId ? { ...query, status } : query
        )
      );
      return true;
    } catch (err) {
      console.error('Failed to update query status:', err);
      return false;
    }
  }, []);

  const deleteQuery = useCallback(async (queryId: string) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/queries/${queryId}`, { method: 'DELETE' });
      
      setQueries(prevQueries =>
        prevQueries.filter(query => query._id !== queryId)
      );
      return true;
    } catch (err) {
      console.error('Failed to delete query:', err);
      return false;
    }
  }, []);

  return {
    queries,
    isLoading,
    error,
    selectedQuery,
    setSelectedQuery,
    updateQueryStatus,
    deleteQuery,
  };
};

export default useQueries;
