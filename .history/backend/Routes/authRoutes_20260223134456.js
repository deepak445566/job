import express from "express";
import { 
  registerUser, 
  loginUser, 
  logout,
  getMe 
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const authR
outer = express.Router();

authR
outer.post("/register", registerUser);
authR
outer.post("/login", loginUser);
authR
outer.post("/logout", logout);
authR
outer.get("/me", protect, getMe);

export default authR
outer;