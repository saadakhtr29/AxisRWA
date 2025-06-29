const admin = require("../config/firebase");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

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
    const { idToken, role } = req.body;

    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, email } = decoded;

    let user = await prisma.user.findUnique({ where: { uid } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          uid,
          email,
          role: role || "user",
          wallet: generateDummyWallet(),
        },
      });
    }

    const token = jwt.sign(
      { uid: user.uid, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({ token, user });
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

    return res.status(200).json({ token, user });
  } catch (err) {
    console.error("Login Error:", err);
    return res
      .status(500)
      .json({ message: "Login failed", error: err.message });
  }
};

const assignRole = async (req, res) => {
  try {
    const { email, role } = req.body;

    const user = await prisma.user.update({
      where: { email },
      data: { role },
    });

    return res.status(200).json({ message: "Role updated", user });
  } catch (err) {
    console.error("Assign Role Error:", err);
    return res
      .status(500)
      .json({ message: "Failed to update role", error: err.message });
  }
};

const getCurrentUser = async (req, res) => {
  return res.status(200).json({ user: req.user });
};

module.exports = {
  register,
  login,
  assignRole,
  getCurrentUser,
};
