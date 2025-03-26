import mongoose, { Schema } from "mongoose";

const updateSchema = new Schema(
  {
    complaint: {
      type: Schema.Types.ObjectId,
      ref: "Complaint",
      required: true
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    updateType: {
      type: String,
      enum: ["Status Change", "Comment", "Assignment", "Resolution"],
      required: true
    },
    previousStatus: {
      type: String,
      enum: ["Approved", "Pending", "Rejected", "In Progress", "Resolved"]
    },
    newStatus: {
      type: String,
      enum: ["Approved", "Pending", "Rejected", "In Progress", "Resolved"]
    },
    comment: {
      type: String,
      trim: true
    },
    attachments: [{
      type: String,
      trim: true
    }],
    isPublic: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Update = mongoose.model("Update", updateSchema);

export default Update; 