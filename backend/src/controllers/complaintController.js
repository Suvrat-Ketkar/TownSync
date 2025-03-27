import Complaint from "../models/complaints.models.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const reportComplaint = async (req, res) => {
  try {
    const { Issue_Type, Issue_Description, address, Custom_Issue_Type } = req.body;
    const imageFile = req.file;
    // console.log("User data from middleware:", req.user); 

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: 'Image is required'
      });
    }
    if (!Issue_Type || !Issue_Description || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    const imageUrl = await uploadToCloudinary(imageFile);
    if (!imageUrl) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload image to Cloudinary'
      });
    }
    const Location = req.body.Location
      ? JSON.parse(req.body.Location)
      : { type: "Point", coordinates: [0, 0] }; 

    const complaint = new Complaint({
      Issue_Type,
      Issue_Description,
      address,
      Location, 
      Image: imageUrl, 
      Custom_Issue_Type: Issue_Type === 'Other' ? Custom_Issue_Type || null : null,
      Status: "Pending", 
      user: req.user._id 
    });

    await complaint.save();

    res.status(201).json({
      success: true,
      message: 'Complaint reported successfully',
      data: complaint
    });

  } catch (error) {
    console.error('Error reporting complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to report complaint',
      error: error.message
    });
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