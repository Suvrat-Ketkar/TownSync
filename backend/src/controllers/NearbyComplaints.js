import Complaint from '../models/complaints.models.js';
import { User } from '../models/users.modes.js'; // Assuming you have a User model

export const NearbyComplaints = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const userId = req.user._id; // Extract user ID from request

    // Fetch user's home location from the database
    const user = await User.findById(userId);
    if (!user || !user.coordinates) {
      return res.status(400).json({ message: "Home location not found" });
    }

    const userLocation = user.coordinates.coordinates; // [longitude, latitude]

    // Find complaints within 2km (2000 meters) of the user's home
    const complaints = await Complaint.find({
      location: {
        $near: {
          $geometry: { type: "Point", Location: userLocation },
          $maxDistance: 2000 // 2km in meters
        }
      }
    });
    console.log(complaints)
    res.status(200).json({ complaints });
  } catch (error) {
    console.error("Error fetching nearby complaints:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
