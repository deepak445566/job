const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Polymorphic association (can comment on Reel, Post, Note, etc)
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'referenceModel'
  },
  referenceModel: {
    type: String,
    required: true,
    enum: ['Reel', 'Post', 'Note', 'Job']
  },
  
  text: { 
    type: String, 
    required: true,
    maxlength: 500
  },
  
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  
  // For nested replies
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  repliesCount: {
    type: Number,
    default: 0
  },
  
  // Mentioned users
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  isEdited: {
    type: Boolean,
    default: false
  }
  
}, {
  timestamps: true
});

// Indexes
commentSchema.index({ referenceId: 1, referenceModel: 1 });
commentSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema);