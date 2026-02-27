
import Comment from "../models/commentModels.js";
import Reel from "../models/ReelModels.js";
import User from "../models/UserModels.js";


export const createReel = async (req, res) => {
  try {
 const caption = req.body?.caption;
  const videoFile = req.file;

  if (!videoFile) {
    return res.status(400).json({
      success: false,
      message: "No audio file uploaded",
    });
  }

  if (!caption) {
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });
  }

  // Upload to Cloudinary
  const result = await cloudinary.uploader.upload(videoFile.path, {
    resource_type: "video",
    folder: "video",
  });

    
   const reel = await Reel.create({
      user: req.user.id,
      videoUrl: result.secure_url,
      caption: caption
    
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
export const getReels = async (req, res) => {
  try {
    const reels = await Reel.find()
      .populate('user', 'username fullName profilePic')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username profilePic' }
      })
      .sort('-createdAt');
    
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
export const deleteReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    
    if (!reel) {
      return res.status(404).json({ success: false, message: "Reel not found" });
    }
    
    if (reel.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    
    await reel.deleteOne();
    
    res.json({ success: true, message: "Reel deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ============================================
// LIKE CONTROLLERS
// ============================================

// @desc    Like/Unlike Reel
export const toggleLike = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    
    if (!reel) {
      return res.status(404).json({ success: false, message: "Reel not found" });
    }
    
    const hasLiked = reel.likes.includes(req.user.id);
    
    if (hasLiked) {
      reel.likes = reel.likes.filter(id => id.toString() !== req.user.id);
    } else {
      reel.likes.push(req.user.id);
    }
    
    await reel.save();
    
    res.json({
      success: true,
      liked: !hasLiked,
      likesCount: reel.likes.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get reel likes
export const getLikes = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id).populate('likes', 'username fullName profilePic');
    
    res.json({
      success: true,
      likes: reel.likes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ============================================
// COMMENT CONTROLLERS
// ============================================

// @desc    Add Comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    const comment = await Comment.create({
      user: req.user.id,
      reel: req.params.id,
      text
    });
    
    await Reel.findByIdAndUpdate(req.params.id, {
      $push: { comments: comment._id }
    });
    
    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'username profilePic');
    
    res.status(201).json({
      success: true,
      comment: populatedComment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Comments
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ reel: req.params.id })
      .populate('user', 'username profilePic')
      .sort('-createdAt');
    
    res.json({
      success: true,
      comments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }
    
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    
    await Reel.findByIdAndUpdate(comment.reel, {
      $pull: { comments: comment._id }
    });
    
    await comment.deleteOne();
    
    res.json({ success: true, message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ============================================
// SAVE CONTROLLERS
// ============================================

// @desc    Save/Unsave Reel
export const toggleSave = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);
    
    if (!reel) {
      return res.status(404).json({ success: false, message: "Reel not found" });
    }
    
    const hasSaved = reel.saves.includes(req.user.id);
    
    if (hasSaved) {
      reel.saves = reel.saves.filter(id => id.toString() !== req.user.id);
    } else {
      reel.saves.push(req.user.id);
    }
    
    await reel.save();
    
    res.json({
      success: true,
      saved: !hasSaved,
      savesCount: reel.saves.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Saved Reels
export const getSavedReels = async (req, res) => {
  try {
    const reels = await Reel.find({ saves: req.user.id })
      .populate('user', 'username fullName profilePic')
      .sort('-updatedAt');
    
    res.json({
      success: true,
      reels
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ============================================
// FOLLOW/PROFILE CONTROLLERS
// ============================================

// @desc    Follow/Unfollow User
export const toggleFollow = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    
    if (!userToFollow) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: "Can't follow yourself" });
    }
    
    const currentUser = await User.findById(req.user.id);
    
    const isFollowing = currentUser.following.includes(req.params.id);
    
    if (isFollowing) {
      currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.id);
      userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== req.user.id);
    } else {
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user.id);
    }
    
    await currentUser.save();
    await userToFollow.save();
    
    res.json({
      success: true,
      following: !isFollowing,
      followersCount: userToFollow.followers.length,
      followingCount: currentUser.following.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password')
      .populate('followers', 'username fullName profilePic')
      .populate('following', 'username fullName profilePic');
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const reels = await Reel.find({ user: user._id })
      .populate('user', 'username profilePic')
      .sort('-createdAt');
    
    const isFollowing = user.followers.some(f => f._id.toString() === req.user.id);
    
    res.json({
      success: true,
      profile: {
        ...user.toObject(),
        reels,
        reelsCount: reels.length,
        isFollowing,
        isOwnProfile: user._id.toString() === req.user.id
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Followers List
export const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'username fullName profilePic bio');
    
    res.json({
      success: true,
      followers: user.followers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Following List
export const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('following', 'username fullName profilePic bio');
    
    res.json({
      success: true,
      following: user.following
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

