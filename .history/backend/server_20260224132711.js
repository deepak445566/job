import cookieParser from "cookie-parser";
import express from "express";

import dotenv from "dotenv";

import authRouter from "./Routes/auth/authRoutes.js";
import modeRouter from "./Routes/auth/modeRoutes.js";
import connectDB from "./db/db.js";
import chillRoutes from "./Routes/chill/chillRoutes.js";
import connectCloudinary from "./services/Storage.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Database connect
await connectDB();
await connectCloudinary();
// Middleware
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/mode", modeRouter);
app.use("/api/chills", chillRoutes);
app.use("/api")
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Server start
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
