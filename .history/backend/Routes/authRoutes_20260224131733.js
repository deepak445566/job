import express from "express";

import {
  getMe,
  isAuth,
  loginUser,
  logout,
  registerUser,
} from "../Controllers/auth/authControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logout);
authRouter.get("/me", protect, getMe);
authRouter.get("/isauth", protect, isAuth);

export default authRouter;
