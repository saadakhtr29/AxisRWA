const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const admin = require("../config/firebase");

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, uid: user.uid, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/**
 * Handles login or registration via Firebase token.
 * If user exists, return token; else create and then return token.
 */
const loginOrRegister = async (req, res) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ error: "Missing Firebase token" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const { uid, email } = decoded;

    let user = await prisma.user.findUnique({ where: { uid } });

    // If not exists, create default investor user (or prompt frontend for role)
    if (!user) {
      user = await prisma.user.create({
        data: {
          uid,
          email,
          role: "investor", // Default role
          wallet: "", // Can be updated later by frontend
        },
      });
    }

    const jwtToken = generateToken(user);
    res.status(200).json({ token: jwtToken, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Authentication failed" });
  }
};

module.exports = { loginOrRegister };
