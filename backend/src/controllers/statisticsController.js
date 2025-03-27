import Statistics from "../models/statistics.models.js";
import Complaint from "../models/complaints.models.js";

/**
 * Updates statistics when a new complaint is added
 * @param {Object} complaint - The newly created complaint object
 */
export const updateStatsOnNewComplaint = async (complaint) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's statistics or create if not exists
    let stats = await Statistics.findOne({ 
      date: { 
        $gte: today, 
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) 
      } 
    });

    if (!stats) {
      stats = new Statistics({ date: today });
    }

    // Increment total complaints
    stats.totalComplaints += 1;
    
    // Increment pending complaints
    stats.pendingComplaints += 1;
    
    // Update issue type distribution
    const issueType = complaint.Issue_Type;
    switch (issueType) {
      case 'Potholes':
        stats.issueTypeDistribution.Potholes += 1;
        break;
      case 'Street Lights':
        stats.issueTypeDistribution.StreetLights += 1;
        break;
      case 'Garbage Collection':
        stats.issueTypeDistribution.GarbageCollection += 1;
        break;
      case 'Water Supply':
        stats.issueTypeDistribution.WaterSupply += 1;
        break;
      case 'Electricity Issues':
        stats.issueTypeDistribution.ElectricityIssues += 1;
        break;
      default:
        stats.issueTypeDistribution.Other += 1;
    }

    // Update area distribution if address is available
    if (complaint.address) {
      // Extract area from address (this is a simple approach - you may need more complex parsing)
      const area = complaint.address.split(',').pop().trim();
      
      // Update the area count in the map
      const areaCount = stats.areaWiseDistribution.get(area) || 0;
      stats.areaWiseDistribution.set(area, areaCount + 1);
    }

    await stats.save();
    console.log('Statistics updated successfully for new complaint');
  } catch (error) {
    console.error('Error updating statistics for new complaint:', error);
  }
};

/**
 * Updates statistics when a complaint status is updated
 * @param {Object} complaint - The updated complaint object
 * @param {String} previousStatus - The previous status of the complaint
 */
export const updateStatsOnStatusChange = async (complaint, previousStatus) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's statistics or create if not exists
    let stats = await Statistics.findOne({ 
      date: { 
        $gte: today, 
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) 
      } 
    });

    if (!stats) {
      stats = new Statistics({ date: today });
    }

    // Update counts based on status change
    if (previousStatus === 'Pending') {
      stats.pendingComplaints -= 1;
    } else if (previousStatus === 'In Progress') {
      stats.inProgressComplaints -= 1;
    } else if (previousStatus === 'Resolved') {
      stats.resolvedComplaints -= 1;
    } else if (previousStatus === 'Rejected') {
      stats.rejectedComplaints -= 1;
    }

    // Update counts for new status
    const newStatus = complaint.Status;
    if (newStatus === 'Pending') {
      stats.pendingComplaints += 1;
    } else if (newStatus === 'In Progress') {
      stats.inProgressComplaints += 1;
    } else if (newStatus === 'Resolved') {
      stats.resolvedComplaints += 1;
      
      // Calculate resolution time if the complaint is being resolved
      if (complaint.createdAt) {
        const creationTime = new Date(complaint.createdAt).getTime();
        const resolutionTime = Date.now();
        const resolutionHours = (resolutionTime - creationTime) / (1000 * 60 * 60);
        
        // Update average resolution time
        const totalResolved = stats.resolvedComplaints;
        const currentAvg = stats.averageResolutionTime;
        
        // Weighted average calculation
        if (totalResolved === 1) {
          stats.averageResolutionTime = resolutionHours;
        } else {
          stats.averageResolutionTime = 
            ((currentAvg * (totalResolved - 1)) + resolutionHours) / totalResolved;
        }
      }
    } else if (newStatus === 'Rejected') {
      stats.rejectedComplaints += 1;
    }

    await stats.save();
    console.log('Statistics updated successfully for status change');
  } catch (error) {
    console.error('Error updating statistics for status change:', error);
  }
};

/**
 * Updates user statistics when a new user registers
 */
export const updateStatsOnNewUser = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's statistics or create if not exists
    let stats = await Statistics.findOne({ 
      date: { 
        $gte: today, 
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) 
      } 
    });

    if (!stats) {
      stats = new Statistics({ date: today });
    }

    // Increment user growth and total users
    stats.userGrowth += 1;
    stats.totalUsers += 1;

    await stats.save();
    console.log('User statistics updated successfully');
  } catch (error) {
    console.error('Error updating user statistics:', error);
  }
};

/**
 * Gets statistics for a specific date range
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const getStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      query.date = { $gte: start, $lte: end };
    } else {
      // Default to last 30 days if no date range provided
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      start.setHours(0, 0, 0, 0);
      
      query.date = { $gte: start, $lte: end };
    }

    const statistics = await Statistics.find(query).sort({ date: 1 });

    res.status(200).json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: statistics
    });
  } catch (error) {
    console.error('Error retrieving statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics',
      error: error.message
    });
  }
};

/**
 * Generates a daily statistics summary
 */
export const generateDailyStatistics = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if statistics already exist for today
    const existingStats = await Statistics.findOne({ 
      date: { 
        $gte: today, 
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) 
      } 
    });
    
    if (existingStats) {
      console.log('Daily statistics already generated for today');
      return;
    }
    
    // Count complaints by status
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ Status: 'Pending' });
    const inProgressComplaints = await Complaint.countDocuments({ Status: 'In Progress' });
    const resolvedComplaints = await Complaint.countDocuments({ Status: 'Resolved' });
    const rejectedComplaints = await Complaint.countDocuments({ Status: 'Rejected' });
    
    // Count complaints by issue type
    const potholesComplaints = await Complaint.countDocuments({ Issue_Type: 'Potholes' });
    const streetLightsComplaints = await Complaint.countDocuments({ Issue_Type: 'Street Lights' });
    const garbageComplaints = await Complaint.countDocuments({ Issue_Type: 'Garbage Collection' });
    const waterComplaints = await Complaint.countDocuments({ Issue_Type: 'Water Supply' });
    const electricityComplaints = await Complaint.countDocuments({ Issue_Type: 'Electricity Issues' });
    const otherComplaints = await Complaint.countDocuments({ Issue_Type: 'Other' });
    
    // Calculate average resolution time for resolved complaints
    let averageResolutionTime = 0;
    if (resolvedComplaints > 0) {
      const resolvedComplaintsList = await Complaint.find({ Status: 'Resolved' });
      let totalResolutionTime = 0;
      
      resolvedComplaintsList.forEach(complaint => {
        const creationTime = new Date(complaint.createdAt).getTime();
        const updateTime = new Date(complaint.updatedAt).getTime();
        const resolutionHours = (updateTime - creationTime) / (1000 * 60 * 60);
        totalResolutionTime += resolutionHours;
      });
      
      averageResolutionTime = totalResolutionTime / resolvedComplaints;
    }
    
    // Area-wise distribution
    const areaDistribution = new Map();
    const complaints = await Complaint.find({}, 'address');
    
    complaints.forEach(complaint => {
      if (complaint.address) {
        const area = complaint.address.split(',').pop().trim();
        const count = areaDistribution.get(area) || 0;
        areaDistribution.set(area, count + 1);
      }
    });
    
    // Create new statistics record
    const statistics = new Statistics({
      date: today,
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      rejectedComplaints,
      issueTypeDistribution: {
        Potholes: potholesComplaints,
        StreetLights: streetLightsComplaints,
        GarbageCollection: garbageComplaints,
        WaterSupply: waterComplaints,
        ElectricityIssues: electricityComplaints,
        Other: otherComplaints
      },
      averageResolutionTime,
      areaWiseDistribution: areaDistribution
    });
    
    await statistics.save();
    console.log('Daily statistics generated successfully');
  } catch (error) {
    console.error('Error generating daily statistics:', error);
  }
}; 