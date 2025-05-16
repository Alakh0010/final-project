export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastActive: string;
  avatar?: string;
}

export interface IQuery {
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

export interface INotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: string;
  read: boolean;
}

export interface IDashboardStats {
  totalQueries: number;
  pendingQueries: number;
  inProgressQueries: number;
  resolvedQueries: number;
  totalUsers: number;
  activeUsers: number;
  responseRate: number;
  avgResponseTime: number;
}
