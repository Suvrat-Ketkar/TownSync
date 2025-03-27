import { User }from "../models/users.modes.js";
import { updateStatsOnNewUser } from "./statisticsController.js";

export async function registerUser(req, res) {
    try {
        const { current_address, email, fullName, password } = req.body;
        if (!current_address || !email || !fullName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.create({ current_address, email, fullName, password });
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save(); 
        
        // Update statistics for new user registration
        await updateStatsOnNewUser();

        res.status(201).json({
            message: "User registered successfully",
            user,
            accessToken,
            refreshToken,
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
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save();

        return res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName
            },
            accessToken,
            refreshToken
        });
        console.log(user);
    }
    catch(err){
        console.error("Error logging in user:", err);
        res.status(500).json({message: "Internal server error"});
    }
}

export async function logOut(req,res,next){
    try{
        req.user.accessToken = null;
        req.user.refreshToken = null;
        await req.user.save();
        res.json({message: "Logged out successfully"});
    }
    catch(err){
        console.error("Error logging out user:", err);
        res.status(500).json({message: "Internal server error"});
    }
}