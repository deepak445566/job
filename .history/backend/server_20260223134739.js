import cookieParser from "cookie-parser";
import express from "express";

import dotenv from "dotenv";


import connectCloudinary from "./src/services/Storage.js";
import authRouter from "./Routes/authRoutes.js";
import modeRouter from "./Routes/modeRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Database connect
await connectDB();
await connectCloudinary();
// Middleware
app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/mode", modeRouter)



app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Server start
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
