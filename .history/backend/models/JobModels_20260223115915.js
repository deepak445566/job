const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  

  company: { 
    type: String, 
    required: true 
  },

  companyDescription: String,
  
  // Job details
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  shortDescription: {
    type: String,
    maxlength: 300
  },
  
  // Location
  location: {
    city: String,
    state: String,
    country: String,
    workType: { 
      type: String, 
      enum: ['remote', 'onsite', 'hybrid'],
      required: true
    }
  },
  
  // Requirements
  requirements: [String],
  responsibilities: [String],
  skillsRequired: [String],
  
  // Experience
  experience: {
    min: {
      type: Number,
      min: 0,
      required: true
    },
    max: {
      type: Number,
      min: 0
    }
  },
  
  // Salary
  salary: {
    min: Number,
    max: Number,
    currency: { 
      type: String, 
      default: 'INR' 
    },
    isNegotiable: {
      type: Boolean,
      default: true
    }
  },
  
  // Job details
  jobType: { 
    type: String, 
    enum: ['full-time', 'part-time', 'internship', 'contract', 'freelance'],
    required: true 
  },
  openings: {
    type: Number,
    default: 1
  },
  

  applicationLink: String,
  applicationEmail: String,
  deadline: Date,
  

  applicants: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    appliedAt: { 
      type: Date, 
      default: Date.now 
    },
    status: { 
      type: String, 
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'], 
      default: 'pending' 
    },
    notes: String
  }],
  applicantsCount: {
    type: Number,
    default: 0
  },
  
  
  isActive: { 
    type: Boolean, 
    default: true 
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Views/Engagement
  views: {
    type: Number,
    default: 0
  },
  saves: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
  
}, {
  timestamps: true
});

// Indexes
jobSchema.index({ title: 'text', description: 'text', company: 'text' });
jobSchema.index({ jobType: 1, location: 1 });
jobSchema.index({ isActive: 1, deadline: 1 });

module.exports = mongoose.model('Job', jobSchema);