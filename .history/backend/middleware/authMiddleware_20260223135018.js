import jwt from "jsonwebtoken";
import User from "../models/UserModels.js";


export const protect = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not found",
      });
    }

    // Attach user to request object
    req.user = user;
    next();
    
  } catch (error) {
    console.log("Auth Middleware Error:", error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }
    
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};