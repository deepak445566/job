import express from "express";


import { getMe, loginUser, logout, registerUser } from "../Controllers/authControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logout);
authRouter.get("/me", protect, getMe);
authRouter.get("/isauth")

export default authRouter;