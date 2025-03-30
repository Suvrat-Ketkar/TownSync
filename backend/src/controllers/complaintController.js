import Complaint from "../models/complaints.models.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { updateStatsOnNewComplaint, updateStatsOnStatusChange } from "./statisticsController.js";

export const reportComplaint = async (req, res) => {
  try {
    const { Issue_Type, Issue_Description, address, Custom_Issue_Type, latitude, longitude } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }
    if (!Issue_Type || !Issue_Description) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const imageUrl = await uploadToCloudinary(imageFile);
    if (!imageUrl) {
      return res.status(500).json({ success: false, message: 'Failed to upload image to Cloudinary' });
    }

    let Location = null;
    if (latitude && longitude) {
      Location = { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] };
    }

    const complaint = new Complaint({
      Issue_Type,
      Issue_Description,
      address: address || null,
      Location,  // Stores GeoJSON or remains null if not available
      Image: imageUrl,
      Custom_Issue_Type: Issue_Type === 'Other' ? Custom_Issue_Type || null : null,
      Status: "Pending",
      user: req.user._id
    });

    await complaint.save();
    await updateStatsOnNewComplaint(complaint);

    res.status(201).json({ success: true, message: 'Complaint reported successfully', data: complaint });

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
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status value
    const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    // Find the complaint
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }
    
    // Store the previous status before updating
    const previousStatus = complaint.Status;
    
    // Update the status
    complaint.Status = status;
    await complaint.save();
    
    // Update statistics based on the status change
    await updateStatsOnStatusChange(complaint, previousStatus);
    
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
};

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