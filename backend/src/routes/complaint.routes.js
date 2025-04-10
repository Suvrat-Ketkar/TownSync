import { Router } from "express";
import {reportComplaint, DisplayComplaintsByUser, complaintDetailPage, updateComplaintStatus, getAllComplaints} from '../controllers/complaintController.js';
import {authenticateUser} from "../middleware/auth.js";
import { upload } from "../middleware/multer.middleware.js";
import { getStatistics, generateDailyStatistics } from "../controllers/statisticsController.js";
import { NearbyComplaints } from '../controllers/NearbyComplaints.js'

const complaintRouter = Router();
// Public endpoint for statistics (no authentication required)
complaintRouter.get("/statistics", getStatistics);
// Apply authentication middleware to all other routes
complaintRouter.use(authenticateUser);

// Report a new issue
complaintRouter.post(
  "/report",
  upload.array("images", 5),  // Accept up to 5 images in the 'images' field
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

// Generate daily statistics report (could be triggered by cron job)
complaintRouter.post("/statistics/generate", generateDailyStatistics);

// // Upvote a complaint
// complaintRouter.post("/upvote/:complaintId", upvoteComplaint);
complaintRouter.get("/nearby-complaints", NearbyComplaints);

export default complaintRouter; 