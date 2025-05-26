const mongoose = require('mongoose');

const QuerySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
    maxlength: [100, 'Subject cannot be more than 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Please add a message']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    required: false
  },
  brand: {
    type: String,
    required: false
  },
  attachments: [{
    url: String,
    filename: String
  }],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Query', QuerySchema);
