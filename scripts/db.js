const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const { User, Query } = require('../src/db/models');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quick-query';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

async function seedDatabase() {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Query.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create regular users
    const users = [];
    for (let i = 0; i < 5; i++) {
      const user = await User.create({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password123',
        role: 'user',
      });
      users.push(user);
    }

    // Create sample queries
    const statuses = ['pending', 'in-progress', 'resolved'];
    const priorities = ['low', 'medium', 'high', 'urgent'];

    for (let i = 0; i < 20; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      await Query.create({
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraphs(2),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        submittedBy: {
          _id: randomUser._id,
          name: randomUser.name,
          email: randomUser.email,
        },
      });
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
