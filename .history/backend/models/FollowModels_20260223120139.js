const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  follower: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  following: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  

  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'blocked'], 
    default: 'accepted' 
  },

  notifications: {
    type: Boolean,
    default: true
  },
  
  // When they started following
  followedAt: {
    type: Date,
    default: Date.now
  }
  
}, {
  timestamps: true
});

// Ensure unique follow relationship
followSchema.index({ follower: 1, following: 1 }, { unique: true });

// Indexes for queries
followSchema.index({ follower: 1, status: 1 });
followSchema.index({ following: 1, status: 1 });

module.exports = mongoose.model('Follow', followSchema);