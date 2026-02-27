const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  

  content: {
    text: {
      type: String,
      maxlength: 5000
    },
   
    mediaType: {
      type: String,
      enum: ['image', 'video', 'audio', 'file']
    }
  },
  
  // Message type
  messageType: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'file', 'story_reply', 'post_share'],
    default: 'text'
  },
  
  // Status
  read: { 
    type: Boolean, 
    default: false 
  },
  readAt: Date,
  
  delivered: { 
    type: Boolean, 
    default: false 
  },
  deliveredAt: Date,
  
  // For replies
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },

  // For deleted messages
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedFor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
  
}, {
  timestamps: true
});

// Index for chat history
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, read: 1 });

module.exports = mongoose.model('Message', messageSchema);