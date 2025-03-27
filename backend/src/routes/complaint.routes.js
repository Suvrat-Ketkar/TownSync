import { Router } from "express";
// import { 
//   reportIssue,
//   getUserComplaints,
//   getComplaintDetails,
//   upvoteComplaint
// } from "../controllers/reportIssue_ctrl.js";

import {reportComplaint, DisplayComplaintsByUser, complaintDetailPage, updateComplaintStatus, getAllComplaints} from '../controllers/complaintController.js';
import {authenticateUser} from "../middleware/auth.js";
import { upload } from "../middleware/multer.middleware.js";
import { getStatistics, generateDailyStatistics } from "../controllers/statisticsController.js";

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

// Update complaint status
complaintRouter.patch("/status/:id", updateComplaintStatus);

// Get all complaints (with optional filters)
complaintRouter.get("/all", getAllComplaints);

// Get statistics (with optional date range)
complaintRouter.get("/statistics", getStatistics);

// Generate daily statistics report (could be triggered by cron job)
complaintRouter.post("/statistics/generate", generateDailyStatistics);

// // Upvote a complaint
// complaintRouter.post("/upvote/:complaintId", upvoteComplaint);

export default complaintRouter; 