import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalQueries: 0,
    pendingQueries: 0,
    resolvedQueries: 0,
    usersCount: 0
  });
  const [recentQueries, setRecentQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get queries data
        const queriesResponse = await api.getQueries();
        const queries = queriesResponse.data.queries || [];
        
        // Get users data
        const usersResponse = await api.getUsers();
        const users = usersResponse.data.users || [];

        // Calculate stats
        const pendingQueries = queries.filter(q => q.status === 'pending' || q.status === 'in-progress');
        const resolvedQueries = queries.filter(q => q.status === 'resolved' || q.status === 'closed');
        
        // Set stats
        setStats({
          totalQueries: queries.length,
          pendingQueries: pendingQueries.length,
          resolvedQueries: resolvedQueries.length,
          usersCount: users.length
        });
        
        // Set recent queries (most recent 5)
        const sortedQueries = [...queries].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        ).slice(0, 5);
        
        setRecentQueries(sortedQueries);
        
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error-alert">{error}</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="actions">
          <Link to="/queries/new" className="btn btn-primary">New Query</Link>
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalQueries}</div>
          <div className="stat-label">Total Queries</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.pendingQueries}</div>
          <div className="stat-label">Pending Queries</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.resolvedQueries}</div>
          <div className="stat-label">Resolved Queries</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.usersCount}</div>
          <div className="stat-label">Total Users</div>
        </div>
      </div>
      
      <div className="recent-queries">
        <h2>Recent Queries</h2>
        {recentQueries.length === 0 ? (
          <p>No queries found</p>
        ) : (
          <div className="query-list">
            {recentQueries.map(query => (
              <div key={query._id} className="query-item">
                <div className="query-title">
                  <Link to={`/queries/${query._id}`}>{query.title}</Link>
                </div>
                <div className="query-meta">
                  <span className={`status status-${query.status}`}>{query.status}</span>
                  <span className="date">{new Date(query.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="view-all">
          <Link to="/queries">View All Queries</Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
