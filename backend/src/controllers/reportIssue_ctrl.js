import Complaint from "../models/complaints.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const reportIssue = asyncHandler(async (req, res) => {
  // Extract data from request body
  const { 
    Issue_Type, 
    Issue_Description, 
    address, 
    Custom_Issue_Type 
  } = req.body;

  const locationCoordinates = req.body.coordinates || [0, 0]; // Default coordinates if not provided
  
  // Validate required fields
  if (!Issue_Type || !Issue_Description || !address) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // Check if image is uploaded
  if (!req.file) {
    throw new ApiError(400, "Image is required for reporting an issue");
  }

  // If issue type is "Other", custom issue type is required
  if (Issue_Type === "Other" && !Custom_Issue_Type) {
    throw new ApiError(400, "Custom issue type is required when selecting 'Other'");
  }

  try {
    // Upload image to Cloudinary
    const imageResponse = await uploadOnCloudinary(req.file.path);
    
    if (!imageResponse) {
      throw new ApiError(500, "Failed to upload image");
    }

    // Create a new complaint
    const newComplaint = await Complaint.create({
      user: req.user._id,
      Issue_Type,
      Issue_Description,
      Location: {
        type: "Point",
        coordinates: locationCoordinates
      },
      address,
      Image: imageResponse.secure_url,
      Custom_Issue_Type: Issue_Type === "Other" ? Custom_Issue_Type : null,
      Status: "Pending"
    });

    return res.status(201).json(
      new ApiResponse(201, newComplaint, "Issue reported successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Error while reporting issue", error);
  }
});

// Controller for getting all complaints for a user
const getUserComplaints = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  const complaints = await Complaint.find({ user: userId })
    .sort({ createdAt: -1 });
  
  return res.status(200).json(
    new ApiResponse(200, complaints, "User complaints fetched successfully")
  );
});

// Controller for getting details of a specific complaint
const getComplaintDetails = asyncHandler(async (req, res) => {
  const { complaintId } = req.params;
  
  const complaint = await Complaint.findOne({ complaint_ID: complaintId });
  
  if (!complaint) {
    throw new ApiError(404, "Complaint not found");
  }
  
  return res.status(200).json(
    new ApiResponse(200, complaint, "Complaint details fetched successfully")
  );
});

// Controller for upvoting a complaint
const upvoteComplaint = asyncHandler(async (req, res) => {
  const { complaintId } = req.params;
  const userId = req.user._id;
  
  const complaint = await Complaint.findOne({ complaint_ID: complaintId });
  
  if (!complaint) {
    throw new ApiError(404, "Complaint not found");
  }
  
  // Check if user already upvoted
  if (complaint.upvotedBy.includes(userId)) {
    throw new ApiError(400, "You have already upvoted this complaint");
  }
  
  // Update complaint with new upvote
  const updatedComplaint = await Complaint.findOneAndUpdate(
    { complaint_ID: complaintId },
    { 
      $inc: { upvotes: 1 },
      $push: { upvotedBy: userId }
    },
    { new: true }
  );
  
  return res.status(200).json(
    new ApiResponse(200, updatedComplaint, "Complaint upvoted successfully")
  );
});

export { 
  reportIssue, 
  getUserComplaints, 
  getComplaintDetails, 
  upvoteComplaint 
};
