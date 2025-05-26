// Type-only import to avoid mongoose in browser
import type { Document } from 'mongoose';

// Define the User interface
export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'staff' | 'customer';
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// For a browser environment, we don't create actual Mongoose models
// This is just for TypeScript typing purposes

// Mock User class for browser environment
export class User implements Partial<IUser> {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'staff' | 'customer';
  fullName: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<IUser>) {
    this._id = Math.random().toString();
    this.name = data.name || data.username || ''; // Fallback to username if name not provided
    this.username = data.username || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.role = data.role || 'user';
    this.fullName = data.fullName || data.name || '';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    // In browser, we always return false as this should be done server-side
    console.warn('Password comparison attempted in browser environment');
    return false;
  }
}

// Export a browser-safe version
export default User;
