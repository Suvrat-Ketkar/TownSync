import Complaint from "../models/complaints.models.js";
import Authority from "../models/authority.models.js"; // Import the authority model
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { updateStatsOnNewComplaint } from "./statisticsController.js";

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

    // Fix: Use decoded.email instead of undefined userEmail
    const authority = await Authority.findOne({ contactEmail: decoded.email });
    if (!authority) {
      return res.status(404).json({ success: false, message: "Authority user not found" });
    }

    // Extract assigned complaints data
    const { assignedComplaints } = authority;
    const activeComplaints = assignedComplaints?.active?.length || 0;
    const resolvedComplaints = assignedComplaints?.resolved?.length || 0;

    // Calculate statistics
    const totalComplaints = activeComplaints + resolvedComplaints;
    const pendingComplaints = activeComplaints;
    const rejectedComplaints = 0; // Since rejected field is not present

    // Return statistics in response
    res.status(200).json({
      success: true,
      message: "Statistics retrieved successfully",
      data: {
        totalComplaints,
        pendingComplaints,
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
export const reportComplaint = async (req, res) => {
  try {
    const { Issue_Type, Issue_Description, address, Custom_Issue_Type, latitude, longitude } = req.body;
    const imageFiles = req.files;

    if (!imageFiles || imageFiles.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one image is required' });
    }
    if (!Issue_Type || !Issue_Description) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Upload all images to Cloudinary
    const imageUrls = [];
    for (const file of imageFiles) {
      const imageUrl = await uploadToCloudinary(file);
      if (imageUrl) {
        imageUrls.push(imageUrl);
      }
    }

    if (imageUrls.length === 0) {
      return res.status(500).json({ success: false, message: 'Failed to upload images to Cloudinary' });
    }

    let Location = null;
    if (latitude && longitude) {
      Location = { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] };
    }
    const assignedAuthority = await Authority.findOne({ department: Issue_Type })
    console.log(`Assigned Authority :${assignedAuthority}`)
    if (!assignedAuthority) {
      return res.status(500).json({ success: false, message: 'No authority available for this issue' });
    }

    const complaint = new Complaint({
      Issue_Type,
      Issue_Description,
      address: address || null,
      Location,
      Image: imageUrls[0],
      Images: imageUrls,
      Custom_Issue_Type: Issue_Type === 'Other' ? Custom_Issue_Type || null : null,
      Status: "Pending",
      user: req.user._id,
      assignedAuthority: assignedAuthority._id // Assign the authority
    });

    await complaint.save();

    // **Update the assigned authority's record**
    assignedAuthority.assignedComplaints.active.push(complaint._id);
    await assignedAuthority.save();

    // Update statistics
    await updateStatsOnNewComplaint(complaint);

    res.status(201).json({
      success: true,
      message: 'Complaint reported and assigned successfully',
      data: complaint
    });

  } catch (error) {
    console.error('Error reporting complaint:', error);
    res.status(500).json({ success: false, message: 'Failed to report complaint', error: error.message });
  }
};

export const DisplayComplaintsByUser = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id });
    res.status(200).json({
      success: true,
      message: 'Complaints retrieved successfully',
      data: complaints
    });
    } catch (error) {
    console.error('Error displaying complaints:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve complaints',
      error: error.message
    });
  }
}

export const complaintDetailPage = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Complaint retrieved successfully',
      data: complaint
    });
  } catch (error) {
    console.error('Error retrieving complaint detail:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve complaint detail',
      error: error.message
    });
  }
}

export const updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminComment } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }
    
    // Update status
    const previousStatus = complaint.Status;
    complaint.Status = status;
    
    // Add admin comment if provided
    if (adminComment) {
      complaint.Admin_Comment = adminComment;
    }
    
    await complaint.save();
    
    // Update statistics if status changed
    if (previousStatus !== status) {
      await updateStatsOnStatusChange(complaint, previousStatus);
    }
    
    res.status(200).json({
      success: true,
      message: 'Complaint status updated successfully',
      data: complaint
    });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update complaint status',
      error: error.message
    });
  }
}

export const getAllComplaints = async (req, res) => {
  try {
    const { status, issueType, sortBy } = req.query;
    let query = {};
    
    // Filter by status if provided
    if (status) {
      query.Status = status;
    }
    
    // Filter by issue type if provided
    if (issueType) {
      query.Issue_Type = issueType;
    }
    
    // Determine sort order
    let sortOptions = {};
    if (sortBy === 'latest') {
      sortOptions = { createdAt: -1 };
    } else if (sortBy === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else {
      // Default sort by latest
      sortOptions = { createdAt: -1 };
    }
    
    const complaints = await Complaint.find(query)
      .sort(sortOptions)
      .populate('user', 'name email'); // Populate user data if needed
    
    res.status(200).json({
      success: true,
      message: 'Complaints retrieved successfully',
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    console.error('Error retrieving complaints:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve complaints',
      error: error.message
    });
  }
};