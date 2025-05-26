const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Log environment variables for debugging
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '*** (set)' : 'Not set');

// Import routes
const userRoutes = require('./routes/userRoutes');
const queryRoutes = require('./routes/queryRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Cookie parser
app.use(cookieParser());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Set security headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/queries', queryRoutes);

// Error handler
app.use(errorHandler);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

// Connect to database and start server
connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
      console.log(`Error: ${err.message}`.red);
      // Close server & exit process
      server.close(() => process.exit(1));
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB'.red.bold);
    console.error(err);
    process.exit(1);
  });
