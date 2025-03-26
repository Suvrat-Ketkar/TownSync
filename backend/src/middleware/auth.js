import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  try {
    // Get token from cookies or headers
    const authHeader = req.header("Authorization");
    console.log("Auth header:", authHeader); // Debug the auth header
    
    let token;
    
    // Check if token is in cookies
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } 
    // Check if token is in Authorization header
    else if (authHeader) {
      // If the token already has "Bearer " prefix, remove it once
      token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
    }
    
    console.log("Token after extraction:", token); // Debug the extracted token
    console.log("Token type:", typeof token); // Debug token type
    console.log("Token length:", token ? token.length : 0); // Debug token length

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized request - token missing"
      });
    }

    try {
      // Verify token
      console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET); // Check if secret exists
      console.log("JWT_SECRET:", process.env.JWT_SECRET); // Check actual secret (be careful with this in production)
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decoded successfully:", decodedToken); // Log decoded token

      // Set user on request object
      req.user = { _id: decodedToken._id };
      next();
    } catch (verifyError) {
      console.error("JWT verification specific error:", verifyError.message);
      return res.status(401).json({
        success: false,
        message: `Token verification failed: ${verifyError.message}`
      });
    }
  } catch (error) {
    console.error("JWT overall error:", error.message); // Log the error
    return res.status(401).json({
      success: false,
      message: error?.message || "Invalid access token"
    });
  }
};
