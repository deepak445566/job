import express from "express";


const router = express.Router();

// All mode routes are protected
router.use(protect);

router.get("/", getMode);
router.put("/switch", switchMode);
router.put("/set", setMode);

export default router;