import { Router } from "express";
// import { 
//   reportIssue,
//   getUserComplaints,
//   getComplaintDetails,
//   upvoteComplaint
// } from "../controllers/reportIssue_ctrl.js";

import {reportComplaint, DisplayComplaintsByUser, complaintDetailPage} from '../controllers/complaintController.js';
import {authenticateUser} from "../middleware/auth.js";
import { upload } from "../middleware/multer.middleware.js";

const complaintRouter = Router();

// Apply authentication middleware to all routes
complaintRouter.use(authenticateUser);

// Report a new issue
complaintRouter.post(
  "/report",
  upload.single("image"),  // 'image' should match the field name in the frontend form
  reportComplaint
);

// Get all complaints for the logged-in user
complaintRouter.get("/user", DisplayComplaintsByUser);

// Get details of a specific complaint
complaintRouter.get("/details/:id", complaintDetailPage);

// // Upvote a complaint
// complaintRouter.post("/upvote/:complaintId", upvoteComplaint);

export default complaintRouter; 