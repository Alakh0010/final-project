const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.use(authenticate);
router.get('/me', authController.getCurrentUser);
router.put('/me', userController.updateUserProfile);
router.put('/me/password', userController.updatePassword);

// Admin routes
router.use(isAdmin);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
