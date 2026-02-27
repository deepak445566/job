const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Notification type
  type: { 
    type: String, 
    enum: [
      'like', 'comment', 'follow', 'follow_request', 
      'job_alert', 'new_note', 'new_reel', 'mention',
      'story_reply', 'message', 'job_application_update',
      'study_group_invite'
    ],
    required: true 
  },
  
  // Who triggered this notification
  triggeredBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  
  // What content it's about (polymorphic)
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'referenceModel'
  },
  referenceModel: {
    type: String,
    enum: ['User', 'Reel', 'Post', 'Note', 'Job', 'Comment', 'Message', 'Story']
  },
  
  // Notification content
  title: String,
  message: String,
  image: String, // thumbnail
  
  // Action URL
  actionUrl: String,
  
  // Status
  isRead: { 
    type: Boolean, 
    default: false 
  },
  isClicked: {
    type: Boolean,
    default: false
  },
  
  // Priority
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  }
  
}, {
  timestamps: true
});

// Index for user's notifications
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);