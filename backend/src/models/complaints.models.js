import mongoose, { Schema } from "mongoose";
import AutoIncrement from "mongoose-sequence";

const complaintSchema = new Schema(
  {
    complaint_ID: {
      type: Number, 
      required: true,
      unique: true,
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
      type: String,
      required: true,
      trim: true,
    },
    Status: {
      type: String,
      required: true,
      trim: true,
      enum: ["Approved", "Pending", "Rejected"], 
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
  },
  {
    timestamps: true
  }
);

complaintSchema.plugin(AutoIncrement, { 
  inc_field: "complaint_ID", 
  start_seq: 1000, 
});

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;