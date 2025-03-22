import { Router } from "express";
import {registerUser,loginUser,logOut } from "../controllers/auth.controller.js";
const userRouter =  Router();

userRouter.post('/user-register',registerUser);
userRouter.post('/user-login',loginUser);
userRouter.post('/user-logout',logOut);

export default userRouter;