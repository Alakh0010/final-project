import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DatabaseContextType {
  isConnected: boolean;
}

const DatabaseContext = createContext<DatabaseContextType>({
  isConnected: true, // Always connected for development
});

export const useDatabase = () => useContext(DatabaseContext);

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  // For development, we'll always be connected
  const [isConnected] = useState(true);

  return <DatabaseContext.Provider value={{ isConnected }}>{children}</DatabaseContext.Provider>;
};

export default DatabaseContext;
