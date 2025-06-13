const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { uid } = decoded;

    const user = await prisma.user.findUnique({ where: { uid } });

    if (!user) {
      return res.status(404).json({ error: "User not found in database" });
    }

    req.user = {
      userId: user.id,
      uid: user.uid,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(403).json({ error: "Invalid token" });
  }
};

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
