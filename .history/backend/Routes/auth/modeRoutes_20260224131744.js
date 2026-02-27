import express from "express";
import { getMode, switchMode } from "../Controllers/chill/modeController.js";
import { protect } from "../middleware/authMiddleware.js";

const modeRouter = express.Router();

// All mode routes are protected
modeRouter.use(protect);

modeRouter.get("/", getMode);
modeRouter.put("/switch", switchMode);

export default modeRouter;
