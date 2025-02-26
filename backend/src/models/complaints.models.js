import mongoose, { Schema } from "mongoose";
import AutoIncrement from "mongoose-sequence";

const complaintSchema = new Schema(
  {
    complaintId: {
      type: Number,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Foreign key reference to the User model
      required: true,
    },
    issueType: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Potholes",
        "Street Lights",
        "Garbage Collection",
        "Water Supply",
        "Electricity Issues",
        "Other",
      ], // Match dropdown options
    },
    customIssueType: {
      type: String,
      trim: true,
      default: null, // Optional field for custom issue type
    },
    issueDescription: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    coordinates: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
      enum: ["open", "in-progress", "closed"],
      default: "open",
    },
    closedAt: {
      type: Date,
      default: null, // Set when status is changed to "closed"
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
  }
);

// Auto-increment complaintId starting from 1000
complaintSchema.plugin(AutoIncrement(mongoose), {
  inc_field: "complaintId",
  start_seq: 1000,
});

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
