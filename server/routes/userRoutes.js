const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  updatePassword
} = require('../controllers/userController');
const { 
  register, 
  login, 
  getUserProfile 
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/password', protect, updatePassword);

// Admin routes
router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;
