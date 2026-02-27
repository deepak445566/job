const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  mode: { 
    type: String, 
    enum: ['chill', 'study'], 
    required: true 
  },
  
  // Content
  content: {
    text: {
      type: String,
      maxlength: 5000
    },
    mediaUrls: [{
      url: String,
      type: {
        type: String,
        enum: ['image', 'video', 'gif']
      }
    }]
  },
  
  // Tags/Hashtags
  hashtags: [String],
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Engagement
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  
  // If repost
  originalPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  
  // Privacy
  visibility: {
    type: String,
    enum: ['public', 'followers', 'private'],
    default: 'public'
  }
  
}, {
  timestamps: true
});

// Indexes
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ hashtags: 1 });
postSchema.index({ mode: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);