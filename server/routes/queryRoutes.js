const express = require('express');
const router = express.Router();
const { 
  getQueries,
  getQueryById,
  createQuery,
  updateQuery,
  deleteQuery,
  addComment
} = require('../controllers/queryController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are protected
router.route('/')
  .get(protect, getQueries)
  .post(protect, createQuery);

router.route('/:id')
  .get(protect, getQueryById)
  .put(protect, updateQuery)
  .delete(protect, deleteQuery);

router.route('/:id/comments')
  .post(protect, addComment);

module.exports = router;
