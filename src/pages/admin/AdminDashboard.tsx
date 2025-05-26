import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ToastNotification';
import axios from 'axios';
import './AdminDashboard.css';

// Types
interface Query {
  id: number;
  userName: string;
  userEmail: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  brand: string;
  section: string;
  description: string;
  attachment: string;
  status: string;
  date: string;
  assignedTo: string;
  lastUpdated: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Icons
import { 
  FiLogOut,
  FiSearch,
  FiMenu,
  FiX,
  FiUser,
  FiMail,
  FiShield,
  FiChevronDown,
  FiBell,
  FiSettings,
  FiBarChart2,
  FiHelpCircle,
  FiMessageSquare,
  FiCheck,
  FiChevronRight,
  FiUsers,
  FiFileText,
  FiInbox,
  FiDownload
} from 'react-icons/fi';

// Mock data - replace with actual API calls
const mockUsers = [
  { id: 1, name: 'Aarav Patel', email: 'aarav@example.com', role: 'Admin' },
  { id: 2, name: 'Priya Sharma', email: 'priya@example.com', role: 'User' },
  { id: 3, name: 'Rahul Gupta', email: 'rahul@example.com', role: 'User' },
];

const brands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour', 'New Balance'];
const sections = ['Men', 'Women', 'Kids', 'Sports', 'Accessories', 'Sale'];
const priorities = ['Low', 'Medium', 'High', 'Urgent'];

// No mock queries - we'll only use data from the API
const mockQueries: Query[] = [];

// Dashboard statistics type
type DashboardStats = {
  totalQueries: number;
  resolvedQueries: number;
  pendingQueries: number;
  avgResponseTime: string;
  queryTrend: number[];
  categories: Array<{
    name: string;
    count: number;
    color: string;
  }>;
  recentActivities: Array<{
    id: number;
    user: string;
    action: string;
    time: string;
  }>;
  userSatisfaction: number;
};

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, isAdmin, userName, userEmail, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [queries, setQueries] = useState<Query[]>([]);
  const [filteredQueries, setFilteredQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [statusDropdown, setStatusDropdown] = useState<number | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalQueries: 124,
    resolvedQueries: 89,
    pendingQueries: 35,
    avgResponseTime: '2h 15m',
    queryTrend: [45, 52, 60, 55, 70, 65, 80, 75, 85, 90, 95, 100],
    categories: [
      { name: 'Technical Issues', count: 45, color: '#3B82F6' },
      { name: 'Account', count: 32, color: '#10B981' },
      { name: 'Billing', count: 18, color: '#F59E0B' },
      { name: 'General', count: 25, color: '#8B5CF6' },
      { name: 'Feature Request', count: 14, color: '#EC4899' },
    ],
    recentActivities: [
      { id: 1, user: 'Aarav Patel', action: 'resolved query #123', time: '5 min ago' },
      { id: 2, user: 'Neha Singh', action: 'submitted a new query', time: '15 min ago' },
      { id: 3, user: 'Vikram Mehta', action: 'commented on query #120', time: '25 min ago' },
      { id: 4, user: 'Ananya Reddy', action: 'updated profile information', time: '1 hour ago' },
      { id: 5, user: 'System', action: 'scheduled maintenance', time: '2 hours ago' },
    ],
    userSatisfaction: 87,
  });
  
  const { showToast } = useToast();
  const notificationsPanelRef = React.useRef<HTMLDivElement>(null);
  const notificationButtonRef = React.useRef<HTMLButtonElement>(null);

  // Use a ref to track if welcome message has been shown
  const welcomeShown = React.useRef(false);

  // Close notifications when clicking outside
  // Fetch queries from the backend
  const fetchQueries = useCallback(async () => {
    try {
      setLoading(true);
      // Use the full URL with the localhost address to avoid relative path issues
      const response = await axios.get('http://localhost:3001/api/queries');
      if (response.data && Array.isArray(response.data)) {
        setQueries(response.data);
        // Only show toast on successful data update if there are items
        if (response.data.length > 0) {
          showToast('Query data updated', 'info');
        }
      }
    } catch (error) {
      console.error('Error fetching queries:', error);
      showToast('Failed to fetch query data. Make sure the server is running.', 'error');
      // Set empty array for queries
      setQueries([]);
    } finally {
      // Always set loading to false to prevent infinite loading state
      setLoading(false);
    }
  }, [showToast]);

  // Initial data fetch
  useEffect(() => {
    // Initial fetch
    fetchQueries();
    
    // Set up polling for real-time updates - check for new queries every 10 seconds
    // Reduced from 30 seconds to 10 seconds for quicker updates
    const intervalId = setInterval(fetchQueries, 10000);
    
    return () => clearInterval(intervalId);
  }, [fetchQueries]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showNotifications &&
        notificationsPanelRef.current &&
        !notificationsPanelRef.current.contains(event.target as Node) &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Show notifications on component mount
  useEffect(() => {
    // Only show notifications if they haven't been shown yet
    if (!welcomeShown.current) {
      // Show welcome notification on first load
      const timer = setTimeout(() => {
        showToast('Welcome back! You have 3 new queries to review.', 'info');
      }, 1000);

      // Show system notification after 5 seconds
      const systemTimer = setTimeout(() => {
        showToast('System maintenance scheduled for tonight at 2 AM', 'warning');
      }, 5000);

      welcomeShown.current = true;

      return () => {
        clearTimeout(timer);
        clearTimeout(systemTimer);
      };
    }
  }, [showToast]);

  const [notifications] = useState([
    {
      id: 1,
      message: 'New high-priority query from Jane Smith',
      time: '5 min ago',
      read: false,
      type: 'new_query',
      queryId: 1012,
    },
    {
      id: 2,
      message: 'Query #1234 has been automatically resolved',
      time: '2 hours ago',
      read: false,
      type: 'query_resolved',
      queryId: 1234,
    },
    {
      id: 3,
      message: 'System maintenance scheduled for tonight at 2 AM',
      time: '1 day ago',
      read: true,
      type: 'system',
    },
    {
      id: 4,
      message: 'New user registration: Michael Brown',
      time: '3 hours ago',
      read: false,
      type: 'new_user',
      userId: 45,
    },
    {
      id: 5,
      message: 'Weekly report is ready for review',
      time: '1 day ago',
      read: true,
      type: 'report',
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const statusOptions = ['Pending', 'In Progress', 'Resolved'];

  // Filter queries based on search term

  // Handle logout
  const handleLogout = useCallback(() => {
    showToast('Logging out...', 'info');
    setTimeout(() => {
      logout();
      navigate('/login');
      showToast('Successfully logged out', 'success');
    }, 1000);
  }, [logout, navigate, showToast]);

  // Toggle sidebar on mobile
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Toggle notifications panel
  const toggleNotifications = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNotifications(prev => !prev);
  };

  // Toggle status dropdown for a query
  const toggleStatusDropdown = (e: React.MouseEvent, queryId: number) => {
    e.stopPropagation();
    setStatusDropdown(prev => (prev === queryId ? null : queryId));
  };

  // Handle status change from select element
  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>, queryId: number) => {
    const newStatus = e.target.value;
    try {
      // Update status in the backend
      await axios.put(`/api/queries/${queryId}`, { status: newStatus });
      
      // Update local state
      setQueries(prevQueries =>
        prevQueries.map(query =>
          query.id === queryId 
            ? { 
                ...query, 
                status: newStatus,
                lastUpdated: new Date().toLocaleString()
              } 
            : query
        )
      );
      
      showToast(`Query status updated to ${newStatus}`, 'success');
    } catch (error) {
      console.error('Error updating query status:', error);
      showToast('Failed to update query status', 'error');
    }
  };

  const handleAssignToMe = async (queryId: number) => {
    try {
      // Update assignment in the backend
      await axios.put(`/api/queries/${queryId}`, { 
        assignedTo: userName || 'Current User',
        lastUpdated: new Date().toLocaleString() 
      });
      
      // Update local state
      setQueries(prevQueries =>
        prevQueries.map(query =>
          query.id === queryId && !query.assignedTo 
            ? { 
                ...query, 
                assignedTo: userName || 'Current User',
                lastUpdated: new Date().toLocaleString() 
              } 
            : query
        )
      );
      
      showToast('Query assigned to you', 'success');
    } catch (error) {
      console.error('Error assigning query:', error);
      showToast('Failed to assign query', 'error');
    }
  };

  const handleResolve = async (queryId: number) => {
    try {
      // Update status in the backend
      await axios.put(`/api/queries/${queryId}`, { 
        status: 'Resolved',
        lastUpdated: new Date().toLocaleString() 
      });
      
      // Update local state
      setQueries(prevQueries =>
        prevQueries.map(query =>
          query.id === queryId 
            ? { 
                ...query, 
                status: 'Resolved',
                lastUpdated: new Date().toLocaleString() 
              } 
            : query
        )
      );
      
      showToast('Query marked as resolved', 'success');
    } catch (error) {
      console.error('Error resolving query:', error);
      showToast('Failed to resolve query', 'error');
    }
  };

  // Update query status
  const updateQueryStatus = (queryId: number, newStatus: string) => {
    const updatedQueries = queries.map(query =>
      query.id === queryId ? { ...query, status: newStatus } : query
    );
    setQueries(updatedQueries);
    setFilteredQueries(prev => 
      prev.map(query => 
        query.id === queryId ? { ...query, status: newStatus } : query
      )
    );
    setStatusDropdown(null);

    // Show success notification
    showToast(`Query #${queryId} status updated to ${newStatus}`, 'success');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (statusDropdown !== null) {
        setStatusDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [statusDropdown]);

  // Update filtered queries when search term, queries, or status filter change
  useEffect(() => {
    const filtered = queries.filter(query => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = 
        query.userName.toLowerCase().includes(searchTermLower) ||
        query.description.toLowerCase().includes(searchTermLower) ||
        query.brand.toLowerCase().includes(searchTermLower) ||
        query.section.toLowerCase().includes(searchTermLower) ||
        query.priority.toLowerCase().includes(searchTermLower);
      
      const matchesStatus = statusFilter === 'All' || query.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    setFilteredQueries(filtered);
  }, [searchTerm, queries, statusFilter]);

  // Filter users based on search input
  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if user is authenticated and admin, if not redirect to login
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/admin-login');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Quick Query Resolver</h2>
          <button className="close-sidebar" onClick={toggleSidebar}>
            <FiX size={24} />
          </button>
        </div>

        {/* User Profile */}
        <div className="user-profile">
          <div className="user-avatar">{userName ? userName.charAt(0).toUpperCase() : 'A'}</div>
          <div className="user-details">
            <h3>Welcome, {userName || 'Admin'}</h3>
            <p className="admin-email">{userEmail || 'admin@example.com'}</p>
            <div className="admin-badge">
              <FiShield className="role-icon" />
              <span>{isAdmin ? 'Administrator' : 'User'}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3 className="nav-section-title">Management</h3>
            <button
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <FiUsers className="nav-icon" />
              <span>User Queries</span>
              <FiChevronRight className="nav-arrow" />
            </button>
            <button
              className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              <FiFileText className="nav-icon" />
              <span>Reports</span>
              <FiChevronRight className="nav-arrow" />
            </button>
          </div>

          <div className="nav-section">
            <h3 className="nav-section-title">Main</h3>
            <button
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <FiBarChart2 className="nav-icon" />
              <span>Dashboard</span>
              <FiChevronRight className="nav-arrow" />
            </button>
          </div>

          <div className="nav-section">
            <h3 className="nav-section-title">Support</h3>
            <button
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <FiSettings className="nav-icon" />
              <span>Settings</span>
              <FiChevronRight className="nav-arrow" />
            </button>
            <button
              className={`nav-item ${activeTab === 'help' ? 'active' : ''}`}
              onClick={() => setActiveTab('help')}
            >
              <FiHelpCircle className="nav-icon" />
              <span>Help & Support</span>
              <FiChevronRight className="nav-arrow" />
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <FiMenu size={24} />
          </button>

          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="header-actions">
            <button
              ref={notificationButtonRef}
              className="notification-btn"
              onClick={toggleNotifications}
              aria-expanded={showNotifications}
              aria-label={showNotifications ? 'Hide notifications' : 'Show notifications'}
            >
              <FiBell size={20} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>

            <button 
              className="logout-btn top-logout"
              onClick={handleLogout}
              title="Logout"
            >
              <FiLogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          {activeTab === 'dashboard' && (
            <div className="dashboard-section">
              <h2>Dashboard Overview</h2>

              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{dashboardStats.totalQueries}</div>
                  <div className="stat-label">Total Queries</div>
                  <div className="stat-trend up">+12% from last week</div>
                </div>

                <div className="stat-card">
                  <div className="stat-value">{dashboardStats.resolvedQueries}</div>
                  <div className="stat-label">Resolved</div>
                  <div className="stat-trend up">+8% from last week</div>
                </div>

                <div className="stat-card">
                  <div className="stat-value">{dashboardStats.pendingQueries}</div>
                  <div className="stat-label">Pending</div>
                  <div className="stat-trend down">+4 from yesterday</div>
                </div>

                <div className="stat-card">
                  <div className="stat-value">{dashboardStats.avgResponseTime}</div>
                  <div className="stat-label">Avg. Response Time</div>
                  <div className="stat-trend up">-15% from last week</div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="dashboard-grid">
                {/* Query Trend Chart */}
                <div className="dashboard-card">
                  <h3>Query Trend (Last 12 Weeks)</h3>
                  <div className="chart-placeholder">
                    <div className="chart-lines">
                      {[0, 20, 40, 60, 80].map((val, i) => (
                        <div key={i} className="chart-line">
                          <span className="chart-line-label">{val}</span>
                        </div>
                      ))}
                    </div>
                    <div className="chart-bars">
                      {dashboardStats.queryTrend.map((value, index) => (
                        <div
                          key={index}
                          className="chart-bar"
                          style={{ height: `${value}%` }}
                          title={`Week ${index + 1}: ${value} queries`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Query Categories */}
                <div className="dashboard-card">
                  <h3>Query Categories</h3>
                  <div className="categories-list">
                    {dashboardStats.categories.map((category, index) => (
                      <div key={index} className="category-item">
                        <div className="category-info">
                          <span
                            className="category-color"
                            style={{ backgroundColor: category.color }}
                          ></span>
                          <span className="category-name">{category.name}</span>
                        </div>
                        <span className="category-count">{category.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="dashboard-card">
                  <div className="card-header">
                    <h3>Recent Activities</h3>
                    <button className="view-all-btn">View All</button>
                  </div>
                  <div className="activities-list">
                    {dashboardStats.recentActivities.map((activity, index) => (
                      <div key={index} className="activity-item">
                        <div className="activity-avatar">
                          {activity.user === 'System' ? '⚙️' : activity.user.charAt(0)}
                        </div>
                        <div className="activity-details">
                          <div className="activity-text">
                            <strong>{activity.user}</strong> {activity.action}
                          </div>
                          <div className="activity-time">{activity.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="dashboard-card">
                  <h3>Performance Metrics</h3>
                  <div className="metrics-grid">
                    <div className="metric-item">
                      <div className="metric-value">{dashboardStats.userSatisfaction}</div>
                      <div className="metric-label">User Satisfaction</div>
                      <div className="metric-change positive">+5%</div>
                    </div>
                    <div className="metric-item">
                      <div className="metric-value">87%</div>
                      <div className="metric-label">First Response Rate</div>
                      <div className="metric-change positive">+3%</div>
                    </div>
                    <div className="metric-item">
                      <div className="metric-value">94%</div>
                      <div className="metric-label">Resolution Rate</div>
                      <div className="metric-change positive">+2%</div>
                    </div>
                    <div className="metric-item">
                      <div className="metric-value">4.8/5</div>
                      <div className="metric-label">Avg. Rating</div>
                      <div className="metric-change neutral">0%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="reports-section">
              <h2>Analytics & Reports</h2>
              
              {/* Regional Distribution */}
              <div className="report-card">
                <h3>Query Distribution by Region</h3>
                <div className="report-grid">
                  <div className="chart-container">
                    <div className="chart-legend">
                      {[
                        { name: 'North', value: 32, color: '#3B82F6' },
                        { name: 'South', value: 28, color: '#10B981' },
                        { name: 'East', value: 18, color: '#F59E0B' },
                        { name: 'West', value: 22, color: '#8B5CF6' }
                      ].map((region, i) => (
                        <div key={i} className="legend-item">
                          <span className="legend-color" style={{ backgroundColor: region.color }}></span>
                          <span>{region.name}: {region.value}%</span>
                        </div>
                      ))}
                    </div>
                    <div className="chart-pie">
                      {[32, 28, 18, 22].map((value, i) => (
                        <div 
                          key={i}
                          className="chart-segment"
                          style={{
                            '--value': value,
                            '--color': ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][i],
                            '--offset': [0, 32, 60, 88][i]
                          } as React.CSSProperties}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>


              {/* Top Cities */}
              <div className="report-card">
                <h3>Top Cities by Query Volume</h3>
                <div className="cities-list">
                  {[
                    { name: 'Mumbai', count: 1245, trend: '+12%' },
                    { name: 'Delhi', count: 1180, trend: '+8%' },
                    { name: 'Bangalore', count: 980, trend: '+15%' },
                    { name: 'Hyderabad', count: 845, trend: '+5%' },
                    { name: 'Chennai', count: 720, trend: '+3%' }
                  ].map((city, i) => (
                    <div key={i} className="city-item">
                      <div className="city-info">
                        <span className="city-rank">{i + 1}</span>
                        <span className="city-name">{city.name}</span>
                      </div>
                      <div className="city-stats">
                        <span className="city-count">{city.count} queries</span>
                        <span className="city-trend positive">{city.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Trends */}
              <div className="report-card">
                <h3>Monthly Query Trends</h3>
                <div className="bar-chart">
                  {[
                    { month: 'Jan', queries: 1200 },
                    { month: 'Feb', queries: 1350 },
                    { month: 'Mar', queries: 1420 },
                    { month: 'Apr', queries: 1580 },
                    { month: 'May', queries: 1720 },
                    { month: 'Jun', queries: 1850 }
                  ].map((item, i) => (
                    <div key={i} className="bar-container">
                      <div className="bar" style={{ height: `${(item.queries / 2000) * 100}%` }}>
                        <span className="bar-value">{item.queries}</span>
                      </div>
                      <div className="bar-label">{item.month}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolution Metrics */}
              <div className="report-card">
                <h3>Resolution Metrics by Region</h3>
                <div className="metrics-grid">
                  {[
                    { region: 'North', resolved: 78, pending: 22, avgTime: '3.2h' },
                    { region: 'South', resolved: 85, pending: 15, avgTime: '2.8h' },
                    { region: 'East', resolved: 72, pending: 28, avgTime: '3.8h' },
                    { region: 'West', resolved: 81, pending: 19, avgTime: '3.1h' }
                  ].map((metric, i) => (
                    <div key={i} className="metric-card">
                      <h4>{metric.region} Region</h4>
                      <div className="metric-row">
                        <span>Resolved:</span>
                        <span className="metric-value">{metric.resolved}%</span>
                      </div>
                      <div className="metric-row">
                        <span>Pending:</span>
                        <span className="metric-value warning">{metric.pending}%</span>
                      </div>
                      <div className="metric-row">
                        <span>Avg. Resolution:</span>
                        <span className="metric-value">{metric.avgTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <h2>System Settings</h2>
              
              <div className="settings-grid">
                {/* General Settings */}
                <div className="settings-card">
                  <h3>General Settings</h3>
                  <div className="setting-item">
                    <label>Default Language</label>
                    <select className="setting-input">
                      <option>English (India)</option>
                      <option>हिंदी</option>
                      <option>தமிழ்</option>
                      <option>తెలుగు</option>
                      <option>ಕನ್ನಡ</option>
                      <option>മലയാളം</option>
                      <option>বাংলা</option>
                      <option>मराठी</option>
                      <option>ગુજરાતી</option>
                      <option>ਪੰਜਾਬੀ</option>
                    </select>
                  </div>
                  <div className="setting-item">
                    <label>Time Zone</label>
                    <select className="setting-input">
                      <option>(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                      <option>(UTC+05:30) Sri Jayawardenepura</option>
                      <option>(UTC+06:30) Yangon (Rangoon)</option>
                    </select>
                  </div>
                  <div className="setting-item">
                    <label>Date Format</label>
                    <select className="setting-input">
                      <option>DD/MM/YYYY (Indian Standard)</option>
                      <option>MM/DD/YYYY (US Format)</option>
                      <option>YYYY-MM-DD (ISO Format)</option>
                    </select>
                  </div>
                </div>

                {/* Regional Settings */}
                <div className="settings-card">
                  <h3>Regional Settings</h3>
                  <div className="setting-item">
                    <label>Default Country</label>
                    <select className="setting-input">
                      <option>India</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                    </select>
                  </div>
                  <div className="setting-item">
                    <label>Currency</label>
                    <select className="setting-input">
                      <option>Indian Rupee (₹)</option>
                      <option>US Dollar ($)</option>
                      <option>Euro (€)</option>
                    </select>
                  </div>
                  <div className="setting-item">
                    <label>Number Format</label>
                    <select className="setting-input">
                      <option>1,23,45,678.90 (Indian Format)</option>
                      <option>12,345,678.90 (International)</option>
                    </select>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="settings-card">
                  <h3>Notifications</h3>
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Email Notifications
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" defaultChecked />
                      SMS Alerts
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Push Notifications
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>Send Daily Reports At</label>
                    <input type="time" className="setting-input" defaultValue="09:00" />
                  </div>
                </div>

                {/* System Preferences */}
                <div className="settings-card">
                  <h3>System Preferences</h3>
                  <div className="setting-item">
                    <label>Theme</label>
                    <select className="setting-input">
                      <option>Light</option>
                      <option>Dark</option>
                      <option>System Default</option>
                    </select>
                  </div>
                  <div className="setting-item">
                    <label>Items Per Page</label>
                    <select className="setting-input">
                      <option>10</option>
                      <option>25</option>
                      <option>50</option>
                      <option>100</option>
                    </select>
                  </div>
                  <div className="setting-item">
                    <label>Auto-refresh Interval</label>
                    <select className="setting-input">
                      <option>5 minutes</option>
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>Never</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="settings-actions">
                <button className="btn btn-primary">Save Changes</button>
                <button className="btn btn-secondary">Reset to Defaults</button>
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="help-section">
              <h2>Help & Support</h2>
              
              <div className="help-grid">
                {/* Getting Started */}
                <div className="help-card">
                  <h3>Getting Started</h3>
                  <ul className="help-links">
                    <li><a href="#">Quick Start Guide</a></li>
                    <li><a href="#">Video Tutorials</a></li>
                    <li><a href="#">User Manual (PDF)</a></li>
                    <li><a href="#">Keyboard Shortcuts</a></li>
                  </ul>
                </div>

                {/* FAQ */}
                <div className="help-card">
                  <h3>Frequently Asked Questions</h3>
                  <div className="faq-list">
                    <details className="faq-item">
                      <summary>How do I reset my password?</summary>
                      <p>You can reset your password by clicking on 'Forgot Password' on the login page. A reset link will be sent to your registered email address.</p>
                    </details>
                    <details className="faq-item">
                      <summary>How do I generate reports?</summary>
                      <p>Navigate to the Reports section and select the type of report you need. You can filter by date range and export in multiple formats including PDF and Excel.</p>
                    </details>
                    <details className="faq-item">
                      <summary>How do I add new users?</summary>
                      <p>Go to User Management and click 'Add New User'. Fill in the required details and assign appropriate permissions.</p>
                    </details>
                  </div>
                </div>

                {/* Contact Support */}
                <div className="help-card">
                  <h3>Contact Support</h3>
                  <div className="contact-info">
                    <p><strong>Email:</strong> support@quickqueryindia.com</p>
                    <p><strong>Phone:</strong> +91 1800 123 4567 (Toll-Free)</p>
                    <p><strong>Hours:</strong> 24x7 Support Available</p>
                    <p><strong>Address:</strong> Tech Park, Whitefield, Bangalore - 560066, Karnataka, India</p>
                  </div>
                  <div className="support-options">
                    <button className="btn btn-outline">
                      <FiMessageSquare /> Live Chat
                    </button>
                    <button className="btn btn-outline">
                      <FiMail /> Email Support
                    </button>
                  </div>
                </div>

                {/* System Status */}
                <div className="help-card">
                  <h3>System Status</h3>
                  <div className="status-indicator">
                    <span className="status-dot online"></span>
                    <span>All systems operational</span>
                  </div>
                  <div className="incident-history">
                    <h4>Recent Incidents</h4>
                    <ul>
                      <li>
                        <span className="incident-date">May 25, 2023</span>
                        <span className="incident-desc">Scheduled maintenance completed</span>
                      </li>
                      <li>
                        <span className="incident-date">May 20, 2023</span>
                        <span className="incident-desc">Minor performance issues resolved</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="help-footer">
                <div className="version-info">
                  <p>Quick Query Resolver v2.3.1</p>
                  <p>© 2023 Quick Query India. All rights reserved.</p>
                </div>
                <div className="legal-links">
                  <a href="#">Privacy Policy</a>
                  <a href="#">Terms of Service</a>
                  <a href="#">Cookie Settings</a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="content-section">
              <div className="queries-header">
                <div className="header-title-section">
                  <h2 className="section-title">User Queries</h2>
                  <button 
                    className="refresh-btn" 
                    onClick={fetchQueries}
                    disabled={loading}
                    title="Refresh Queries"
                  >
                    <span className={`refresh-icon ${loading ? 'spinning' : ''}`}>↻</span>
                  </button>
                </div>
                <div className="status-filter">
                  <label htmlFor="status-filter">Filter by status: </label>
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="status-select"
                  >
                    <option value="All">All Statuses</option>
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="queries-grid">
                {loading && queries.length === 0 ? (
                  <div className="loading-queries">
                    <div className="spinner"></div>
                    <p>Loading queries...</p>
                  </div>
                ) : filteredQueries.length > 0 ? (
                  filteredQueries.map(query => (
                    <div key={query.id} className="query-card">
                      <div className="query-card-header">
                        <div className="query-priority">
                          <span className={`priority-badge priority-${query.priority.toLowerCase().replace(' ', '-')}`}>
                            {query.priority}
                          </span>
                          <span className="query-brand">{query.brand}</span>
                          <span className="query-section">{query.section}</span>
                        </div>
                        <div className="status-select-container">
                          <div className={`status-badge ${query.status.replace(' ', '-').toLowerCase()}`}>
                            <select
                              value={query.status}
                              onChange={(e) => handleStatusChange(e, query.id)}
                              className="status-select"
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: 'inherit',
                                cursor: 'pointer',
                                width: '100%',
                                padding: '0.5rem 1.5rem 0.5rem 0.75rem',
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                MozAppearance: 'none',
                                textAlign: 'left',
                                fontWeight: 500,
                                fontSize: '0.9rem'
                              }}
                            >
                              {statusOptions.map(status => (
                                <option 
                                  key={status} 
                                  value={status}
                                  className="status-option"
                                  style={{
                                    color: '#1f2937',
                                    backgroundColor: 'white',
                                    padding: '0.75rem 1rem',
                                    fontSize: '0.9rem'
                                  }}
                                >
                                  {status}
                                </option>
                              ))}
                            </select>
                            <FiChevronDown className="select-arrow" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="query-user-info">
                        <div className="user-avatar">
                          {query.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details">
                          <div className="user-name">{query.userName}</div>
                          <div className="user-email">{query.userEmail}</div>
                        </div>
                        <div className="query-date">
                          <div className="date-item">
                            <span className="date-label">Submitted:</span>
                            <span className="date-value">{new Date(query.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          {query.lastUpdated && (
                            <div className="date-item">
                              <span className="date-label">Updated:</span>
                              <span className="date-value">{new Date(query.lastUpdated).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="query-content">
                        <h4 className="content-title">Query Details</h4>
                        <p className="query-description">{query.description}</p>
                        {query.attachment && (
                          <div className="query-attachment">
                            <FiFileText className="attachment-icon" />
                            <a 
                              href={`/attachments/${query.attachment}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="attachment-link"
                              download
                            >
                              {query.attachment}
                              <FiDownload className="download-icon" />
                            </a>
                          </div>
                        )}
                      </div>
                      
                      <div className="query-footer">
                        <div className="assigned-to">
                          {query.assignedTo ? (
                            <div className="assigned-container">
                              <span className="assigned-label">Assigned to:</span>
                              <div className="assigned-user">
                                <FiUser className="assigned-icon" />
                                <span>{query.assignedTo}</span>
                              </div>
                            </div>
                          ) : (
                            <button 
                              className="assign-btn"
                              onClick={() => handleAssignToMe(query.id)}
                            >
                              <FiUser className="assign-icon" /> Assign to me
                            </button>
                          )}
                        </div>
                        <div className="query-actions">
                          <button 
                            className="action-btn primary"
                            onClick={() => {
                              // Handle reply action
                              const emailSubject = `Re: Your query #${query.id} about ${query.brand} ${query.section}`;
                              window.location.href = `mailto:${query.userEmail}?subject=${encodeURIComponent(emailSubject)}`;
                            }}
                          >
                            <FiMessageSquare className="action-icon" /> Reply
                          </button>
                          {query.status !== 'Resolved' && (
                            <button 
                              className="action-btn success"
                              onClick={() => handleResolve(query.id)}
                            >
                              <FiCheck className="action-icon" /> Mark Resolved
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-queries">
                    <FiInbox size={56} className="no-queries-icon" />
                    <h3>No queries found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                    <button 
                      className="btn btn-primary refresh-btn" 
                      onClick={fetchQueries}
                      disabled={loading}
                    >
                      Refresh Queries
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Panel */}
        {showNotifications && (
          <div className="notifications-panel" ref={notificationsPanelRef}>
            <div className="notifications-header">
              <h3>Notifications</h3>
              <button
                className="mark-all-read"
                onClick={() => {
                  /* Mark all as read logic */
                }}
              >
                Mark all as read
              </button>
            </div>
            <div className="notifications-list">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    onClick={() => {
                      /* Handle notification click */
                    }}
                  >
                    <div className="notification-content">
                      <p className="notification-message">{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                    {!notification.read && <div className="unread-dot"></div>}
                  </div>
                ))
              ) : (
                <div className="no-notifications">No new notifications</div>
              )}
            </div>
            <div className="notifications-footer">
              <button className="view-all">View All Notifications</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
