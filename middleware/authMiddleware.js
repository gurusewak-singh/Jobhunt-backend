import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1];
};

const getUserFromToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return await User.findById(decoded.id).select('-password');
};

// General user middleware
export const verifyUser = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ message: 'Token is missing or invalid' });

    const user = await getUserFromToken(token);
    if (!user) return res.status(401).json({ message: 'User not found or token invalid' });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};

// Role-specific middleware
export const verifyCandidate = async (req, res, next) => {
  await verifyUser(req, res, async () => {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Access denied. Candidate only.' });
    }
    next();
  });
};

export const verifyEmployer = async (req, res, next) => {
  await verifyUser(req, res, async () => {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Access denied. Employer only.' });
    }
    next();
  });
};

export const verifyAdmin = async (req, res, next) => {
  await verifyUser(req, res, async () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
  });
};
