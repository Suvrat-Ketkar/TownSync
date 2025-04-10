import jwt from "jsonwebtoken"; 
import { User } from "../models/users.models.js";

export const authenticateUser = async (req, res, next) => {
  try {
    // Use lowercase 'authorization'
    const accessToken = req.headers.authorization;
    console.log("Access Token:", accessToken);

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized request - access token missing"
      });
    }

    // Usually token comes in format: Bearer <token>
    const token = accessToken.split(" ")[1]; // Get just the token

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Access token auth error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized - invalid or expired access token"
    });
  }
};
