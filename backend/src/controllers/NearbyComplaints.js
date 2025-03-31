import Complaint from "../models/complaints.models.js";
import { User } from "../models/users.models.js";

export const NearbyComplaints = async (req, res) => {
  try {
    console.log("User from auth middleware:", req.user);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user || !user.coordinates || !user.coordinates.coordinates) {
      // Default to a fallback location if user location is missing
      console.log(`🔹 User Location: [undefined, undefined]`);
      
      // Get all complaints instead of doing geospatial search
      const complaints = await Complaint.find({ Status: "Pending" })
        .sort({ createdAt: -1 })
        .limit(10);
      
      if (complaints.length === 0) {
        return res.status(404).json({ success: false, message: "No complaints found" });
      }
      
      return res.status(200).json({ success: true, complaints });
    }

    const lng = user.coordinates.coordinates[0];
    const lat = user.coordinates.coordinates[1];

    console.log(`🔹 User Location: [${lng}, ${lat}]`);

    // ✅ Ensure that the "Location" field is indexed as a 2dsphere index
    await Complaint.collection.createIndex({ Location: "2dsphere" });

    // Fixed query structure for $geoNear
    const complaints = await Complaint.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distance",
          maxDistance: 30000,
          spherical: true,
          query: { Status: "Pending" }
        }
      },
      { $sort: { distance: 1 } }, // Sort by nearest complaints
      { $limit: 10 } // Limit the number of results
    ]);

    console.log(`🔹 Complaints Found: ${complaints.length}`);
    
    if (complaints.length > 0) {
      complaints.forEach((c, index) => {
        console.log(`🔹 Complaint #${index + 1} Distance: ${Math.round(c.distance)}m`);
      });
    }

    if (complaints.length === 0) {
      // Fallback to regular query if no nearby complaints found
      const fallbackComplaints = await Complaint.find({ Status: "Pending" })
        .sort({ createdAt: -1 })
        .limit(10);
        
      if (fallbackComplaints.length === 0) {
        return res.status(404).json({ success: false, message: "No complaints found" });
      }
      
      return res.status(200).json({ success: true, complaints: fallbackComplaints });
    }

    res.status(200).json({ success: true, complaints });
  } catch (error) {
    console.error("🚨 Error fetching nearby complaints:", error);
    
    // Fallback in case of geospatial query error
    try {
      const fallbackComplaints = await Complaint.find({ Status: "Pending" })
        .sort({ createdAt: -1 })
        .limit(10);
      
      if (fallbackComplaints.length > 0) {
        return res.status(200).json({ 
          success: true, 
          complaints: fallbackComplaints,
          note: "Showing recent complaints due to geospatial query error"
        });
      } else {
        return res.status(404).json({ success: false, message: "No complaints found" });
      }
    } catch (fallbackError) {
      return res.status(500).json({ 
        success: false, 
        message: "Failed to retrieve complaints", 
        errors: [error.message, fallbackError.message] 
      });
    }
  }
};


