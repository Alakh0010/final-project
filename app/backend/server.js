const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Routes
const userRoutes = require('./api/userRoutes');
const queryRoutes = require('./api/queryRoutes');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/queries', queryRoutes);

// Handle production
if (process.env.NODE_ENV === 'production') {
  // Static folder
  app.use(express.static(path.join(__dirname, '../../build')));
  
  // Handle SPA
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../build', 'index.html'));
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
