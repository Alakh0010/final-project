import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import dbConnection, { ConnectionState } from '../db/connection';
import { config } from '../config/env';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'failed';

interface ConnectionStats {
  lastConnectedAt: Date | null;
  connectionAttempts: number;
  reconnectAttempts: number;
  successfulConnections: number;
  failedConnections: number;
}

interface DatabaseContextType {
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  error: Error | null;
  stats: ConnectionStats;
  lastChecked: Date | null;
  reconnect: () => Promise<boolean>;
  checkConnection: () => Promise<boolean>;
}

const initialStats: ConnectionStats = {
  lastConnectedAt: null,
  connectionAttempts: 0,
  reconnectAttempts: 0,
  successfulConnections: 0,
  failedConnections: 0
};

const DatabaseContext = createContext<DatabaseContextType>({
  isConnected: false,
  connectionStatus: 'disconnected',
  error: null,
  stats: initialStats,
  lastChecked: null,
  reconnect: async () => false,
  checkConnection: async () => false
});

export const useDatabase = () => useContext(DatabaseContext);

interface DatabaseProviderProps {
  children: ReactNode;
  autoReconnect?: boolean;
  reconnectInterval?: number; // ms
  maxReconnectAttempts?: number;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ 
  children, 
  autoReconnect = true,
  reconnectInterval = 30000, // 30 seconds
  maxReconnectAttempts = 3
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState<ConnectionStats>(initialStats);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [reconnectTimer, setReconnectTimer] = useState<NodeJS.Timeout | null>(null);

  // Update connection stats
  const updateStats = useCallback((updates: Partial<ConnectionStats>) => {
    setStats(prevStats => ({
      ...prevStats,
      ...updates
    }));
  }, []);

  // Connect to the database
  const connectToDatabase = useCallback(async (isReconnect = false): Promise<boolean> => {
    try {
      if (isReconnect) {
        setConnectionStatus('reconnecting');
        setStats(prevStats => ({
          ...prevStats,
          reconnectAttempts: prevStats.reconnectAttempts + 1
        }));
        console.log(`🔄 Attempting to reconnect to MongoDB Atlas (attempt ${stats.reconnectAttempts + 1}/${maxReconnectAttempts})...`);
      } else {
        setConnectionStatus('connecting');
        setStats(prevStats => ({
          ...prevStats,
          connectionAttempts: prevStats.connectionAttempts + 1
        }));
        console.log('🔄 Attempting to connect to MongoDB Atlas...');
      }

      const state = await dbConnection.connect();
      
      setIsConnected(state.isConnected);
      setConnectionStatus(state.isConnected ? 'connected' : 'failed');
      setError(state.error);
      setLastChecked(state.lastChecked);
      
      if (state.isConnected) {
        setStats(prevStats => ({
          ...prevStats,
          lastConnectedAt: state.lastChecked,
          successfulConnections: prevStats.successfulConnections + 1
        }));
      } else {
        setStats(prevStats => ({
          ...prevStats,
          failedConnections: prevStats.failedConnections + 1
        }));
      }
      
      return state.isConnected;
    } catch (err) {
      setIsConnected(false);
      setConnectionStatus('failed');
      setError(err as Error);
      setLastChecked(new Date());
      setStats(prevStats => ({
        ...prevStats,
        failedConnections: prevStats.failedConnections + 1
      }));
      
      console.error(`❌ Failed to ${isReconnect ? 're' : ''}connect to MongoDB Atlas:`, err);
      return false;
    }
  }, [maxReconnectAttempts, stats]);

  // Reconnect to the database
  const reconnect = useCallback(async (): Promise<boolean> => {
    // Clear any existing reconnect timer
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      setReconnectTimer(null);
    }
    
    return connectToDatabase(true);
  }, [connectToDatabase, reconnectTimer]);

  // Check the connection status
  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      console.log('🔍 Checking database connection...');
      const isConnected = await dbConnection.checkConnection();
      const state = dbConnection.getState();
      
      setIsConnected(isConnected);
      setConnectionStatus(isConnected ? 'connected' : 'failed');
      setError(state.error);
      setLastChecked(state.lastChecked);
      
      if (isConnected) {
        setStats(prevStats => ({
          ...prevStats,
          lastConnectedAt: state.lastChecked,
          successfulConnections: prevStats.successfulConnections + 1
        }));
        console.log('✅ Database connection is active');
      } else {
        setStats(prevStats => ({
          ...prevStats,
          failedConnections: prevStats.failedConnections + 1
        }));
        console.error('❌ Database connection check failed');
      }
      
      return isConnected;
    } catch (err) {
      setIsConnected(false);
      setConnectionStatus('failed');
      setError(err as Error);
      setLastChecked(new Date());
      setStats(prevStats => ({
        ...prevStats,
        failedConnections: prevStats.failedConnections + 1
      }));
      
      console.error('❌ Database connection check failed:', err);
      return false;
    }
  }, []);

  // Initial connection
  useEffect(() => {
    connectToDatabase();
    
    // Set up periodic connection checks
    const checkInterval = setInterval(() => {
      checkConnection();
    }, reconnectInterval * 2); // Check connection every 2x the reconnect interval
    
    return () => {
      clearInterval(checkInterval);
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
    };
  }, [connectToDatabase, checkConnection, reconnectInterval, reconnectTimer]);

  // Auto-reconnect when connection fails
  useEffect(() => {
    if (autoReconnect && connectionStatus === 'failed' && stats.reconnectAttempts < maxReconnectAttempts) {
      const timer = setTimeout(() => {
        reconnect();
      }, reconnectInterval);
      
      setReconnectTimer(timer);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [autoReconnect, connectionStatus, maxReconnectAttempts, reconnect, reconnectInterval, stats.reconnectAttempts]);

  return (
    <DatabaseContext.Provider value={{
      isConnected,
      connectionStatus,
      error,
      stats,
      lastChecked,
      reconnect,
      checkConnection
    }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export default DatabaseContext;
