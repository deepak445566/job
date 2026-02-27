const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Basic info
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: 1000
  },
  subject: {
    type: String,
    required: true
  },
  topic: String,
  
  // File details
  fileUrl: { 
    type: String, 
    required: true 
  },
  fileType: {
    type: String,
    enum: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'image', 'txt'],
    required: true
  },
  fileSize: Number, // in bytes
  pages: Number,
  
  // Metadata
  author: String,
  publicationYear: Number,
  edition: String,
  
  // Engagement
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  downloads: { 
    type: Number, 
    default: 0 
  },
  views: {
    type: Number,
    default: 0
  },
  
  // Quality rating by users
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    ratedAt: {
      type: Date,
      default: Date.now
    }
  }],
  

  tags: [String],
  

  visibility: {
    type: String,
    enum: ['public', 'private', 'shared'],
    default: 'public'
  },
  
  // Shared with specific users (if visibility = shared)
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
  
}, {
  timestamps: true
});

// Indexes for search
noteSchema.index({ title: 'text', description: 'text', subject: 'text', tags: 'text' });
noteSchema.index({ user: 1, createdAt: -1 });
noteSchema.index({ subject: 1, downloads: -1 });

module.exports = mongoose.model('Note', noteSchema);