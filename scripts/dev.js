const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.error(chalk.red('Error: .env file not found. Please create one from .env.example'));
  process.exit(1);
}

// Load environment variables
require('dotenv').config();

// Start the development server
const startServer = () => {
  console.log(chalk.blue('Starting development server...'));
  const server = spawn('npm', ['run', 'start'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NODE_ENV: 'development' },
  });

  server.on('error', (error) => {
    console.error(chalk.red(`Error starting server: ${error.message}`));
    process.exit(1);
  });
};

// Check if MongoDB is running
const checkMongoDB = () => {
  console.log(chalk.blue('Checking MongoDB connection...'));
  const mongoose = require('mongoose');
  
  return new Promise((resolve) => {
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    const db = mongoose.connection;
    
    db.once('open', () => {
      console.log(chalk.green('✓ MongoDB connected'));
      db.close();
      resolve(true);
    });

    db.on('error', (err) => {
      console.error(chalk.red(`MongoDB connection error: ${err.message}`));
      console.log(chalk.yellow('Please make sure MongoDB is running and the connection string is correct.'));
      process.exit(1);
    });
  });
};

// Run development setup
const run = async () => {
  console.log(chalk.cyan('🚀 Starting development environment...'));
  
  try {
    await checkMongoDB();
    startServer();
  } catch (error) {
    console.error(chalk.red('Error setting up development environment:'));
    console.error(error);
    process.exit(1);
  }
};

// Handle process termination
process.on('SIGINT', () => {
  console.log(chalk.yellow('\nShutting down development environment...'));
  process.exit(0);
});

// Start the development environment
run();
