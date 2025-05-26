import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ToastNotification';
import './AdminDashboard.css';

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
  FiCalendar,
  FiFileText,
  FiUsers,
  FiMessageSquare,
  FiChevronRight,
  FiCheck
} from 'react-icons/fi';

// Mock data - replace with actual API calls
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
];

const mockQueries = [
  {
    id: 1,
    title: 'Login Issue',
    description: 'Unable to login to the system',
    status: 'Pending',
    user: 'Jane Smith',
    date: '2023-05-10',
  },
  {
    id: 2,
    title: 'Password Reset',
    description: 'Need to reset my password',
    status: 'In Progress',
    user: 'Bob Johnson',
    date: '2023-05-12',
  },
];

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
  const [users, setUsers] = useState(mockUsers);
  const [queries, setQueries] = useState(mockQueries);
  const [filteredQueries, setFilteredQueries] = useState(mockQueries);
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
      { id: 1, user: 'John Doe', action: 'resolved query #123', time: '5 min ago' },
      { id: 2, user: 'Jane Smith', action: 'added a new comment', time: '15 min ago' },
      { id: 3, user: 'System', action: 'scheduled maintenance', time: '1 hour ago' },
      { id: 4, user: 'Bob Johnson', action: 'updated profile', time: '2 hours ago' },
    ],
    userSatisfaction: 87, // Add the missing property
  });
  
  const { showToast } = useToast();
  const notificationsPanelRef = React.useRef<HTMLDivElement>(null);
  const notificationButtonRef = React.useRef<HTMLButtonElement>(null);

  // Use a ref to track if welcome message has been shown
  const welcomeShown = React.useRef(false);

  // Close notifications when clicking outside
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
    // Only show notifications if they haven't been shown yet and user is admin
    if (!welcomeShown.current && isAdmin) {
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
  }, [showToast, isAdmin]);

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

  // Example analysis data
  const analysisData = {
    totalQueries: 128,
    resolvedQueries: 98,
    pendingQueries: 30,
    avgResponseTime: '2h 15m',
    userSatisfaction: '92%',
    queryTrend: [45, 52, 60, 58, 62, 68, 72, 75, 70, 68, 64, 70],
    categories: [
      { name: 'Technical', count: 42, color: '#4F46E5' },
      { name: 'Billing', count: 35, color: '#10B981' },
      { name: 'Account', count: 28, color: '#F59E0B' },
      { name: 'General', count: 23, color: '#EF4444' },
    ],
    recentActivities: [
      { id: 1, user: 'Alex Johnson', action: 'resolved query #1011', time: '10 min ago' },
      { id: 2, user: 'Sarah Wilson', action: 'assigned query #1012 to you', time: '25 min ago' },
      {
        id: 3,
        user: 'System',
        action: 'automatically closed inactive queries',
        time: '1 hour ago',

  const statusOptions = ['Pending', 'In Progress', 'Resolved'];

  // Handle logout
  const handleLogout = useCallback(() => {
    showToast('Logging out...', 'info');
    setTimeout(() => {
      logout();
      navigate('/admin/login');
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

  // Update filtered queries when search term or queries change
  useEffect(() => {
    const filtered = queries.filter(
      query =>
        query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.user.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQueries(filtered);
  }, [searchTerm, queries]);

  // Update query status
  const updateQueryStatus = (queryId: number, newStatus: string) => {
    const updatedQueries = queries.map(query =>
      query.id === queryId ? { ...query, status: newStatus } : query
    );
    setQueries(updatedQueries);
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

  // Filter users based on search input
  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtering is handled by the useEffect hook that updates filteredQueries state

  // Check if user is authenticated and admin, if not redirect to login
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/admin/login');
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
            <h3>{userName || 'Admin User'}</h3>
            <p>{userEmail || 'admin@example.com'}</p>
            <span className="user-role">
              <FiShield className="role-icon" />
              {isAdmin ? 'Administrator' : 'User'}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
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
            <h3 className="nav-section-title">Management</h3>
            <button
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <FiUsers className="nav-icon" />
              <span>Users</span>
              <FiChevronRight className="nav-arrow" />
            </button>

            <button
              className={`nav-item ${activeTab === 'queries' ? 'active' : ''}`}
              onClick={() => setActiveTab('queries')}
            >
              <FiMessageSquare className="nav-icon" />
              <span>Queries</span>
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

            <button className="nav-item logout-btn" onClick={handleLogout}>
              <FiLogOut className="nav-icon" />
              <span>Logout</span>
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

            <div className="user-info">
              <span className="user-greeting">Hi, {userName?.split(' ')[0] || 'Admin'}</span>
              <div className="user-avatar small">
                {userName ? userName.charAt(0).toUpperCase() : 'A'}
              </div>
            </div>
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

          {activeTab === 'users' && (
            <div className="content-section">
              <h2 className="section-title">User Queries</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th className="title-col">Title</th>
                      <th className="description-col">Description</th>
                      <th className="status-col">Status</th>
                      <th className="user-col">User</th>
                      <th className="date-col">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQueries.length > 0 ? (
                      filteredQueries.map(query => (
                        <tr key={query.id}>
                          <td>{query.title}</td>
                          <td>{query.description}</td>
                          <td>
                            <div className="status-dropdown-container">
                              <button
                                className={`status-badge ${query.status.replace(' ', '-').toLowerCase()}`}
                                onClick={e => toggleStatusDropdown(e, query.id)}
                                aria-expanded={statusDropdown === query.id}
                              >
                                {query.status}
                                <FiChevronDown className="dropdown-arrow" />
                              </button>
                              {statusDropdown === query.id && (
                                <div className="status-dropdown">
                                  {statusOptions.map(status => (
                                    <button
                                      key={status}
                                      className={`status-option ${query.status === status ? 'active' : ''}`}
                                      onClick={e => {
                                        e.stopPropagation();
                                        updateQueryStatus(query.id, status);
                                      }}
                                      data-status={status}
                                    >
                                      {status}
                                      {query.status === status && (
                                        <FiCheck className="check-icon" />
                                      )}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                          <td>{query.user}</td>
                          <td>{query.date}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="no-queries">
                          No queries found matching your search
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
