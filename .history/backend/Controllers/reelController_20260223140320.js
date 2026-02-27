import Reel from "../models/ReelModels.js";


// @desc    Create Reel
// @route   POST /api/reels
export const createReel = async (req, res) => {
  try {
    const { videoUrl, caption, thumbnail } = req.body;
    
    const reel = await Reel.create({
      user: req.user.id,
      videoUrl,
      caption,
      thumbnail
    });
    
    res.status(201).json({
      success: true,
      reel
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Reels (Feed)
// @route   GET /api/reels
export const getReels = async (req, res) => {
  try {
    const reels = await Reel.find()
      .populate('user', 'username fullName profilePic')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username profilePic' }
      })
      .sort('-createdAt');
    
    // Add like/save status for current user
    const reelsWithStatus = reels.map(reel => ({
      ...reel.toObject(),
      isLiked: reel.likes.includes(req.user.id),
      isSaved: reel.saves.includes(req.user.id)
    }));
    
    res.json({
      success: true,
      reels: reelsWithStatus
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Single Reel
// @route   GET /api/reels/:id
export const getReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id)
      .populate('user', 'username fullName profilePic')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username profilePic' }
      });
    
    if (!reel) {
      return res.status(404).json({ success: false, message: "Reel not found" });
    }
    
    res.json({
      success: true,
      reel: {
        ...reel.toObject(),
        isLiked: reel.likes.includes(req.user.id),
        isSaved: reel.saves.includes(req.user.id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Reel
// @route   DELETE /api/reels/:id
export const deleteReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    
    if (!reel) {
      return res.status(404).json({ success: false, message: "Reel not found" });
    }
    
    // Check ownership
    if (reel.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    
    await reel.deleteOne();
    
    res.json({ success: true, message: "Reel deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};