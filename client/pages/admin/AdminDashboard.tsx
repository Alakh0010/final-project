import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';
import {
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  BellIcon,
  ArrowPathIcon,
  HomeIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  UsersIcon,
  QuestionMarkCircleIcon,
  ArrowLeftOnRectangleIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface IQuery {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  submittedBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

interface INotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: string;
  read: boolean;
}

interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastActive: string;
  avatar?: string;
}

interface IDashboardStats {
  totalQueries: number;
  pendingQueries: number;
  inProgressQueries: number;
  resolvedQueries: number;
  totalUsers: number;
  activeUsers: number;
  responseRate: number;
  avgResponseTime: number;
}

const AdminDashboard: React.FC = () => {
  const [queries, setQueries] = useState<IQuery[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuery, setSelectedQuery] = useState<IQuery | null>(null);
  const [showQueryDetails, setShowQueryDetails] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<IDashboardStats | null>(null);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  
  // Popup states for various actions
  const [showStatusUpdatePopup, setShowStatusUpdatePopup] = useState(false);
  const [showDeleteConfirmPopup, setShowDeleteConfirmPopup] = useState(false);
  const [showResponsePopup, setShowResponsePopup] = useState(false);
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
  const [showEditUserPopup, setShowEditUserPopup] = useState(false);
  const [showDeleteUserPopup, setShowDeleteUserPopup] = useState(false);
  const [showExportReportPopup, setShowExportReportPopup] = useState(false);
  const [showContactSupportPopup, setShowContactSupportPopup] = useState(false);
  
  // Refs for popup handling
  const notificationsPanelRef = useRef<HTMLDivElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch mock data
    // Reduce timeout to make loading faster
    setTimeout(() => {
      const mockQueries: IQuery[] = [
        {
          _id: "q1",
          title: "How to integrate payment gateway?",
          description: "I need help integrating Stripe payment gateway with my React application.",
          status: "pending",
          priority: "high",
          // category removed as it's not in the IQuery interface
          createdAt: "2023-05-10T09:30:00Z",
          submittedBy: {
            _id: "u1",
            name: "John Doe",
            email: "john@example.com"
          }
        },
        {
          _id: "q2",
          title: "Account access issues",
          description: "I'm unable to log in to my account despite resetting my password multiple times.",
          status: "in-progress",
          priority: "medium",
          // category removed as it's not in the IQuery interface
          createdAt: "2023-05-09T14:20:00Z",
          submittedBy: {
            _id: "u2",
            name: "Jane Smith",
            email: "jane@example.com"
          }
        },
        {
          _id: "q3",
          title: "Feature request: Dark mode",
          description: "Would it be possible to add a dark mode option to the application?",
          status: "resolved",
          priority: "low",
          // category removed as it's not in the IQuery interface
          createdAt: "2023-05-08T11:45:00Z",
          submittedBy: {
            _id: "u3",
            name: "Mike Johnson",
            email: "mike@example.com"
          }
        },
        {
          _id: "q4",
          title: "API authentication error",
          description: "Getting 401 Unauthorized errors when trying to access the API endpoints with valid credentials.",
          status: "pending",
          priority: "high",
          // category removed as it's not in the IQuery interface
          createdAt: "2023-05-11T08:15:00Z",
          submittedBy: {
            _id: "u4",
            name: "Sarah Williams",
            email: "sarah@example.com"
          }
        },
        {
          _id: "q5",
          title: "Mobile app crashes on startup",
          description: "After the latest update, the mobile app crashes immediately after the splash screen.",
          status: "in-progress",
          priority: "high",
          // category removed as it's not in the IQuery interface
          createdAt: "2023-05-11T10:45:00Z",
          submittedBy: {
            _id: "u5",
            name: "Robert Chen",
            email: "robert@example.com"
          }
        },
        {
          _id: "q6",
          title: "Billing discrepancy in subscription",
          description: "I was charged twice for my monthly subscription. Please check and refund the extra amount.",
          status: "pending",
          priority: "medium",
          // category removed as it's not in the IQuery interface
          createdAt: "2023-05-10T16:30:00Z",
          submittedBy: {
            _id: "u6",
            name: "Emily Davis",
            email: "emily@example.com"
          }
        },
        {
          _id: "q7",
          title: "Data export functionality",
          description: "Need a way to export all my data in CSV format for reporting purposes.",
          status: "in-progress",
          priority: "low",
          // category removed as it's not in the IQuery interface
          createdAt: "2023-05-09T13:20:00Z",
          submittedBy: {
            _id: "u7",
            name: "Alex Thompson",
            email: "alex@example.com"
          }
        },
        {
          _id: "q8",
          title: "Performance issues with large datasets",
          description: "The application becomes unresponsive when loading more than 1000 records. Need optimization.",
          status: "pending",
          priority: "high",
          // category removed as it's not in the IQuery interface
          createdAt: "2023-05-11T09:10:00Z",
          submittedBy: {
            _id: "u8",
            name: "David Wilson",
            email: "david@example.com"
          }
        },
        {
          _id: "q9",
          title: "Integration with third-party CRM",
          description: "Looking for documentation on how to integrate your API with Salesforce CRM.",
          status: "resolved",
          priority: "medium",
          // category removed as it's not in the IQuery interface
          createdAt: "2023-05-08T15:40:00Z",
          submittedBy: {
            _id: "u9",
            name: "Lisa Brown",
            email: "lisa@example.com"
          }
        },
        {
          _id: "q10",
          title: "Custom domain setup issues",
          description: "Having trouble setting up my custom domain with your service. DNS changes don't seem to propagate.",
          status: "in-progress",
          priority: "medium",
          // category removed as it's not in the IQuery interface
          createdAt: "2023-05-10T11:25:00Z",
          submittedBy: {
            _id: "u10",
            name: "Kevin Martinez",
            email: "kevin@example.com"
          }
        },
        {
          _id: '1',
          title: 'Payment Issue',
          description: 'Unable to process payment with credit card. The transaction was declined even though the card has sufficient funds. I have tried multiple times with different browsers but still facing the same issue.',
          status: 'pending',
          priority: 'high',
          createdAt: new Date().toISOString(),
          submittedBy: {
            _id: 'user1',
            name: 'John Doe',
            email: 'john@example.com'
          }
        },
        {
          _id: '2',
          title: 'Account Access Problem',
          description: 'Cannot log into my account after password reset. I received the password reset email and created a new password, but when I try to login with the new credentials, it says "invalid username or password".',
          status: 'in-progress',
          priority: 'medium',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          submittedBy: {
            _id: 'user2',
            name: 'Jane Smith',
            email: 'jane@example.com'
          }
        },
        {
          _id: '3',
          title: 'Feature Request',
          description: 'Would like to see dark mode in the app. It would be great for reducing eye strain when using the application at night.',
          status: 'resolved',
          priority: 'low',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          submittedBy: {
            _id: 'user3',
            name: 'Bob Johnson',
            email: 'bob@example.com'
          }
        },
        {
          _id: '4',
          title: 'Mobile App Crash',
          description: 'The mobile app crashes whenever I try to upload a profile picture. I am using an iPhone 13 with the latest iOS version.',
          status: 'pending',
          priority: 'urgent',
          createdAt: new Date(Date.now() - 43200000).toISOString(),
          submittedBy: {
            _id: 'user4',
            name: 'Sarah Williams',
            email: 'sarah@example.com'
          }
        },
        {
          _id: '5',
          title: 'Billing Discrepancy',
          description: 'I was charged twice for my monthly subscription. Please check and refund the extra amount.',
          status: 'in-progress',
          priority: 'high',
          createdAt: new Date(Date.now() - 129600000).toISOString(),
          submittedBy: {
            _id: 'user5',
            name: 'Michael Brown',
            email: 'michael@example.com'
          }
        }
      ];
      
      const mockUsers: IUser[] = [
        {
          id: 'user1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'Customer',
          status: 'active',
          lastActive: new Date().toISOString()
        },
        {
          id: 'user2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'Customer',
          status: 'active',
          lastActive: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'user3',
          name: 'Bob Johnson',
          email: 'bob@example.com',
          role: 'Customer',
          status: 'inactive',
          lastActive: new Date(Date.now() - 604800000).toISOString()
        },
        {
          id: 'user4',
          name: 'Sarah Williams',
          email: 'sarah@example.com',
          role: 'Customer',
          status: 'active',
          lastActive: new Date(Date.now() - 43200000).toISOString()
        },
        {
          id: 'user5',
          name: 'Michael Brown',
          email: 'michael@example.com',
          role: 'Customer',
          status: 'active',
          lastActive: new Date(Date.now() - 129600000).toISOString()
        }
      ];

      const mockNotifications: INotification[] = [
        {
          id: '1',
          title: 'New Query Submitted',
          message: 'Sarah Williams has submitted a new urgent query about mobile app crashes',
          type: 'info',
          time: new Date(Date.now() - 43200000).toISOString(),
          read: false
        },
        {
          id: '2',
          title: 'Query Resolved',
          message: 'The feature request from Bob Johnson has been marked as resolved',
          type: 'success',
          time: new Date(Date.now() - 172800000).toISOString(),
          read: true
        },
        {
          id: '3',
          title: 'Urgent Query',
          message: 'A high priority payment issue requires immediate attention',
          type: 'warning',
          time: new Date().toISOString(),
          read: false
        }
      ];

      const stats: IDashboardStats = {
        totalQueries: mockQueries.length,
        pendingQueries: mockQueries.filter(q => q.status === 'pending').length,
        inProgressQueries: mockQueries.filter(q => q.status === 'in-progress').length,
        resolvedQueries: mockQueries.filter(q => q.status === 'resolved').length,
        totalUsers: mockUsers.length,
        activeUsers: mockUsers.filter(u => u.status === 'active').length,
        responseRate: 85,
        avgResponseTime: 4.2
      };
      
      setQueries(mockQueries);
      setUsers(mockUsers);
      setNotifications(mockNotifications);
      setDashboardStats(stats);
      setIsLoading(false);
    }, 500);
  }, []);

  // Handle click outside notifications panel to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsPanelRef.current && 
        !notificationsPanelRef.current.contains(event.target as Node) &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(event.target as Node)
      ) {
        setShowNotificationsPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setShowQueryDetails(false);
    setShowProfileSettings(false);
    setShowHelpCenter(false);
  };

  const toggleNotificationsPanel = () => {
    setShowNotificationsPanel(!showNotificationsPanel);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredQueries = queries.filter(query => 
    query.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    query.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    query.submittedBy?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQueryClick = (query: IQuery) => {
    setSelectedQuery(query);
    setShowQueryDetails(true);
  };

  const handleLogout = () => {
    // Implement logout functionality
    console.log('Logging out...');
    // navigate('/login');
  };

  const toggleProfileSettings = () => {
    setShowProfileSettings(!showProfileSettings);
    setShowHelpCenter(false);
  };

  const toggleHelpCenter = () => {
    setShowHelpCenter(!showHelpCenter);
    setShowProfileSettings(false);
  };

  // Popup handlers for query actions
  const handleStatusUpdateClick = (query: IQuery) => {
    setSelectedQuery(query);
    setShowStatusUpdatePopup(true);
  };

  const handleDeleteQueryClick = (query: IQuery) => {
    setSelectedQuery(query);
    setShowDeleteConfirmPopup(true);
  };

  const handleRespondClick = (query: IQuery) => {
    setSelectedQuery(query);
    setShowResponsePopup(true);
  };

  const updateQueryStatus = (status: 'pending' | 'in-progress' | 'resolved') => {
    if (selectedQuery) {
      setQueries(prev => 
        prev.map(q => 
          q._id === selectedQuery._id ? { ...q, status } : q
        )
      );
      setShowStatusUpdatePopup(false);
    }
  };

  const deleteQuery = () => {
    if (selectedQuery) {
      setQueries(prev => prev.filter(q => q._id !== selectedQuery._id));
      setShowDeleteConfirmPopup(false);
      setShowQueryDetails(false);
    }
  };

  const submitQueryResponse = (response: string) => {
    // In a real app, this would send the response to the backend
    console.log(`Response to query ${selectedQuery?._id}: ${response}`);
    if (selectedQuery) {
      // Update query status to in-progress if it was pending
      if (selectedQuery.status === 'pending') {
        setQueries(prev => 
          prev.map(q => 
            q._id === selectedQuery._id ? { ...q, status: 'in-progress' } : q
          )
        );
      }
    }
    setShowResponsePopup(false);
  };

  // Popup handlers for user management
  const handleAddUserClick = () => {
    setShowAddUserPopup(true);
  };

  const handleEditUserClick = (user: IUser) => {
    // In a real app, you would set the selected user here
    setShowEditUserPopup(true);
  };

  const handleDeleteUserClick = (user: IUser) => {
    // In a real app, you would set the selected user here
    setShowDeleteUserPopup(true);
  };

  const addNewUser = (userData: Partial<IUser>) => {
    // In a real app, this would send the user data to the backend
    const newUser: IUser = {
      id: `user${users.length + 1}`,
      name: userData.name || 'New User',
      email: userData.email || 'newuser@example.com',
      role: userData.role || 'Customer',
      status: 'active',
      lastActive: new Date().toISOString()
    };
    
    setUsers([...users, newUser]);
    setShowAddUserPopup(false);
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    setShowDeleteUserPopup(false);
  };

  // Popup handlers for other actions
  const handleExportReportClick = () => {
    setShowExportReportPopup(true);
  };

  const handleContactSupportClick = () => {
    setShowContactSupportPopup(true);
  };

  // Click outside handler for popups
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        // Close all popups
        setShowStatusUpdatePopup(false);
        setShowDeleteConfirmPopup(false);
        setShowResponsePopup(false);
        setShowAddUserPopup(false);
        setShowEditUserPopup(false);
        setShowDeleteUserPopup(false);
        setShowExportReportPopup(false);
        setShowContactSupportPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <ChatBubbleLeftRightIcon className={styles.logoIcon} />
            <span className={styles.logoText}>QueryFlow</span>
          </div>
          <button className={styles.menuToggle} onClick={toggleSidebar}>
            {sidebarCollapsed ? (
              <ChartBarIcon width={20} height={20} />
            ) : (
              <AdjustmentsHorizontalIcon width={20} height={20} />
            )}
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          <div className={styles.navSection}>
            <span className={styles.navSectionTitle}>Main</span>
            <ul className={styles.navList}>
              <li 
                className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.navItemActive : ''}`}
                onClick={() => handleTabChange('dashboard')}
              >
                <HomeIcon width={20} height={20} />
                <span className={styles.navText}>Dashboard</span>
              </li>
              <li 
                className={`${styles.navItem} ${activeTab === 'queries' ? styles.navItemActive : ''}`}
                onClick={() => handleTabChange('queries')}
              >
                <ChatBubbleLeftRightIcon width={20} height={20} />
                <span className={styles.navText}>Queries</span>
              </li>
              <li 
                className={`${styles.navItem} ${activeTab === 'users' ? styles.navItemActive : ''}`}
                onClick={() => handleTabChange('users')}
              >
                <UsersIcon width={20} height={20} />
                <span className={styles.navText}>Users</span>
              </li>
              <li 
                className={`${styles.navItem} ${activeTab === 'analytics' ? styles.navItemActive : ''}`}
                onClick={() => handleTabChange('analytics')}
              >
                <ChartBarIcon width={20} height={20} />
                <span className={styles.navText}>Analytics</span>
              </li>
            </ul>
          </div>

          <div className={styles.navSection}>
            <span className={styles.navSectionTitle}>Settings</span>
            <ul className={styles.navList}>
              <li 
                className={`${styles.navItem} ${activeTab === 'profile' ? styles.navItemActive : ''}`}
                onClick={() => handleTabChange('profile')}
              >
                <UserIcon width={20} height={20} />
                <span className={styles.navText}>Profile</span>
              </li>
              <li 
                className={`${styles.navItem} ${activeTab === 'settings' ? styles.navItemActive : ''}`}
                onClick={() => handleTabChange('settings')}
              >
                <Cog6ToothIcon width={20} height={20} />
                <span className={styles.navText}>Settings</span>
              </li>
              <li 
                className={`${styles.navItem} ${activeTab === 'help' ? styles.navItemActive : ''}`}
                onClick={() => handleTabChange('help')}
              >
                <QuestionMarkCircleIcon width={20} height={20} />
                <span className={styles.navText}>Help & Support</span>
              </li>
            </ul>
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userProfile}>
            <div className={styles.userAvatar}>
              <UserIcon width={24} height={24} />
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>Admin User</div>
              <div className={styles.userRole}>Administrator</div>
            </div>
          </div>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <ArrowLeftOnRectangleIcon width={20} height={20} />
            <span className={styles.buttonText}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.mainHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>
              {activeTab === 'dashboard' && 'Admin Dashboard'}
              {activeTab === 'queries' && 'Query Management'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'analytics' && 'Analytics & Reports'}
              {activeTab === 'profile' && 'Profile Settings'}
              {activeTab === 'settings' && 'System Settings'}
              {activeTab === 'help' && 'Help & Support'}
            </h1>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.searchBar}>
              <MagnifyingGlassIcon className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search queries, users..." 
                className={styles.searchInput} 
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <button 
              className={styles.notificationButton} 
              onClick={toggleNotificationsPanel}
              ref={notificationButtonRef}
            >
              <BellIcon width={20} height={20} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className={styles.notificationBadge}>
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            {/* Notifications Panel */}
            {showNotificationsPanel && (
              <div className={styles.notificationsPanel} ref={notificationsPanelRef}>
                <div className={styles.notificationsHeader}>
                  <h3>Notifications</h3>
                  <button 
                    className={styles.markAllReadButton}
                    onClick={markAllNotificationsAsRead}
                  >
                    Mark all as read
                  </button>
                </div>
                
                <div className={styles.notificationsList}>
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className={styles.notificationIcon}>
                          {notification.type === 'info' && <EnvelopeIcon width={20} height={20} />}
                          {notification.type === 'success' && <CheckCircleIcon width={20} height={20} />}
                          {notification.type === 'warning' && <ExclamationTriangleIcon width={20} height={20} />}
                          {notification.type === 'error' && <XMarkIcon width={20} height={20} />}
                        </div>
                        <div className={styles.notificationContent}>
                          <div className={styles.notificationTitle}>{notification.title}</div>
                          <div className={styles.notificationMessage}>{notification.message}</div>
                          <div className={styles.notificationTime}>
                            {new Date(notification.time).toLocaleString()}
                          </div>
                        </div>
                        <button 
                          className={styles.deleteNotificationButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <TrashIcon width={16} height={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyNotifications}>
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <div className={styles.pageContent}>
          {/* Dashboard Content */}
          {activeTab === 'dashboard' && !showQueryDetails && (
            <>
              {/* Stats Cards */}
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <ChartBarIcon width={24} height={24} />
                  </div>
                  <div className={styles.statInfo}>
                    <div className={styles.statValue}>{dashboardStats?.totalQueries || queries.length}</div>
                    <div className={styles.statLabel}>Total Queries</div>
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <ClockIcon width={24} height={24} />
                  </div>
                  <div className={styles.statInfo}>
                    <div className={styles.statValue}>
                      {dashboardStats?.pendingQueries || queries.filter(q => q.status === 'pending').length}
                    </div>
                    <div className={styles.statLabel}>Pending</div>
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <ChatBubbleLeftRightIcon width={24} height={24} />
                  </div>
                  <div className={styles.statInfo}>
                    <div className={styles.statValue}>
                      {dashboardStats?.inProgressQueries || queries.filter(q => q.status === 'in-progress').length}
                    </div>
                    <div className={styles.statLabel}>In Progress</div>
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <CheckCircleIcon width={24} height={24} />
                  </div>
                  <div className={styles.statInfo}>
                    <div className={styles.statValue}>
                      {dashboardStats?.resolvedQueries || queries.filter(q => q.status === 'resolved').length}
                    </div>
                    <div className={styles.statLabel}>Resolved</div>
                  </div>
                </div>
              </div>
              
              {/* Recent Queries Section */}
              <div className={styles.contentSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Recent Queries</h2>
                  <button className={styles.viewAllButton} onClick={() => handleTabChange('queries')}>
                    View All
                  </button>
                </div>
                
                {queries.length === 0 ? (
                  <div className={styles.loadingState}>
                    <ArrowPathIcon className={styles.loadingIcon} />
                    <p>Loading queries...</p>
                  </div>
                ) : (
                  <div className={styles.queriesTable}>
                    <div className={styles.tableHeader}>
                      <div className={styles.tableHeaderCell}>ID</div>
                      <div className={styles.tableHeaderCell}>Title</div>
                      <div className={styles.tableHeaderCell}>Submitted By</div>
                      <div className={styles.tableHeaderCell}>Status</div>
                      <div className={styles.tableHeaderCell}>Priority</div>
                      <div className={styles.tableHeaderCell}>Date</div>
                      <div className={styles.tableHeaderCell}>Actions</div>
                    </div>
                    
                    <div className={styles.tableBody}>
                      {queries.map(query => (
                        <div key={query._id} className={styles.tableRow}>
                          <div className={styles.tableCell}>{query._id}</div>
                          <div className={`${styles.tableCell} ${styles.queryTitleCell}`}>{query.title}</div>
                          <div className={styles.tableCell}>
                            <div className={styles.userInfo}>
                              <UserIcon width={16} height={16} />
                              <span>{query.submittedBy?.name || 'Unknown'}</span>
                            </div>
                          </div>
                          <div className={styles.tableCell}>
                            <span className={`${styles.statusBadge} ${styles[query.status]}`}>
                              {query.status}
                            </span>
                          </div>
                          <div className={styles.tableCell}>
                            <span className={`${styles.priorityBadge} ${styles[query.priority]}`}>
                              {query.priority}
                            </span>
                          </div>
                          <div className={styles.tableCell}>
                            {new Date(query.createdAt).toLocaleDateString()}
                          </div>
                          <div className={styles.tableCell}>
                            <div className={styles.actionButtons}>
                              <button 
                                className={styles.actionButton} 
                                title="View Details"
                                onClick={() => handleQueryClick(query)}
                              >
                                <DocumentTextIcon width={16} height={16} />
                              </button>
                              <button className={styles.actionButton} title="Edit Query">
                                <Cog6ToothIcon width={16} height={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Activity Section */}
              <div className={styles.contentSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>User Activity</h2>
                  <button className={styles.viewAllButton} onClick={() => handleTabChange('users')}>
                    View All Users
                  </button>
                </div>
                
                {isLoading ? (
                  <div className={styles.loadingState}>
                    <ArrowPathIcon className={styles.loadingIcon} />
                    <p>Loading user data...</p>
                  </div>
                ) : (
                  <div className={styles.userActivityGrid}>
                    <div className={styles.activityCard}>
                      <div className={styles.activityHeader}>
                        <UsersIcon width={20} height={20} />
                        <h3>Total Users</h3>
                      </div>
                      <div className={styles.activityValue}>{dashboardStats?.totalUsers || users.length}</div>
                      <div className={styles.activityFooter}>
                        <span className={styles.activityLabel}>Active: </span>
                        <span className={styles.activityHighlight}>{dashboardStats?.activeUsers || users.filter(u => u.status === 'active').length}</span>
                      </div>
                    </div>
                    
                    <div className={styles.activityCard}>
                      <div className={styles.activityHeader}>
                        <CheckCircleIcon width={20} height={20} />
                        <h3>Response Rate</h3>
                      </div>
                      <div className={styles.activityValue}>{dashboardStats?.responseRate || 85}%</div>
                      <div className={styles.activityFooter}>
                        <span className={styles.activityLabel}>Last 30 days</span>
                      </div>
                    </div>
                    
                    <div className={styles.activityCard}>
                      <div className={styles.activityHeader}>
                        <ClockIcon width={20} height={20} />
                        <h3>Avg. Response Time</h3>
                      </div>
                      <div className={styles.activityValue}>{dashboardStats?.avgResponseTime || 4.2} hrs</div>
                      <div className={styles.activityFooter}>
                        <span className={styles.activityLabel}>Last 30 days</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          
          {/* Query Details Modal */}
          {showQueryDetails && selectedQuery && (
            <div className={styles.detailsModal}>
              <div className={styles.modalHeader}>
                <button 
                  className={styles.backButton} 
                  onClick={() => setShowQueryDetails(false)}
                >
                  <ArrowPathIcon className={styles.backIcon} /> Back
                </button>
                <h2>Query Details</h2>
              </div>
              
              <div className={styles.modalContent}>
                <div className={styles.queryDetailHeader}>
                  <h3 className={styles.queryDetailTitle}>{selectedQuery.title}</h3>
                  <div className={styles.queryMeta}>
                    <span className={`${styles.statusBadge} ${styles[selectedQuery.status]}`}>
                      {selectedQuery.status}
                    </span>
                    <span className={`${styles.priorityBadge} ${styles[selectedQuery.priority]}`}>
                      {selectedQuery.priority}
                    </span>
                  </div>
                </div>
                
                <div className={styles.queryDetailInfo}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Submitted By:</span>
                    <span className={styles.infoValue}>
                      {selectedQuery.submittedBy?.name || 'Unknown'} ({selectedQuery.submittedBy?.email || 'No email'})
                    </span>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Date:</span>
                    <span className={styles.infoValue}>
                      {new Date(selectedQuery.createdAt).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>ID:</span>
                    <span className={styles.infoValue}>{selectedQuery._id}</span>
                  </div>
                </div>
                
                <div className={styles.queryDescription}>
                  <h4>Description</h4>
                  <p>{selectedQuery.description}</p>
                </div>
                
                <div className={styles.queryActions}>
                  <button 
                    className={`${styles.actionButton} ${styles.primaryButton}`}
                    onClick={() => handleRespondClick(selectedQuery)}
                  >
                    <ChatBubbleLeftRightIcon width={16} height={16} />
                    Respond
                  </button>
                  
                  <button 
                    className={`${styles.actionButton} ${styles.secondaryButton}`}
                    onClick={() => handleStatusUpdateClick(selectedQuery)}
                  >
                    <PencilIcon width={16} height={16} />
                    Update Status
                  </button>
                  
                  <button 
                    className={`${styles.actionButton} ${styles.dangerButton}`}
                    onClick={() => handleDeleteQueryClick(selectedQuery)}
                  >
                    <TrashIcon width={16} height={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Queries Tab Content */}
          {activeTab === 'queries' && !showQueryDetails && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>All Queries</h2>
                <div className={styles.filterControls}>
                  <select className={styles.filterSelect}>
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  
                  <select className={styles.filterSelect}>
                    <option value="all">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              
              {isLoading ? (
                <div className={styles.loadingState}>
                  <ArrowPathIcon className={styles.loadingIcon} />
                  <p>Loading queries...</p>
                </div>
              ) : (
                <div className={styles.queriesTable}>
                  <div className={styles.tableHeader}>
                    <div className={styles.tableHeaderCell}>ID</div>
                    <div className={styles.tableHeaderCell}>Title</div>
                    <div className={styles.tableHeaderCell}>Submitted By</div>
                    <div className={styles.tableHeaderCell}>Status</div>
                    <div className={styles.tableHeaderCell}>Priority</div>
                    <div className={styles.tableHeaderCell}>Date</div>
                    <div className={styles.tableHeaderCell}>Actions</div>
                  </div>
                  
                  <div className={styles.tableBody}>
                    {filteredQueries.map(query => (
                      <div key={query._id} className={styles.tableRow}>
                        <div className={styles.tableCell}>{query._id}</div>
                        <div className={`${styles.tableCell} ${styles.queryTitleCell}`}>{query.title}</div>
                        <div className={styles.tableCell}>
                          <div className={styles.userInfo}>
                            <UserIcon width={16} height={16} />
                            <span>{query.submittedBy?.name || 'Unknown'}</span>
                          </div>
                        </div>
                        <div className={styles.tableCell}>
                          <span className={`${styles.statusBadge} ${styles[query.status]}`}>
                            {query.status}
                          </span>
                        </div>
                        <div className={styles.tableCell}>
                          <span className={`${styles.priorityBadge} ${styles[query.priority]}`}>
                            {query.priority}
                          </span>
                        </div>
                        <div className={styles.tableCell}>
                          {new Date(query.createdAt).toLocaleDateString()}
                        </div>
                        <div className={styles.tableCell}>
                          <div className={styles.actionButtons}>
                            <button 
                              className={styles.actionButton} 
                              title="View Details"
                              onClick={() => handleQueryClick(query)}
                            >
                              <DocumentTextIcon width={16} height={16} />
                            </button>
                            <button 
                              className={styles.actionButton} 
                              title="Update Status"
                              onClick={() => handleStatusUpdateClick(query)}
                            >
                              <Cog6ToothIcon width={16} height={16} />
                            </button>
                            <button 
                              className={styles.actionButton} 
                              title="Delete Query"
                              onClick={() => handleDeleteQueryClick(query)}
                            >
                              <TrashIcon width={16} height={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Users Tab Content */}
          {activeTab === 'users' && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>User Management</h2>
                <div className={styles.filterControls}>
                  <select className={styles.filterSelect}>
                    <option value="all">All Users</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  
                  <button 
                    className={styles.addButton}
                    onClick={handleAddUserClick}
                  >
                    <UserIcon width={16} height={16} />
                    Add User
                  </button>
                </div>
              </div>
              
              {isLoading ? (
                <div className={styles.loadingState}>
                  <ArrowPathIcon className={styles.loadingIcon} />
                  <p>Loading users...</p>
                </div>
              ) : (
                <div className={styles.usersTable}>
                  <div className={styles.tableHeader}>
                    <div className={styles.tableHeaderCell}>ID</div>
                    <div className={styles.tableHeaderCell}>Name</div>
                    <div className={styles.tableHeaderCell}>Email</div>
                    <div className={styles.tableHeaderCell}>Role</div>
                    <div className={styles.tableHeaderCell}>Status</div>
                    <div className={styles.tableHeaderCell}>Last Active</div>
                    <div className={styles.tableHeaderCell}>Actions</div>
                  </div>
                  
                  <div className={styles.tableBody}>
                    {users.map(user => (
                      <div key={user.id} className={styles.tableRow}>
                        <div className={styles.tableCell}>{user.id}</div>
                        <div className={styles.tableCell}>
                          <div className={styles.userInfo}>
                            <div className={styles.userAvatar}>
                              <UserIcon width={16} height={16} />
                            </div>
                            <span>{user.name}</span>
                          </div>
                        </div>
                        <div className={styles.tableCell}>{user.email}</div>
                        <div className={styles.tableCell}>{user.role}</div>
                        <div className={styles.tableCell}>
                          <span className={`${styles.statusBadge} ${styles[user.status]}`}>
                            {user.status}
                          </span>
                        </div>
                        <div className={styles.tableCell}>
                          {new Date(user.lastActive).toLocaleString()}
                        </div>
                        <div className={styles.tableCell}>
                          <div className={styles.actionButtons}>
                            <button 
                              className={styles.actionButton} 
                              title="Edit User"
                              onClick={() => handleEditUserClick(user)}
                            >
                              <PencilIcon width={16} height={16} />
                            </button>
                            <button 
                              className={styles.actionButton} 
                              title="Delete User"
                              onClick={() => handleDeleteUserClick(user)}
                            >
                              <TrashIcon width={16} height={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Analytics Tab Content */}
          {activeTab === 'analytics' && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Analytics & Reports</h2>
                <div className={styles.filterControls}>
                  <select className={styles.filterSelect}>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                    <option value="year">Last Year</option>
                  </select>
                  
                  <button 
                    className={styles.exportButton}
                    onClick={handleExportReportClick}
                  >
                    <DocumentTextIcon width={16} height={16} />
                    Export Report
                  </button>
                </div>
              </div>
              
              <div className={styles.analyticsGrid}>
                <div className={styles.analyticsCard}>
                  <h3>Query Volume</h3>
                  <div className={styles.analyticsContent}>
                    <div className={styles.analyticsPlaceholder}>
                      <ChartBarIcon width={48} height={48} />
                      <p>Query volume chart would appear here</p>
                    </div>
                  </div>
                </div>
                
                <div className={styles.analyticsCard}>
                  <h3>Response Times</h3>
                  <div className={styles.analyticsContent}>
                    <div className={styles.analyticsPlaceholder}>
                      <ClockIcon width={48} height={48} />
                      <p>Response time chart would appear here</p>
                    </div>
                  </div>
                </div>
                
                <div className={styles.analyticsCard}>
                  <h3>Query Categories</h3>
                  <div className={styles.analyticsContent}>
                    <div className={styles.analyticsPlaceholder}>
                      <ChatBubbleLeftRightIcon width={48} height={48} />
                      <p>Query categories chart would appear here</p>
                    </div>
                  </div>
                </div>
                
                <div className={styles.analyticsCard}>
                  <h3>User Activity</h3>
                  <div className={styles.analyticsContent}>
                    <div className={styles.analyticsPlaceholder}>
                      <UsersIcon width={48} height={48} />
                      <p>User activity chart would appear here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Profile Settings Tab Content */}
          {activeTab === 'profile' && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Profile Settings</h2>
                <button className={styles.saveButton}>
                  <CheckCircleIcon width={16} height={16} />
                  Save Changes
                </button>
              </div>
              
              <div className={styles.profileForm}>
                <div className={styles.profileHeader}>
                  <div className={styles.profileAvatar}>
                    <UserIcon width={48} height={48} />
                  </div>
                  <div className={styles.profileInfo}>
                    <h3>Admin User</h3>
                    <p>Administrator</p>
                  </div>
                  <button className={styles.changeAvatarButton}>
                    Change Avatar
                  </button>
                </div>
                
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Full Name</label>
                    <input type="text" defaultValue="Admin User" className={styles.formInput} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Email</label>
                    <input type="email" defaultValue="admin@example.com" className={styles.formInput} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Role</label>
                    <input type="text" defaultValue="Administrator" disabled className={styles.formInput} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Department</label>
                    <input type="text" defaultValue="IT" className={styles.formInput} />
                  </div>
                </div>
                
                <div className={styles.formDivider}>
                  <h4>Change Password</h4>
                </div>
                
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Current Password</label>
                    <input type="password" className={styles.formInput} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>New Password</label>
                    <input type="password" className={styles.formInput} />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Confirm New Password</label>
                    <input type="password" className={styles.formInput} />
                  </div>
                </div>
                
                <div className={styles.formDivider}>
                  <h4>Notification Preferences</h4>
                </div>
                
                <div className={styles.checkboxGroup}>
                  <div className={styles.checkbox}>
                    <input type="checkbox" id="emailNotif" defaultChecked />
                    <label htmlFor="emailNotif">Email Notifications</label>
                  </div>
                  
                  <div className={styles.checkbox}>
                    <input type="checkbox" id="queryNotif" defaultChecked />
                    <label htmlFor="queryNotif">New Query Alerts</label>
                  </div>
                  
                  <div className={styles.checkbox}>
                    <input type="checkbox" id="systemNotif" defaultChecked />
                    <label htmlFor="systemNotif">System Notifications</label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Settings Tab Content */}
          {activeTab === 'settings' && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>System Settings</h2>
                <button className={styles.saveButton}>
                  <CheckCircleIcon width={16} height={16} />
                  Save Changes
                </button>
              </div>
              
              <div className={styles.settingsTabs}>
                <div className={styles.tabsList}>
                  <button className={`${styles.tabButton} ${styles.active}`}>General</button>
                  <button className={styles.tabButton}>Security</button>
                  <button className={styles.tabButton}>Notifications</button>
                  <button className={styles.tabButton}>Integrations</button>
                </div>
                
                <div className={styles.tabContent}>
                  <div className={styles.settingsSection}>
                    <h3>General Settings</h3>
                    
                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <h4>System Name</h4>
                        <p>Change the name of your customer support system</p>
                      </div>
                      <div className={styles.settingControl}>
                        <input type="text" defaultValue="QueryFlow" className={styles.formInput} />
                      </div>
                    </div>
                    
                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <h4>Default Language</h4>
                        <p>Set the default language for the system</p>
                      </div>
                      <div className={styles.settingControl}>
                        <select className={styles.formSelect}>
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <h4>Time Zone</h4>
                        <p>Set the default time zone for the system</p>
                      </div>
                      <div className={styles.settingControl}>
                        <select className={styles.formSelect}>
                          <option value="utc">UTC</option>
                          <option value="est">Eastern Time (ET)</option>
                          <option value="cst">Central Time (CT)</option>
                          <option value="mst">Mountain Time (MT)</option>
                          <option value="pst">Pacific Time (PT)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className={styles.settingItem}>
                      <div className={styles.settingInfo}>
                        <h4>Dark Mode</h4>
                        <p>Enable dark mode for the admin interface</p>
                      </div>
                      <div className={styles.settingControl}>
                        <div className={styles.toggle}>
                          <input type="checkbox" id="darkMode" />
                          <label htmlFor="darkMode"></label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Help & Support Tab Content */}
          {activeTab === 'help' && (
            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Help & Support Center</h2>
                <button 
                  className={styles.contactButton}
                  onClick={handleContactSupportClick}
                >
                  <EnvelopeIcon width={16} height={16} />
                  Contact Support
                </button>
              </div>
              
              <div className={styles.helpGrid}>
                <div className={styles.helpCard}>
                  <div className={styles.helpIcon}>
                    <DocumentTextIcon width={32} height={32} />
                  </div>
                  <h3>Documentation</h3>
                  <p>Access comprehensive guides and documentation for the admin dashboard</p>
                  <button className={styles.helpButton}>View Docs</button>
                </div>
                
                <div className={styles.helpCard}>
                  <div className={styles.helpIcon}>
                    <QuestionMarkCircleIcon width={32} height={32} />
                  </div>
                  <h3>FAQs</h3>
                  <p>Find answers to frequently asked questions about the system</p>
                  <button className={styles.helpButton}>View FAQs</button>
                </div>
                
                <div className={styles.helpCard}>
                  <div className={styles.helpIcon}>
                    <ChatBubbleLeftRightIcon width={32} height={32} />
                  </div>
                  <h3>Live Chat</h3>
                  <p>Get real-time assistance from our support team</p>
                  <button className={styles.helpButton}>Start Chat</button>
                </div>
                
                <div className={styles.helpCard}>
                  <div className={styles.helpIcon}>
                    <ShieldCheckIcon width={32} height={32} />
                  </div>
                  <h3>Security</h3>
                  <p>Learn about our security practices and data protection</p>
                  <button className={styles.helpButton}>Learn More</button>
                </div>
              </div>
              
              <div className={styles.videoTutorials}>
                <h3>Video Tutorials</h3>
                <div className={styles.tutorialsGrid}>
                  <div className={styles.tutorialCard}>
                    <div className={styles.tutorialThumbnail}>
                      <div className={styles.playButton}>
                        <svg viewBox="0 0 24 24" width="24" height="24">
                          <path d="M8 5v14l11-7z" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                    <h4>Getting Started with QueryFlow</h4>
                    <p>Learn the basics of the admin dashboard</p>
                  </div>
                  
                  <div className={styles.tutorialCard}>
                    <div className={styles.tutorialThumbnail}>
                      <div className={styles.playButton}>
                        <svg viewBox="0 0 24 24" width="24" height="24">
                          <path d="M8 5v14l11-7z" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                    <h4>Managing Queries Efficiently</h4>
                    <p>Tips and tricks for handling customer queries</p>
                  </div>
                  
                  <div className={styles.tutorialCard}>
                    <div className={styles.tutorialThumbnail}>
                      <div className={styles.playButton}>
                        <svg viewBox="0 0 24 24" width="24" height="24">
                          <path d="M8 5v14l11-7z" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                    <h4>Advanced Analytics</h4>
                    <p>How to use analytics to improve customer service</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Popup Components */}
      {/* Status Update Popup */}
      {showStatusUpdatePopup && selectedQuery && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup} ref={popupRef}>
            <div className={styles.popupHeader}>
              <h3>Update Query Status</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowStatusUpdatePopup(false)}
              >
                <XMarkIcon width={20} height={20} />
              </button>
            </div>
            <div className={styles.popupContent}>
              <p>Current status: <span className={`${styles.statusBadge} ${styles[selectedQuery.status]}`}>{selectedQuery.status}</span></p>
              <p>Select new status for query: <strong>{selectedQuery.title}</strong></p>
              
              <div className={styles.statusOptions}>
                <button 
                  className={`${styles.statusOption} ${styles.pending}`}
                  onClick={() => updateQueryStatus('pending')}
                >
                  Pending
                </button>
                <button 
                  className={`${styles.statusOption} ${styles['in-progress']}`}
                  onClick={() => updateQueryStatus('in-progress')}
                >
                  In Progress
                </button>
                <button 
                  className={`${styles.statusOption} ${styles.resolved}`}
                  onClick={() => updateQueryStatus('resolved')}
                >
                  Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirmPopup && selectedQuery && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup} ref={popupRef}>
            <div className={styles.popupHeader}>
              <h3>Confirm Deletion</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowDeleteConfirmPopup(false)}
              >
                <XMarkIcon width={20} height={20} />
              </button>
            </div>
            <div className={styles.popupContent}>
              <p className={styles.warningText}>
                <ExclamationTriangleIcon width={24} height={24} />
                Are you sure you want to delete this query?
              </p>
              <p><strong>Title:</strong> {selectedQuery.title}</p>
              <p><strong>Submitted by:</strong> {selectedQuery.submittedBy?.name || 'Unknown'}</p>
              
              <div className={styles.popupActions}>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setShowDeleteConfirmPopup(false)}
                >
                  Cancel
                </button>
                <button 
                  className={styles.deleteButton}
                  onClick={deleteQuery}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Response Popup */}
      {showResponsePopup && selectedQuery && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup} ref={popupRef}>
            <div className={styles.popupHeader}>
              <h3>Respond to Query</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowResponsePopup(false)}
              >
                <XMarkIcon width={20} height={20} />
              </button>
            </div>
            <div className={styles.popupContent}>
              <div className={styles.queryInfo}>
                <p><strong>Title:</strong> {selectedQuery.title}</p>
                <p><strong>Description:</strong> {selectedQuery.description}</p>
                <p><strong>Submitted by:</strong> {selectedQuery.submittedBy?.name || 'Unknown'}</p>
              </div>
              
              <div className={styles.responseForm}>
                <label htmlFor="responseText">Your Response:</label>
                <textarea 
                  id="responseText" 
                  className={styles.responseTextarea}
                  placeholder="Type your response here..."
                  rows={5}
                />
                
                <div className={styles.popupActions}>
                  <button 
                    className={styles.cancelButton}
                    onClick={() => setShowResponsePopup(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className={styles.submitButton}
                    onClick={() => {
                      const responseText = (document.getElementById('responseText') as HTMLTextAreaElement)?.value;
                      if (responseText) {
                        submitQueryResponse(responseText);
                      }
                    }}
                  >
                    Send Response
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Popup */}
      {showAddUserPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup} ref={popupRef}>
            <div className={styles.popupHeader}>
              <h3>Add New User</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowAddUserPopup(false)}
              >
                <XMarkIcon width={20} height={20} />
              </button>
            </div>
            <div className={styles.popupContent}>
              <div className={styles.formGroup}>
                <label htmlFor="userName">Name:</label>
                <input 
                  type="text" 
                  id="userName" 
                  className={styles.formInput}
                  placeholder="Enter user name"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="userEmail">Email:</label>
                <input 
                  type="email" 
                  id="userEmail" 
                  className={styles.formInput}
                  placeholder="Enter user email"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="userRole">Role:</label>
                <select id="userRole" className={styles.formSelect}>
                  <option value="Customer">Customer</option>
                  <option value="Support">Support</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              
              <div className={styles.popupActions}>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setShowAddUserPopup(false)}
                >
                  Cancel
                </button>
                <button 
                  className={styles.submitButton}
                  onClick={() => {
                    const name = (document.getElementById('userName') as HTMLInputElement)?.value;
                    const email = (document.getElementById('userEmail') as HTMLInputElement)?.value;
                    const role = (document.getElementById('userRole') as HTMLSelectElement)?.value;
                    
                    if (name && email) {
                      addNewUser({ name, email, role });
                    }
                  }}
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Report Popup */}
      {showExportReportPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup} ref={popupRef}>
            <div className={styles.popupHeader}>
              <h3>Export Report</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowExportReportPopup(false)}
              >
                <XMarkIcon width={20} height={20} />
              </button>
            </div>
            <div className={styles.popupContent}>
              <div className={styles.formGroup}>
                <label htmlFor="reportType">Report Type:</label>
                <select id="reportType" className={styles.formSelect}>
                  <option value="queries">Queries Summary</option>
                  <option value="users">User Activity</option>
                  <option value="performance">Performance Metrics</option>
                  <option value="full">Full Report</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="reportFormat">Format:</label>
                <select id="reportFormat" className={styles.formSelect}>
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                  <option value="xlsx">Excel</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="dateRange">Date Range:</label>
                <select id="dateRange" className={styles.formSelect}>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              
              <div className={styles.popupActions}>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setShowExportReportPopup(false)}
                >
                  Cancel
                </button>
                <button 
                  className={styles.submitButton}
                  onClick={() => {
                    // In a real app, this would generate and download the report
                    alert('Report exported successfully!');
                    setShowExportReportPopup(false);
                  }}
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Support Popup */}
      {showContactSupportPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup} ref={popupRef}>
            <div className={styles.popupHeader}>
              <h3>Contact Support</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowContactSupportPopup(false)}
              >
                <XMarkIcon width={20} height={20} />
              </button>
            </div>
            <div className={styles.popupContent}>
              <div className={styles.formGroup}>
                <label htmlFor="supportSubject">Subject:</label>
                <input 
                  type="text" 
                  id="supportSubject" 
                  className={styles.formInput}
                  placeholder="Enter subject"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="supportMessage">Message:</label>
                <textarea 
                  id="supportMessage" 
                  className={styles.responseTextarea}
                  placeholder="Describe your issue or question..."
                  rows={5}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="supportPriority">Priority:</label>
                <select id="supportPriority" className={styles.formSelect}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div className={styles.popupActions}>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setShowContactSupportPopup(false)}
                >
                  Cancel
                </button>
                <button 
                  className={styles.submitButton}
                  onClick={() => {
                    // In a real app, this would send the support request
                    alert('Support request submitted successfully!');
                    setShowContactSupportPopup(false);
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
