import { Router } from "express";
import { authorityProfile } from "../controllers/authorityController.js";
import { getauthStatistics } from "../controllers/authorityController.js";
import { getauthDashboard } from "../controllers/authorityController.js";
import { acknowledgeComplaint } from "../controllers/authorityController.js";
const authorityRouter =  Router();
authorityRouter.get('/profile',authorityProfile);
authorityRouter.get('/authDashboard',getauthDashboard);
authorityRouter.get('/authStatistics',getauthStatistics);
authorityRouter.post('/acknowledgeComplaint',acknowledgeComplaint)
export default authorityRouter;