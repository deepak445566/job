import cookieParser from "cookie-parser";
import express from "express";

import dotenv from "dotenv";



import authRouter from "./Routes/authRoutes.js";
import modeRouter from "./Routes/modeRoutes.js";
import connectDB from "./db/db.js";
import chillRoutes from "./routes/chillRoutes.js"; 


dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Database connect
await connectDB();

// Middleware
app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/mode", modeRouter)
app.use("/api/auth/reel",chillRoutes    )


app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Server start
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
