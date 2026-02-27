import express from "express";

import { protect } from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logout);
authRouter.get("/me", protect, getMe);

export default authRouter;