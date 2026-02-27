const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Media
  mediaUrl: { 
    type: String, 
    required: true 
  },
  mediaType: { 
    type: String, 
    enum: ['image', 'video'],
    required: true 
  },
  thumbnailUrl: String,
  
  // Story content
  caption: {
    type: String,
    maxlength: 200
  },
  music: {
    title: String,
    url: String
  },
 
  
  // Engagement
  viewedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  viewsCount: {
    type: Number,
    default: 0
  },
  
  // Replies to story
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    repliedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Expiry
  expiresAt: { 
    type: Date, 
    default: () => new Date(+new Date() + 24*60*60*1000) 
  },
  
  // If highlighted
  isHighlighted: {
    type: Boolean,
    default: false
  },
  highlightTitle: String
  
}, {
  timestamps: true
});

// Auto-delete expired stories
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Story', storySchema);