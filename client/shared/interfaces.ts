// Shared interfaces between frontend and backend
export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  department?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQuery {
  _id?: string;
  title: string;
  description: string;
  user: string | IUser;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  assignedTo?: string | IUser;
  attachments?: Array<{
    filename: string;
    path: string;
    mimetype: string;
    size: number;
  }>;
  comments?: Array<{
    user: string | IUser;
    text: string;
    createdAt: Date;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
  resolvedAt?: Date;
}

export interface IAuthResponse {
  success: boolean;
  user: IUser;
  token: string;
}

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
