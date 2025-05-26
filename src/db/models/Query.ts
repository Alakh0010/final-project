// Type-only import to avoid mongoose in browser
import type { Document } from 'mongoose';

// Define the Query interface
export interface IQuery extends Document {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  submittedBy: string | Record<string, unknown> | null; // Can be either user ID or user object
  assignedTo?: string | Record<string, unknown> | null; // Can be either user ID or user object
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

// For a browser environment, we don't create actual Mongoose models
// This is just for TypeScript typing purposes

// Mock Query class for browser environment
export class Query implements Partial<IQuery> {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  submittedBy: string | Record<string, unknown> | null;
  assignedTo?: string | Record<string, unknown> | null;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<IQuery>) {
    this._id = Math.random().toString();
    this.title = data.title || '';
    this.description = data.description || '';
    this.status = data.status || 'pending';
    this.priority = data.priority || 'medium';
    this.category = data.category || '';
    this.submittedBy = data.submittedBy || null;
    this.assignedTo = data.assignedTo || null;
    this.tags = data.tags || [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

// Export a browser-safe version
export default Query;
