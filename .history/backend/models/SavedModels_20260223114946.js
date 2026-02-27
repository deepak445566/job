const mongoose = require('mongoose');

const savedSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // What is saved (polymorphic)
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'itemModel'
  },
  itemModel: {
    type: String,
    required: true,
    enum: ['Reel', 'Post', 'Note', 'Job']
  },
  
  // Collection/category
  collection: {
    type: String,
    default: 'default'
  },
  
  // Notes on saved item
  notes: String
  
}, {
  timestamps: true
});

// Ensure unique save
savedSchema.index({ user: 1, itemId: 1, itemModel: 1 }, { unique: true });

module.exports = mongoose.model('Saved', savedSchema);