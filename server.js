const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = 3001;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/customerQueries', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Query Schema
const querySchema = new mongoose.Schema({
  id: Number,
  userName: String,
  userEmail: String,
  priority: String,
  brand: String,
  section: String,
  description: String,
  attachment: String,
  status: String,
  date: String,
  assignedTo: String,
  lastUpdated: String
});

// Create Query model
const Query = mongoose.model('Query', querySchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Helper function to get the next ID
const getNextId = async () => {
  try {
    const maxQuery = await Query.findOne().sort('-id').exec();
    return maxQuery ? maxQuery.id + 1 : 1;
  } catch (error) {
    console.error('Error getting next ID:', error);
    return 1;
  }
};

// Routes
// Get all queries
app.get('/api/queries', async (req, res) => {
  try {
    const queries = await Query.find().sort({ lastUpdated: -1 });
    res.json(queries);
  } catch (error) {
    console.error('Error fetching queries:', error);
    res.status(500).json({ error: 'Failed to fetch queries' });
  }
});

// Get a specific query
app.get('/api/queries/:id', async (req, res) => {
  try {
    const query = await Query.findOne({ id: parseInt(req.params.id) });
    
    if (!query) {
      return res.status(404).json({ error: 'Query not found' });
    }
    
    res.json(query);
  } catch (error) {
    console.error('Error fetching query:', error);
    res.status(500).json({ error: 'Failed to fetch query' });
  }
});

// Create a new query
app.post('/api/queries', async (req, res) => {
  try {
    console.log('Received query data:', req.body);
    
    // Generate a new ID
    const newId = await getNextId();
    console.log('Generated new ID:', newId);
    
    // Format the new query with admin dashboard compatible fields
    const newQuery = new Query({
      id: newId,
      userName: req.body.name || 'Anonymous',
      userEmail: req.body.email || 'No email provided',
      priority: mapPriority(req.body.priority),
      brand: req.body.brand || 'Unspecified',
      section: req.body.category || 'General',
      description: req.body.description || req.body.query || 'No description provided',
      attachment: req.body.attachment || '',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      assignedTo: '',
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16)
    });
    
    console.log('Created new query object:', newQuery);
    
    // Save the query to MongoDB
    const savedQuery = await newQuery.save();
    console.log('Query saved to MongoDB:', savedQuery);
    
    // Return the saved query to the client
    res.status(201).json(savedQuery);
  } catch (error) {
    console.error('Error creating query:', error);
    res.status(500).json({ error: 'Failed to create query', message: error.message });
  }
});

// Update a query
app.put('/api/queries/:id', async (req, res) => {
  try {
    const queryId = parseInt(req.params.id);
    
    // Update the query with the new data and return the updated document
    const updatedQuery = await Query.findOneAndUpdate(
      { id: queryId },
      { ...req.body, lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16) },
      { new: true }
    );
    
    if (!updatedQuery) {
      return res.status(404).json({ error: 'Query not found' });
    }
    
    res.json(updatedQuery);
  } catch (error) {
    console.error('Error updating query:', error);
    res.status(500).json({ error: 'Failed to update query' });
  }
});

// Delete a query
app.delete('/api/queries/:id', async (req, res) => {
  try {
    const queryId = parseInt(req.params.id);
    
    // Find and remove the query
    const deletedQuery = await Query.findOneAndDelete({ id: queryId });
    
    if (!deletedQuery) {
      return res.status(404).json({ error: 'Query not found' });
    }
    
    res.json({ message: 'Query deleted successfully', deletedQuery });
  } catch (error) {
    console.error('Error deleting query:', error);
    res.status(500).json({ error: 'Failed to delete query' });
  }
});

// Helper function to map priority
function mapPriority(priority) {
  switch(priority) {
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Low';
    default:
      return 'Medium';
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
