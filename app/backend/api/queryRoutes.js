const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Protect all routes
router.use(authenticate);

// User accessible routes
router.post('/', queryController.createQuery);
router.get('/my-queries', queryController.getUserQueries);
router.get('/:id', queryController.getQueryById);
router.post('/:id/comments', queryController.addComment);

// Admin/Owner accessible routes
router.put('/:id', queryController.updateQuery);
router.delete('/:id', queryController.deleteQuery);

// Admin only routes
router.use(isAdmin);
router.get('/', queryController.getAllQueries);
router.put('/:id/assign', queryController.assignQuery);
router.get('/stats/summary', queryController.getQueryStats);

module.exports = router;
