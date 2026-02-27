import express from "express";
import { getMode, setMode, switchMode } from "../Controllers/modeController.js";


const modeouter = express.Router();

// All mode routes are protected
modeouter.use(protect);

modeouter.get("/", getMode);
modeouter.put("/switch", switchMode);
modeouter.put("/set", setMode);

export default modeouter;