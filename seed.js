require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string from .env file
const MONGODB_URI = process.env.MONGODB_URI || process.env.REACT_APP_MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable');
  process.exit(1);
}

// Define simple schemas directly in this file since we can't import TS interfaces
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const querySchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    status: { type: String, enum: ['pending', 'in-progress', 'resolved', 'closed'], default: 'pending' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    category: String,
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

// Create models
const User = mongoose.model('User', userSchema);
const Query = mongoose.model('Query', querySchema);

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Query.deleteMany({});

    // Create admin user
    console.log('Creating admin user...');
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // Will be hashed automatically by the pre-save hook
      role: 'admin'
    });
    await adminUser.save();

    // Create regular users
    console.log('Creating regular users...');
    const user1 = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user'
    });
    await user1.save();

    const user2 = new User({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      role: 'user'
    });
    await user2.save();

    // Create queries
    console.log('Creating queries...');
    const queries = [
      {
        title: 'Technical Support: Login Issue',
        description: 'I am unable to log in to my account after the recent update. I keep getting an "Invalid credentials" error even though I am sure my password is correct.',
        status: 'pending',
        priority: 'high',
        category: 'Technical Support',
        submittedBy: user1._id,
        tags: ['login', 'account', 'error']
      },
      {
        title: 'Billing Inquiry: Double Charge',
        description: 'I was charged twice for my monthly subscription on May 8th. I would like a refund for the duplicate charge as soon as possible.',
        status: 'in-progress',
        priority: 'urgent',
        category: 'Billing',
        submittedBy: user1._id,
        assignedTo: adminUser._id,
        tags: ['billing', 'refund', 'duplicate']
      },
      {
        title: 'Feature Request: Dark Mode',
        description: 'Could you please add a dark mode option to the application? It would be much easier on the eyes when using the app at night.',
        status: 'pending',
        priority: 'low',
        category: 'Feature Request',
        submittedBy: user2._id,
        tags: ['ui', 'design', 'accessibility']
      },
      {
        title: 'Missing Data in Reports',
        description: 'The monthly analytics reports are missing data from the last week of April. Can you please investigate and provide the complete data?',
        status: 'resolved',
        priority: 'medium',
        category: 'Data Issue',
        submittedBy: user2._id,
        assignedTo: adminUser._id,
        tags: ['reports', 'analytics', 'data']
      },
      {
        title: 'Mobile App Crashes on Startup',
        description: 'After the latest update, the mobile app crashes immediately upon startup on my Android device. I am using a Samsung Galaxy S21 with Android 12.',
        status: 'in-progress',
        priority: 'high',
        category: 'Technical Support',
        submittedBy: user1._id,
        assignedTo: adminUser._id,
        tags: ['mobile', 'crash', 'android']
      }
    ];

    await Query.insertMany(queries);
    console.log(`Created ${queries.length} queries`);

    console.log('Seed completed successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
