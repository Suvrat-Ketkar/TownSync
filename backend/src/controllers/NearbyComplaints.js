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
      return res.status(400).json({ success: false, message: "User location not found" });
    }

    const lng = user.coordinates.coordinates[0];
    const lat = user.coordinates.coordinates[1];

    console.log(`🔹 User Location: [${lng}, ${lat}]`);

    // ✅ Ensure that the "Location" field is indexed as a 2dsphere index
    await Complaint.collection.createIndex({ Location: "2dsphere" });

    const complaints = await Complaint.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distance",
          maxDistance: 30000, // Increase range to check
          spherical: true,
        },
      },
      { $match: { Status: "Pending" } },
      { $sort: { distance: 1 } }, // Sort by nearest complaints
      { $limit: 10 }, // Limit the number of results
    ]);

    console.log(`🔹 Complaints Found: ${complaints.length}`);
    complaints.forEach((c, index) => {
      console.log(`🔹 Complaint #${index + 1} Location: [${c.Location.coordinates[0]}, ${c.Location.coordinates[1]}]`);
    });

    if (complaints.length === 0) {
      return res.status(404).json({ success: false, message: "No complaints found nearby" });
    }

    res.status(200).json({ success: true, complaints });
  } catch (error) {
    console.error("🚨 Error fetching nearby complaints:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", errors: [error.message] });
  }
};


