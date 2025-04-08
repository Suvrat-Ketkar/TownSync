import jwt from "jsonwebtoken";
import { User }from "../models/users.models.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized request - refresh token missing"
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token"
      });
    }

    // Attach full user object to req
    req.user = user;

    next();
  } catch (error) {
    console.error("Refresh token auth error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized - invalid or expired refresh token"
    });
  }
};
