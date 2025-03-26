import Issue from '../models/Issue.js';

// Create a new issue
export const createIssue = async (req, res) => {
  try {
    const { title, description, category, location, images } = req.body;
    const issue = new Issue({
      title,
      description,
      category,
      location,
      images,
      reportedBy: req.user._id // This will come from the auth middleware
    });

    await issue.save();
    res.status(201).json({
      success: true,
      data: issue
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all issues
export const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find().populate('reportedBy', 'name email');
    res.status(200).json({
      success: true,
      data: issues
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get single issue
export const getIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate('reportedBy', 'name email');
    if (!issue) {
      return res.status(404).json({
        success: false,
        error: 'Issue not found'
      });
    }
    res.status(200).json({
      success: true,
      data: issue
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update issue status
export const updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const issue = await Issue.findById(req.params.id);
    
    if (!issue) {
      return res.status(404).json({
        success: false,
        error: 'Issue not found'
      });
    }

    issue.status = status;
    issue.updatedAt = Date.now();
    await issue.save();

    res.status(200).json({
      success: true,
      data: issue
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 