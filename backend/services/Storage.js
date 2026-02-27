import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// ✅ IMPORTANT: dotenv config top pe hona chahiye
dotenv.config();

const connectCloudinary = async () => {
  try {
    // Debug: Check if env variables are loading
    console.log("Cloud Name:", process.env.CLOUD_NAME);
    console.log("API Key:", process.env.API_KEY ? "✅ Loaded" : "❌ Missing");
    console.log("API Secret:", process.env.API_SECRET ? "✅ Loaded" : "❌ Missing");

    if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
      throw new Error("Missing Cloudinary credentials in .env file");
    }

    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
      secure: true
    });
    
    console.log("✅ Cloudinary connected successfully");
  } catch (error) {
    console.error("❌ Cloudinary connection failed:", error.message);
    process.exit(1); // Exit if cloudinary can't connect
  }
};

export default connectCloudinary;