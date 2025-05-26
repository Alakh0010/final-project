const Query = require('../models/Query');

// @desc    Get all queries
// @route   GET /api/queries
// @access  Private/Admin
exports.getQueries = async (req, res) => {
  try {
    const queries = await Query.find().sort('-createdAt');
    res.status(200).json({
      success: true,
      count: queries.length,
      data: queries
    });
  } catch (error) {
    console.error('Error fetching queries:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching queries'
    });
  }
};

// @desc    Get single query
// @route   GET /api/queries/:id
// @access  Private
exports.getQueryById = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) {
      return res.status(404).json({
        success: false,
        error: 'Query not found'
      });
    }
    res.status(200).json({
      success: true,
      data: query
    });
  } catch (error) {
    console.error('Error fetching query:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching query'
    });
  }
};

// @desc    Create new query
// @route   POST /api/queries
// @access  Public
exports.createQuery = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Create query
    const query = new Query({
      name,
      email,
      subject,
      message,
      status: 'pending'
    });

    await query.save();

    res.status(201).json({
      success: true,
      data: query
    });
  } catch (error) {
    console.error('Error creating query:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Error creating query'
    });
  }
};

// @desc    Update query
// @route   PUT /api/queries/:id
// @access  Private/Admin
exports.updateQuery = async (req, res) => {
  try {
    const query = await Query.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!query) {
      return res.status(404).json({
        success: false,
        error: 'Query not found'
      });
    }

    res.status(200).json({
      success: true,
      data: query
    });
  } catch (error) {
    console.error('Error updating query:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Error updating query'
    });
  }
};

// @desc    Delete query
// @route   DELETE /api/queries/:id
// @access  Private/Admin
exports.deleteQuery = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);

    if (!query) {
      return res.status(404).json({
        success: false,
        error: 'Query not found'
      });
    }

    await query.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting query:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error deleting query'
    });
  }
};
