import express from "express";
import { 
  registerUser, 
  loginUser, 
  logout,
  getMe 
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const authrouter = express.Router();

authrouter.post("/register", registerUser);
authrouter.post("/login", loginUser);
authrouter.post("/logout", logout);
authrouter.get("/me", protect, getMe);

export default authrouter;