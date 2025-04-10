import { Schema } from "mongoose";
import mongoose from 'mongoose';
import _AutoIncrement from 'mongoose-sequence';
const AutoIncrement = _AutoIncrement(mongoose);
const complaintSchema = new Schema(
  {
    complaint_ID: {
      type: Number, 
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    assignedAuthority: {
      type: Schema.Types.ObjectId,
      ref: "Authority", 
      default: null
    },
    Issue_Type: {
      type: String,
      required: true,
      trim: true,
      enum: ["Potholes", "Street Lights", "Garbage Collection", "Water Supply", "Electricity Issues", "Other"],
    },
    Issue_Description: {
      type: String,
      required: true,
      trim: true,
    },
    Location: {
      type: {
        type: String,
        default: 'Point',
        required: true
      },
      coordinates: [Number]
    },
    address: {
      type: String,
      trim: true,
      default: null, // Making it optional
    },
    Status: {
      type: String,
      required: true,
      trim: true,
      enum: ["Pending", "Rejected", "In Progress", "Resolved"],
      default: "Pending",
    },
    Image: {
      type: String,
      required: false, // Changed from required to optional since we'll use Images
      trim: true,
    },
    Images: {
      type: [String], // Array of image URLs
      default: [],
    },
    Date_of_report: {
      type: Date,
      required: true,
      default: Date.now, 
    },
    Custom_Issue_Type: {
      type: String,
      trim: true,
      default: null,
    },
    upvotes: {
      type: Number,
      default: 0
    },
    upvotedBy: [{
      type: Schema.Types.ObjectId,
      ref: "User"
    }]
  },
  {
    timestamps: true
  }
);

// Add 2dsphere index for geospatial queries
complaintSchema.index({ Location: "2dsphere" });

complaintSchema.plugin(AutoIncrement, { 
  inc_field: "complaint_ID", 
  start_seq: 1000, 
});

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;