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

const studyrouter = express.Router();

studyrouter.post("/notes", protect, upload.single("file"), uploadNote);


studyrouter.get("/notes", getNotes);


studyrouter.get("/notes/:id", getSingleNote);

studyrouter.delete("/notes/:id", protect, deleteNote);


studyrouter.put("/notes/bookmark/:id", protect, bookmarkNote);


studyrouter.post("/doubts", protect, askDoubt);


studyrouter.get("/doubts", getDoubts);

studyrouter.get("/doubts/:id", getSingleDoubt);


studyrouter.post("/answers", protect, postAnswer);


studyrouter.put("/answers/upvote/:id", protect, upvoteAnswer);


studyrouter.put("/answers/accept/:id", protect, acceptAnswer);

export default studyrouter;
