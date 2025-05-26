// Mock data for frontend testing
import { IUser, IQuery } from '../types/models';

// Mock users
export const mockUsers: IUser[] = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'admin',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password456',
    role: 'user',
    createdAt: new Date('2023-01-02'),
    updatedAt: new Date('2023-01-02'),
  },
];

// Mock queries
export const mockQueries: IQuery[] = [
  {
    _id: '1',
    title: 'Database Connection Issue',
    description: 'Unable to connect to MongoDB Atlas',
    status: 'pending',
    priority: 'high',
    category: 'Database',
    user: {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    _id: '2',
    title: 'Billing Issue',
    description: 'Duplicate charge on my account',
    status: 'pending',
    priority: 'urgent',
    category: 'Billing',
    user: {
      _id: 'user1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      createdAt: new Date('2025-05-09'),
      updatedAt: new Date('2025-05-09'),
    },
    createdAt: new Date('2025-05-09'),
    updatedAt: new Date('2025-05-09'),
  },
  {
    _id: '3',
    title: 'Feature Request: Dark Mode',
    description:
      'Could you please add a dark mode option to the application? It would be much easier on the eyes when using the app at night.',
    status: 'pending',
    priority: 'low',
    category: 'Feature Request',
    user: {
      _id: 'user2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      createdAt: new Date('2025-05-08'),
      updatedAt: new Date('2025-05-08'),
    },
    createdAt: new Date('2025-05-08'),
    updatedAt: new Date('2025-05-08'),
  },
  {
    _id: '4',
    title: 'Missing Data in Reports',
    description:
      'The monthly analytics reports are missing data from the last week of April. Can you please investigate and provide the complete data?',
    status: 'resolved',
    priority: 'medium',
    category: 'Data Issue',
    user: {
      _id: 'user2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      createdAt: new Date('2025-05-07'),
      updatedAt: new Date('2025-05-07'),
    },
    createdAt: new Date('2025-05-07'),
    updatedAt: new Date('2025-05-11'),
  },
  {
    _id: '5',
    title: 'Mobile App Crashes on Startup',
    description:
      'After the latest update, the mobile app crashes immediately upon startup on my Android device. I am using a Samsung Galaxy S21 with Android 12.',
    status: 'in-progress',
    priority: 'high',
    category: 'Technical Support',
    user: {
      _id: 'user1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      createdAt: new Date('2025-05-06'),
      updatedAt: new Date('2025-05-06'),
    },
    createdAt: new Date('2025-05-06'),
    updatedAt: new Date('2025-05-10'),
  },
];
