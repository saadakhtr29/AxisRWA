const admin = require("../config/firebase");
const jwt = require("jsonwebtoken");
const { PrismaClient, Role } = require("@prisma/client");
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

const generateDummyWallet = () => {
  return (
    "0x" +
    [...Array(40)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("")
  );
};

// Register: verify idToken, sync with DB
const register = async (req, res) => {
  try {
    const { idToken, role, wallet } = req.body;

    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, email } = decoded;

    let user = await prisma.user.findUnique({ where: { uid } });

    if (!user) {
      const safeRole = Object.values(Role).includes(role)
        ? role
        : Role.investor;

      user = await prisma.user.create({
        data: {
          uid,
          email,
          role: safeRole,
          wallet: wallet,
        },
      });
    }

    if (!wallet || !wallet.startsWith("0x") || wallet.length !== 42) {
      return res.status(400).json({ message: "Invalid wallet address" });
    }

    const token = jwt.sign(
      { uid: user.uid, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({ token, role: user.role, user });
  } catch (err) {
    console.error("Register Error:", err);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

// Login: verify idToken and issue backend token
const login = async (req, res) => {
  try {
    const { idToken } = req.body;

    const decoded = await admin.auth().verifyIdToken(idToken);
    const user = await prisma.user.findUnique({ where: { uid: decoded.uid } });

    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }

    const token = jwt.sign(
      { uid: user.uid, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({ token, role: user.role, user });
  } catch (err) {
    console.error("Login Error:", err);
    return res
      .status(500)
      .json({ message: "Login failed", error: err.message });
  }
};

// Get current user using JWT
const getCurrentUser = async (req, res) => {
  return res.status(200).json({ user: req.user });
};

module.exports = {
  register,
  login,
  getCurrentUser,
};
