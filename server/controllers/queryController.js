const Query = require('../models/Query');
const User = require('../models/User');

// @desc    Get all queries
// @route   GET /api/queries
// @access  Private
exports.getQueries = async (req, res, next) => {
  try {
    let query;
    
    // Admin sees all queries, users see only their own
    if (req.user.role === 'admin') {
      query = Query.find();
    } else {
      query = Query.find({ user: req.user._id });
    }
    
    // Add filtering, sorting, pagination as needed
    const { status, priority, category, sort, page = 1, limit = 10 } = req.query;
    
    // Filter by status
    if (status) {
      query = query.find({ status });
    }
    
    // Filter by priority
    if (priority) {
      query = query.find({ priority });
    }
    
    // Filter by category
    if (category) {
      query = query.find({ category });
    }
    
    // Sort
    if (sort) {
      const sortBy = sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    query = query.skip(skip).limit(parseInt(limit));
    
    // Execute query with populate
    const queries = await query.populate([
      { path: 'user', select: 'name email' },
      { path: 'assignedTo', select: 'name email' },
      { path: 'comments.user', select: 'name email' }
    ]);
    
    // Get total count for pagination
    const total = await Query.countDocuments();
    
    res.json({
      success: true,
      count: queries.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      queries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single query
// @route   GET /api/queries/:id
// @access  Private
exports.getQueryById = async (req, res, next) => {
  try {
    const query = await Query.findById(req.params.id).populate([
      { path: 'user', select: 'name email' },
      { path: 'assignedTo', select: 'name email' },
      { path: 'comments.user', select: 'name email' }
    ]);
    
    if (!query) {
      return res.status(404).json({
        success: false,
        error: 'Query not found'
      });
    }
    
    // Check if user has access to this query (admin or query owner)
    if (req.user.role !== 'admin' && query.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this query'
      });
    }
    
    res.json({
      success: true,
      query
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new query
// @route   POST /api/queries
// @access  Private
exports.createQuery = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user._id;
    
    const query = await Query.create(req.body);
    
    res.status(201).json({
      success: true,
      query
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update query
// @route   PUT /api/queries/:id
// @access  Private
exports.updateQuery = async (req, res, next) => {
  try {
    let query = await Query.findById(req.params.id);
    
    if (!query) {
      return res.status(404).json({
        success: false,
        error: 'Query not found'
      });
    }
    
    // Check if user is authorized to update query (admin or query owner)
    if (req.user.role !== 'admin' && query.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this query'
      });
    }
    
    // If status is changing to resolved, set resolvedAt date
    if (req.body.status === 'resolved' && query.status !== 'resolved') {
      req.body.resolvedAt = Date.now();
    }
    
    // Update the query
    query = await Query.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate([
      { path: 'user', select: 'name email' },
      { path: 'assignedTo', select: 'name email' },
      { path: 'comments.user', select: 'name email' }
    ]);
    
    res.json({
      success: true,
      query
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete query
// @route   DELETE /api/queries/:id
// @access  Private
exports.deleteQuery = async (req, res, next) => {
  try {
    const query = await Query.findById(req.params.id);
    
    if (!query) {
      return res.status(404).json({
        success: false,
        error: 'Query not found'
      });
    }
    
    // Check if user has permission to delete (admin or query owner)
    if (req.user.role !== 'admin' && query.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this query'
      });
    }
    
    await query.deleteOne();
    
    res.json({
      success: true,
      message: 'Query removed'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to query
// @route   POST /api/queries/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a comment text'
      });
    }
    
    const query = await Query.findById(req.params.id);
    
    if (!query) {
      return res.status(404).json({
        success: false,
        error: 'Query not found'
      });
    }
    
    // Add comment to query
    query.comments.unshift({
      user: req.user._id,
      text
    });
    
    await query.save();
    
    // Return the updated query with populated fields
    const updatedQuery = await Query.findById(req.params.id).populate([
      { path: 'user', select: 'name email' },
      { path: 'assignedTo', select: 'name email' },
      { path: 'comments.user', select: 'name email' }
    ]);
    
    res.json({
      success: true,
      query: updatedQuery
    });
  } catch (error) {
    next(error);
  }
};
