const jwt = require('jsonwebtoken');
const admin = require('../config/firebase');

/**
 * Middleware to verify Firebase token and attach user info.
 */
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) return res.status(401).json({ error: 'Unauthorized - No token provided' });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.firebaseUser = decodedToken; // uid, email, etc.
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid Firebase token' });
  }
};

/**
 * Middleware to check user role.
 */
const roleMiddleware = (roles = []) => (req, res, next) => {
  const user = req.user || req.firebaseUser;
  if (!user || !roles.includes(user.role)) {
    return res.status(403).json({ error: 'Forbidden - Insufficient role' });
  }
  next();
};

module.exports = { authMiddleware, roleMiddleware };