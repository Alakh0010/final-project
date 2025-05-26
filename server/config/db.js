const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    // Always use local MongoDB for now
    const mongoUri = 'mongodb://127.0.0.1:27017/quick-query';
    console.log('Connecting to local MongoDB at:', mongoUri);

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    console.log(`Database Name: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('MongoDB Connection Error:'.red.bold, error.message);
    if (error.name === 'MongoParseError') {
      console.error('Invalid MongoDB connection string format'.red);
    }
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
