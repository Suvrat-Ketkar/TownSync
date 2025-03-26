import { Schema } from "mongoose";
import mongoose from 'mongoose';
import _AutoIncrement from 'mongoose-sequence';

const AutoIncrement = _AutoIncrement(mongoose);



const complaintSchema = new Schema(
  {
    complaint_ID: {
      type: Number, 
      // required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    Issue_Type: {
        type: String,
        required: true,
        trim: true,
        enum: ["Potholes", "Street Lights", "Garbage Collection", "Water Supply", "Electricity Issues", "Other"], // Match the dropdown options
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
      coordinates : [Number]
    },
    address: {
      type: String,
      required: true,
      trim: true
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
      required: true,
      trim: true,
    },
    Date_of_report: {
      type: Date,
      required: true,
      default: Date.now, 
    },
    // if others is selected 
    Custom_Issue_Type: {
        type: String,
        trim: true,
        default: null, // Optional field
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