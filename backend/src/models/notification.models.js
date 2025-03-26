import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    complaint: {
      type: Schema.Types.ObjectId,
      ref: "Complaint"
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["Status Update", "Authority Response", "System", "Assignment", "Resolution"],
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    link: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Create index for fast user-based queries
notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification; 