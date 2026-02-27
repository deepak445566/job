const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  videoUrl: { 
    type: String, 
    required: true 
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  caption: { 
    type: String, 
    maxlength: 2200,
    default: ''
  },
  music: {
    title: String,
    artist: String,
    url: String
  },
  
  // Engagement Stats
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
  
  views: { 
    type: Number, 
    default: 0 
  },
  shares: { 
    type: Number, 
    default: 0 
  },
  saves: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Location (optional)
  location: {
    type: String,
    default: ''
  },
  
  // Privacy
  isPrivate: {
    type: Boolean,
    default: false
  },
  
  // For featured reels
  isFeatured: {
    type: Boolean,
    default: false
  }
  
}, {
  timestamps: true
});

// Indexes for better performance
reelSchema.index({ user: 1, createdAt: -1 });
reelSchema.index({ likesCount: -1 });
reelSchema.index({ views: -1 });

module.exports = mongoose.model('Reel', reelSchema);