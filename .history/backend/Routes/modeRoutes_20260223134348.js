import express from "express";
import { 
  getMode,
  switchMode,
  setMode 
} from "
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All mode routes are protected
router.use(protect);

router.get("/", getMode);
router.put("/switch", switchMode);
router.put("/set", setMode);

export default router;