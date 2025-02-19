import {User }from "../models/users.modes.js";

export async function registerUser(req, res) {
    try {
        const { username, email, fullName, password } = req.body;
        if (!username || !email || !fullName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.create({ username, email, fullName, password });
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save(); 

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