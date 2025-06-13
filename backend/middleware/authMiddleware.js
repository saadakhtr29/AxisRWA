const jwt = require("jsonwebtoken");
const admin = require("../config/firebase");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Verifies Firebase ID token and attaches user data from DB (including role).
 */
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token)
    return res.status(401).json({ error: "Unauthorized - No token provided" });

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email } = decodedToken;

    // Fetch user from your DB using Firebase UID
    const user = await prisma.user.findUnique({ where: { uid } });

    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized - User not found in database" });
    }

    // Attach full DB user to req.user
    req.user = {
      userId: user.id,
      uid: user.uid,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    console.error("Firebase token error:", err);
    return res.status(403).json({ error: "Invalid Firebase token" });
  }
};

/**
 * Role-based access control middleware.
 * @param {Array} roles - array of allowed roles (e.g., ['admin'])
 */
const roleMiddleware =
  (roles = []) =>
  (req, res, next) => {
    const user = req.user;

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: "Forbidden - Insufficient role" });
    }

    next();
  };

module.exports = { authMiddleware, roleMiddleware };
