import jwt from 'jsonwebtoken';
import User from '../models/user.js'; 

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from 'Authorization' header
  
  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  // Verify token and decode
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    try {
      const user = await User.findById(decoded.id); // Find user by ID
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      req.user = user; // Attach user data to the request
      next(); // Pass control to the next middleware or route handler
    } catch (error) {
      return res.status(500).json({ message: 'Server error while validating token' });
    }
  });
};

export default verifyToken;
