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
} from "";

import upload from "../middleware/multer.js";
import { protect } from "../middleware/auth.middleware.js";

const studyRouter = express.Router();

studyRouter.post("/notes", protect, upload.single("file"), uploadNote);


studyRouter.get("/notes", getNotes);


studyRouter.get("/notes/:id", getSingleNote);

studyRouter.delete("/notes/:id", protect, deleteNote);


studyRouter.put("/notes/bookmark/:id", protect, bookmarkNote);


studyRouter.post("/doubts", protect, askDoubt);


studyRouter.get("/doubts", getDoubts);

studyRouter.get("/doubts/:id", getSingleDoubt);


studyRouter.post("/answers", protect, postAnswer);


studyRouter.put("/answers/upvote/:id", protect, upvoteAnswer);


studyRouter.put("/answers/accept/:id", protect, acceptAnswer);

export default studyRouter;
