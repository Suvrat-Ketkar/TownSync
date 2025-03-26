import mongoose, { Schema } from "mongoose";

const authoritySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    department: {
      type: String,
      enum: ["Municipal", "Water", "Electricity", "Sanitation", "Roads", "General"],
      required: true
    },
    // designation: {
    //   type: String,
    //   required: true,
    //   trim: true
    // },
    areasResponsible: [{
      type: String,
      trim: true
    }],
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    assignedComplaints: [{
      type: Schema.Types.ObjectId,
      ref: "Complaint"
    }]
  },
  {
    timestamps: true
  }
);

const Authority = mongoose.model("Authority", authoritySchema);

export default Authority; 