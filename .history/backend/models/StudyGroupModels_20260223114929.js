const mongoose = require('mongoose');

const studyGroupSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: 1000
  },
  coverImage: String,
  
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  
  // Group members
  members: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    role: { 
      type: String, 
      enum: ['admin', 'moderator', 'member'], 
      default: 'member' 
    },
    joinedAt: { 
      type: Date, 
      default: Date.now 
    },
    contributions: {
      notesShared: { type: Number, default: 0 },
      comments: { type: Number, default: 0 }
    }
  }],
  membersCount: {
    type: Number,
    default: 1
  },
  
  // Group focus
  subjects: [String],
  topics: [String],
  educationLevel: {
    type: String,
    enum: ['school', 'undergraduate', 'graduate', 'professional']
  },
  
  // Resources shared
  resources: [{
    title: String,
    type: {
      type: String,
      enum: ['note', 'link', 'video', 'question']
    },
    url: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Upcoming study sessions
  studySessions: [{
    title: String,
    description: String,
    date: Date,
    duration: Number, // in minutes
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    attendees: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],
  
  // Group rules
  rules: [String],
  
  // Privacy
  isPrivate: { 
    type: Boolean, 
    default: false 
  },
  joinRequests: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  }],
  
  // Group activity
  lastActive: {
    type: Date,
    default: Date.now
  }
  
}, {
  timestamps: true
});

// Indexes
studyGroupSchema.index({ subjects: 1 });
studyGroupSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('StudyGroup', studyGroupSchema);