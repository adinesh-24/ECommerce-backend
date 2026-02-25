// Export a function that accepts allowed roles (admin, user, etc.)
const AppError = require('../utils/AppError');
module.exports = (...roles) => {

  // Return the actual middleware function
  return (req, res, next) => {

    // STEP 1: Check if user is authenticated
    // req.user is set in JWT verify middleware
    // req.user.user exists because JW
    // T payload was:
    // { user: { id, role } }
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated, please login" });
    }

    //  STEP 2: Authorization check (Role-based access)
    // roles → array passed from route (example: ["admin"])
    // req.user.user.role → role extracted from JWT
    // If user's role is NOT included in allowed roles → deny access
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: You don't have permission to access this resource" });
    }

    //  STEP 3: User is authenticated AND authorized
    // Allow request to continue to controller
    next();
  };
};