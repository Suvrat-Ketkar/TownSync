import { Router } from "express";
import {registerUser,loginUser,logOut } from "../controllers/auth_ctrl.js";
import { authenticateUser } from "../middleware/auth.js";
const userRouter =  Router();

userRouter.post('/user-register',registerUser);
userRouter.post('/user-login',loginUser);
userRouter.post('/user-logout',authenticateUser,logOut);


export default userRouter;