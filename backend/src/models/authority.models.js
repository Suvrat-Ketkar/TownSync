import mongoose, { Schema } from "mongoose";

const authoritySchema = new Schema(
  {
    /*user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      //unique: true
    },*/
    role: {
      type: String,
      enum: ["Admin", "Officer", "Supervisor", "Inspector"],
      default: "Officer",
      required: true  
    },
    department: {
      type: String,
      enum: ["Street Lights", "Water Supply", "Electricity Issues", "Sanitation", "Patholes", "Garbage Collection"],
      required: true
    },
    areasResponsible: [
      {
        name: { type: String, trim: true },
        coordinates: {
          type: [Number], // [longitude, latitude]
          index: "2dsphere"
        }
      }
    ],
    address: {
      type: String,
      trim: true
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    assignedComplaints: {
      active: [{ type: Schema.Types.ObjectId, ref: "Complaint" }],
      resolved: [{ type: Schema.Types.ObjectId, ref: "Complaint" }]
    }
  },
  { timestamps: true }
);

const Authority = mongoose.model("Authority", authoritySchema);
export default Authority;
