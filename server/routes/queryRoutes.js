const express = require('express');
const router = express.Router();
const {
  getQueries,
  getQueryById,
  createQuery,
  updateQuery,
  deleteQuery
} = require('../controllers/queryController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/', createQuery);

// Protected routes (require authentication)
router.get('/:id', protect, getQueryById);

// Admin routes (require admin role)
router.get('/', protect, authorize('admin'), getQueries);
router.put('/:id', protect, authorize('admin'), updateQuery);
router.delete('/:id', protect, authorize('admin'), deleteQuery);

module.exports = router;
