const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate token
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'No token, authorization denied' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    // Add user to request object
    req.user = user;
    next();
    
  } catch (err) {
    res.status(401).json({ 
      success: false, 
      error: 'Token is not valid' 
    });
  }
};

// Middleware to check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      error: 'Access denied: Admin rights required'
    });
  }
};
