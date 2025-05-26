import mongoose, { connect } from 'mongoose';
import { User, Query } from './models';
import type { IQuery } from './models/Query';

// Define a simple in-memory database for the seed script
const db = {
  users: [] as any[],
  queries: [] as any[],
  
  async clear() {
    this.users = [];
    this.queries = [];
    return { deletedCount: 0 };
  },
  
  async createUser(data: any) {
    const user = new User(data);
    this.users.push(user);
    return user;
  },
  
  async createQuery(data: any) {
    const query = new Query(data);
    this.queries.push(query);
    return query;
  },
  
  async insertMany(collection: 'users' | 'queries', items: any[]) {
    const created = items.map(item => 
      collection === 'users' ? new User(item) : new Query(item)
    );
    this[collection].push(...created);
    return created;
  }
};

// Use this instead of the imported dbConnect
async function connectToDatabase() {
  const MONGODB_URI =
    process.env.MONGODB_URI ||
    'mongodb+srv://alakh001:Alakh8613@cluster0.haxjqnv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

  try {
    await connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas successfully');
    return mongoose;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

/**
 * Seed script to populate the database with initial data
 * Run this script with: ts-node src/db/seed.ts
 */
async function seedDatabase() {
  try {
    // Connect to the database
    await connectToDatabase();
    console.log('Connected to MongoDB Atlas');

    // Clear existing data
    console.log('Clearing existing data...');
    await db.clear();

    // Create sample users
    console.log('Creating sample users...');
    const adminUser = await db.createUser({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      fullName: 'Admin User'
    });

    const staffUser = await db.createUser({
      username: 'staff1',
      email: 'staff1@example.com',
      password: 'staff123',
      role: 'staff',
      fullName: 'Staff Member'
    });

    const customerUser = await db.createUser({
      username: 'customer1',
      email: 'customer1@example.com',
      password: 'customer123',
      role: 'customer',
      fullName: 'John Doe'
    });

    // Create queries with proper typing
    console.log('Creating queries...');
    const queries: Partial<IQuery>[] = [
      {
        title: 'Login issue',
        description: 'Unable to log in to the system',
        status: 'pending' as const,
        priority: 'high' as const,
        category: 'Authentication',
        submittedBy: customerUser._id,
        assignedTo: adminUser._id,
        tags: ['login', 'authentication']
      },
      {
        title: 'Dashboard not loading',
        description: 'Dashboard shows blank screen',
        status: 'in-progress' as const,
        priority: 'high' as const,
        category: 'UI',
        submittedBy: customerUser._id,
        assignedTo: staffUser._id,
        tags: ['dashboard', 'ui']
      },
      {
        title: 'Profile update issue',
        description: 'Unable to update profile picture',
        status: 'pending' as const,
        priority: 'medium' as const,
        category: 'Profile',
        submittedBy: customerUser._id,
        assignedTo: staffUser._id,
        tags: ['profile', 'settings']
      }
    ];

    const createdQueries = await db.insertMany('queries', queries);
    console.log(`Created ${createdQueries.length} queries`);
    
    // Log the created data for verification
    console.log('\nSeed data created successfully!');
    console.log(`- Users: ${db.users.length}`);
    console.log(`- Queries: ${db.queries.length}`);

    console.log('Seed completed successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
