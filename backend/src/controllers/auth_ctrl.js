import { User }from "../models/users.models.js";
import { updateStatsOnNewUser } from "./statisticsController.js";
import { omitPassword } from "../utils/sanitizeUser.js";
import { issueTokens } from "../utils/jwt.js";
import jwt from "jsonwebtoken";

export async function registerUser(req, res) {
    try {
        const { current_address, email, fullName, password, latitude, longitude  } = req.body;
        if (!current_address || !email || !fullName || !password || !latitude ||!longitude) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.create({ current_address,
            email,
            fullName,
            password,
            coordinates: { type: "Point", coordinates: [longitude, latitude] }
        });

        const { accessToken, refreshToken } = await issueTokens(user);
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });

        const sanitizedUser = omitPassword(user);

        // Update statistics for new user registration
        await updateStatsOnNewUser();

        res.status(201).json({
            message: "User registered successfully",
            user: sanitizedUser,
            accessToken,
        });
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}   

export async function loginUser(req,res,next){
    try{
        const {email, password } = req.body;
        if(!email ||!password){
            return res.status(400).json({message: "Email and password are required"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message: "Invalid credentials"});
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json({message: "Invalid credentials"});
        }

        const { accessToken, refreshToken } = await issueTokens(user);
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });

        return res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName
            },
            accessToken,
        });
    }
    catch(err){
        console.error("Error logging in user:", err);
        res.status(500).json({message: "Internal server error"});
    }
}

export async function logOut(req, res, next) {
  try {
    // Clear refresh token from the user in DB
    req.user.refreshToken = null;
    await req.user.save();

    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict', // adjust if needed
    });

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Error logging out user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function refreshAccessToken(req, res) {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Issue new tokens
    const { accessToken, refreshToken } = await issueTokens(user);
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const sanitizedUser = omitPassword(user);

    res.status(200).json({
      message: "Access token refreshed",
      accessToken,
      user: sanitizedUser,
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
}

        // const accessToken = user.generateAccessToken();
        // const refreshToken = user.generateRefreshToken();

        // user.refreshToken = refreshToken;
        // await user.save(); 