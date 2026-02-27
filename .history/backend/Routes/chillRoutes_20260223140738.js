import express from "express";
import {
  // Reel Controllers
  createReel,
  getReels,
  getReel,
  deleteReel,
  
  // Like Controllers
  toggleLike,
  getLikes,
  
  // Comment Controllers
  addComment,
  getComments,
  deleteComment,
  
  // Save Controllers
  toggleSave,
  getSavedReels,
  
  // Follow/Profile Controllers
  toggleFollow,
  getUserProfile,
  getFollowers,
  getFollowing,
  
  // Mode Controllers
  getMode,
  switchMode,
  setMode
} from "../controllers/chillControllers.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// Sabhi routes protected hain
router.use(protect);

// ============================================
// MODE ROUTES
// ============================================
router.get('/mode', getMode);
router.put('/mode/switch', switchMode);
router.put('/mode/set', setMode);

// ============================================
// REEL ROUTES
// ============================================
router.route('/reels')
  .get(getReels)
  .post(createReel);

router.get('/reels/saved', getSavedReels);

router.route('/reels/:id')
  .get(getReel)
  .delete(deleteReel);

// ============================================
// LIKE ROUTES
// ============================================
router.post('/reels/:id/like', toggleLike);
router.get('/reels/:id/likes', getLikes);

// ============================================
// COMMENT ROUTES
// ============================================
router.post('/reels/:id/comments', addComment);
router.get('/reels/:id/comments', getComments);
router.delete('/comments/:id', deleteComment);

// ============================================
// SAVE ROUTES
// ============================================
router.post('/reels/:id/save', toggleSave);

// ============================================
// FOLLOW/PROFILE ROUTES
// ============================================
router.get('/users/:username', getUserProfile);
router.post('/users/:id/follow', toggleFollow);
router.get('/users/:id/followers', getFollowers);
router.get('/users/:id/following', getFollowing);

export default router;