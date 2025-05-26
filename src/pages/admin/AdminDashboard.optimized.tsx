import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/admin/Sidebar';
import useQueries from '../../hooks/useQueries';
import ErrorBoundary from '../../components/ErrorBoundary';
import styles from './AdminDashboard.module.css';
import { IQuery, INotification, IUser, IDashboardStats } from '../../types';

// Import only the icons we need
import { BellIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Use the custom hook for queries management
  const {
    queries,
    isLoading,
    error,
    selectedQuery,
    setSelectedQuery,
    updateQueryStatus,
    deleteQuery,
  } = useQueries();

  // Filter queries based on search input
  const filteredQueries = useMemo(() => {
    if (!searchQuery.trim()) return queries;

    const query = searchQuery.toLowerCase();
    return queries.filter(
      q =>
        q.title.toLowerCase().includes(query) ||
        q.description.toLowerCase().includes(query) ||
        q.status.toLowerCase().includes(query) ||
        q.priority.toLowerCase().includes(query)
    );
  }, [queries, searchQuery]);

  // Handle tab change with useCallback to prevent unnecessary re-renders
  const handleTabChange = useCallback((tab: string) => {
    if (tab === 'collapse' || tab === 'expand') {
      setSidebarCollapsed(prev => !prev);
    } else {
      setActiveTab(tab);
    }
  }, []);

  // Handle logout
  const handleLogout = useCallback(() => {
    logout();
    navigate('/admin-login');
  }, [logout, navigate]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded">
        <h2 className="text-lg font-bold">Error loading dashboard</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navigation */}
          <header className="bg-white shadow-sm z-10">
            <div className="flex items-center justify-between p-4">
              <h1 className="text-xl font-semibold text-gray-800 capitalize">{activeTab}</h1>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>

                <button className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none">
                  <BellIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4">
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
                {/* Add dashboard widgets here */}
              </div>
            )}

            {activeTab === 'queries' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Query Management</h2>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted By
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredQueries.map(query => (
                        <tr key={query._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{query.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {query.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                query.status === 'resolved'
                                  ? 'bg-green-100 text-green-800'
                                  : query.status === 'in-progress'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {query.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {query.priority}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {query.submittedBy?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(query.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => setSelectedQuery(query)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              View
                            </button>
                            <button className="text-red-600 hover:text-red-900">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">User Management</h2>
                {/* User management content */}
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Settings</h2>
                {/* Settings content */}
              </div>
            )}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AdminDashboard;
