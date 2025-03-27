import { Schema, model } from "mongoose";

const statisticsSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true
    },
    totalComplaints: {
      type: Number,
      default: 0
    },
    pendingComplaints: {
      type: Number,
      default: 0
    },
    inProgressComplaints: {
      type: Number,
      default: 0
    },
    resolvedComplaints: {
      type: Number,
      default: 0
    },
    rejectedComplaints: {
      type: Number,
      default: 0
    },
    issueTypeDistribution: {
      Potholes: { type: Number, default: 0 },
      StreetLights: { type: Number, default: 0 },
      GarbageCollection: { type: Number, default: 0 },
      WaterSupply: { type: Number, default: 0 },
      ElectricityIssues: { type: Number, default: 0 },
      Other: { type: Number, default: 0 }
    },
    averageResolutionTime: {
      type: Number, // in hours
      default: 0
    },
    areaWiseDistribution: {
      type: Map,
      of: Number,
      default: () => new Map()
    },
    totalUsers: {
      type: Number,
      default: 0
    },
    userGrowth: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Statistics = model("Statistics", statisticsSchema);

export default Statistics; 