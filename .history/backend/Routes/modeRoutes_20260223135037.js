import express from "express";
import { getMode, setMode, switchMode } from "../Controllers/modeController.js";
import { protect } from "../middleware/authMiddleware.js";


const modeRouter = express.Router();

// All mode routes are protected
modeRouter.use(protect);

modeRouter.get("/", getMode);
modeRouter.put("/switch", switchMode);
modeRouter.put("/set", setMode);

export default modeRouter;