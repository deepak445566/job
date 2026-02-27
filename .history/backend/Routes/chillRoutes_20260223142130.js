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
} from "../Controllers/reelController.js";
import { protect } from "../middleware/authMiddleware.js";



const router = express.Router();

// Sabhi routes protected hain
router.use(protect);

router.route("/reels,,upload.single("music"),").get(getReels).post(createReel);

router.get("/reels/saved", getSavedReels);

router.route("/reels/:id").get(getReel).delete(deleteReel);

router.post("/reels/:id/like", toggleLike);
router.get("/reels/:id/likes", getLikes);

router.post("/reels/:id/comments", addComment);
router.get("/reels/:id/comments", getComments);
router.delete("/comments/:id", deleteComment);

router.post("/reels/:id/save", toggleSave);

router.get("/users/:username", getUserProfile);
router.post("/users/:id/follow", toggleFollow);
router.get("/users/:id/followers", getFollowers);
router.get("/users/:id/following", getFollowing);

export default router;
