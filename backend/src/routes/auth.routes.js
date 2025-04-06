import express from "express";
import { refreshAccessToken } from "../controllers/auth_ctrl.js";

const authRouter = express.Router();

authRouter.get("/refresh-token", refreshAccessToken);

export default authRouter;