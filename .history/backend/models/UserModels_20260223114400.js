const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  },
  fullName: { 
    type: String, 
    required: true 
  },
  profilePicture: { 
    type: String, 
    default: "default-avatar.png" 
  },
  bio: { 
    type: String, 
    default: "",
    maxlength: 150
  },
  currentMode: { 
    type: String, 
    enum: ["chill", "study"], 
    default: "chill" 
  },
  
  // Counts (for quick access)
  followersCount: { 
    type: Number, 
    default: 0 
  },
  followingCount: { 
    type: Number, 
    default: 0 
  },
  postsCount: { 
    type: Number, 
    default: 0 
  },
  reelsCount: { 
    type: Number, 
    default: 0 
  },
  notesCount: { 
    type: Number, 
    default: 0 
  },
  
  // Study Mode Preferences
  studyPreferences: {
    interestedTopics: [String],
    education: {
      degree: String,
      institution: String,
      graduationYear: Number
    },
    skills: [String],
    lookingForJob: { 
      type: Boolean, 
      default: false 
    }
  },
  
  // Chill Mode Preferences
  chillPreferences: {
    isPrivate: { 
      type: Boolean, 
      default: false 
    },
    highlights: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story'
    }],
    savedPosts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }],
    savedReels: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reel'
    }]
  },
  
  // Account Status
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastActive: { 
    type: Date, 
    default: Date.now 
  }
  
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);