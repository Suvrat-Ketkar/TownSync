import Complaint from "../models/complaints.models.js";
import Authority from "../models/authority.models.js";
import { User } from "../models/users.models.js";
import jwt, { decode } from "jsonwebtoken";
/*export const acknowledgeComplaint = async (req, res) => {
  try {
    const { complaintId } = req.body;

    if (!complaintId) {
      return res.status(400).json({ success: false, message: "Complaint ID is required" });
    }

    // Verify the authority user
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const authority = await Authority.findOne({ contactEmail: decoded.email });
    if (!authority) {
      return res.status(404).json({ success: false, message: "Authority user not found" });
    }

    // Find the complaint
    const complaintIndex = authority.assignedComplaints.active.indexOf(complaintId);
    if (complaintIndex === -1) {
      return res.status(404).json({ success: false, message: "Complaint not found in active list" });
    }

    // Remove from active and add to resolved
    authority.assignedComplaints.active.splice(complaintIndex, 1);
    authority.assignedComplaints.resolved.push(complaintId);

    await authority.save();

    res.status(200).json({
      success: true,
      message: "Complaint acknowledged and moved to resolved",
    });
  } catch (error) {
    console.error("Error acknowledging complaint:", error);
    res.status(500).json({ success: false, message: "Failed to acknowledge complaint", error: error.message });
  }
};*/
export const acknowledgeComplaint = async (req, res) => {
  try {
    const { complaintId } = req.body;

    if (!complaintId) {
      return res.status(400).json({ success: false, message: "Complaint ID is required" });
    }

    // Verify the authority user
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const authority = await Authority.findOne({ contactEmail: decoded.email });
    if (!authority) {
      return res.status(404).json({ success: false, message: "Authority user not found" });
    }

    // Find the complaint in active list
    const complaintIndex = authority.assignedComplaints.active.indexOf(complaintId);
    if (complaintIndex === -1) {
      return res.status(404).json({ success: false, message: "Complaint not found in active list" });
    }

    // Update the complaint status to "Resolved"
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    complaint.Status = "Resolved"; // Update status
    await complaint.save(); // Save updated complaint status

    // Remove from active and add to resolved in authority model
    authority.assignedComplaints.active.splice(complaintIndex, 1);
    authority.assignedComplaints.resolved.push(complaintId);
    await authority.save(); // Save updated authority details

    res.status(200).json({
      success: true,
      message: "Complaint acknowledged, moved to resolved, and status updated.",
    });
  } catch (error) {
    console.error("Error acknowledging complaint:", error);
    res.status(500).json({ success: false, message: "Failed to acknowledge complaint", error: error.message });
  }
};

export const getauthStatistics = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    if (!decoded.email) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    console.log(`Decoded email: ${decoded.email}`);

    const authority = await Authority.findOne({ contactEmail: decoded.email });
    if (!authority) {
      return res.status(404).json({ success: false, message: "Authority user not found" });
    }

    // Extract assigned complaints data
    const { assignedComplaints } = authority;
    const activeComplaints = assignedComplaints?.active?.length || 0;
    const resolvedComplaints = assignedComplaints?.resolved?.length || 0;
    const inProgressComplaints = assignedComplaints?.inProgress?.length || 0; // Add if applicable
    const rejectedComplaints = assignedComplaints?.rejected?.length || 0; // If rejection tracking is added

    // Calculate statistics
    const totalComplaints = activeComplaints + resolvedComplaints + inProgressComplaints + rejectedComplaints;
    
    // Return statistics in response
    res.status(200).json({
      success: true,
      message: "Statistics retrieved successfully",
      data: {
        totalComplaints,
        pendingComplaints: activeComplaints,
        inProgressComplaints, 
        resolvedComplaints,
        rejectedComplaints,
      }
    });

  } catch (error) {
    console.error("Error fetching authority statistics:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error, please try again later", 
      error: error.message 
    });
  }
};
export const getauthDashboard = async (req, res) => {
  try {
    // Extract and verify the token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    if (!decoded.email) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    console.log(`Decoded email: ${decoded.email}`);

    // Find the authority user based on the email
    const authority = await Authority.findOne({ contactEmail: decoded.email });
    if (!authority) {
      return res.status(404).json({ success: false, message: "Authority user not found" });
    }

    // Extract assigned complaints (only storing IDs)
    const activeComplaintIds = authority.assignedComplaints?.active || [];
    const resolvedComplaintIds = authority.assignedComplaints?.resolved || [];

    // Fetch full details of complaints using IDs and populate user details
    const activeComplaints = await Complaint.find({ _id: { $in: activeComplaintIds } })
      .populate("user", "email fullName current_address"); 

    const resolvedComplaints = await Complaint.find({ _id: { $in: resolvedComplaintIds } })
      .populate("user", "email fullName current_address"); 

    // Prepare response
    res.status(200).json({
      success: true,
      message: "Authority dashboard statistics retrieved successfully",
      data: {
        active: {
          count: activeComplaints.length,
          complaints: activeComplaints,
        },
        resolved: {
          count: resolvedComplaints.length,
          complaints: resolvedComplaints,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching authority dashboard statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve statistics",
      error: error.message,
    });
  }
};

/*export const getauthDashboard = async (req, res) => {
  try {
    // Extract and verify the token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    if (!decoded.email) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    console.log(`Decoded email: ${decoded.email}`);

    // Find the authority user based on the email
    const authority = await Authority.findOne({ contactEmail: decoded.email });
    if (!authority) {
      return res.status(404).json({ success: false, message: "Authority user not found" });
    }

    // Extract assigned complaints data
    const { assignedComplaints } = authority;
    const activeComplaints = assignedComplaints?.active?.length || 0;
    const resolvedComplaints = assignedComplaints?.resolved?.length || 0;

    // Prepare response data
    const statistics = {
      active: activeComplaints,
      resolved: resolvedComplaints,
    };

    // Send response
    res.status(200).json({
      success: true,
      message: "Authority dashboard statistics retrieved successfully",
      data: statistics,
    });
  } catch (error) {
    console.error("Error fetching authority dashboard statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve statistics",
      error: error.message,
    });
  }
};*/

export async function authorityProfile(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    if (!decoded.email) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }
    console.log(`Decoded email :${decoded.email}`)
    const authority = await Authority.findOne({ contactEmail: decoded.email }).select("-password");
    console.log(`Authority data :${authority}`)
    if (!authority) {
      return res.status(404).json({ success: false, message: "Authority profile not found" });
    }

    res.status(200).json({ success: true, data: authority });
  } catch (error) {
    console.error("Error fetching authority profile:", error);
    res.status(500).json({ success: false, message: "Server error, please try again later" });
  }
}
