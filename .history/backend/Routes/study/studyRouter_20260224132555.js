import express from "express";
import {
  uploadNote,
  getNotes,
  getSingleNote,
  deleteNote,
  bookmarkNote,
  askDoubt,
  getDoubts,
  getSingleDoubt,
  postAnswer,
  upvoteAnswer,
  acceptAnswer,
} from "../controllers/study.controller.js";

import upload from "../middleware/multer.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/notes", protect, upload.single("file"), uploadNote);

// Get All Notes
router.get("/notes", getNotes);

// Get Single Note (increase download count)
router.get("/notes/:id", getSingleNote);

// Delete Note
router.delete("/notes/:id", protect, deleteNote);

// Bookmark Note
router.put("/notes/bookmark/:id", protect, bookmarkNote);

// ======================================================
// ❓ DOUBT ROUTES
// ======================================================

// Ask Doubt
router.post("/doubts", protect, askDoubt);


router.get("/doubts", getDoubts);

router.get("/doubts/:id", getSingleDoubt);


router.post("/answers", protect, postAnswer);


router.put("/answers/upvote/:id", protect, upvoteAnswer);


router.put("/answers/accept/:id", protect, acceptAnswer);

export default router;
