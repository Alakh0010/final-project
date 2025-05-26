// Load environment variables first
const dotenv = require('dotenv');
const path = require('path');

// Load .env file from the server directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Debug environment variables
console.log('Environment Variables:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('PORT:', process.env.PORT);

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Import routes
const userRoutes = require('./routes/userRoutes');
const queryRoutes = require('./routes/queryRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware for development
if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/queries', queryRoutes);

// Error handling middleware (must be after all other middleware and routes)
app.use(errorHandler);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
