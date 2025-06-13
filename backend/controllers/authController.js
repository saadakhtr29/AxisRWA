const admin = require("../config/firebase");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Generate dummy wallet (replace with actual wallet logic if needed)
const generateDummyWallet = () => {
  return (
    "0x" +
    [...Array(40)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("")
  );
};

const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "User already exists in DB" });
    }

    let fbUser;
    try {
      fbUser = await admin.auth().createUser({ email, password });
    } catch (firebaseErr) {
      if (firebaseErr.code === "auth/email-already-exists") {
        return res
          .status(400)
          .json({ message: "Email already exists in Firebase" });
      }
      throw firebaseErr;
    }

    const user = await prisma.user.create({
      data: {
        uid: fbUser.uid,
        email,
        role,
        wallet: generateDummyWallet(),
      },
    });

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

const login = async (req, res) => {
  try {
    const { idToken } = req.body;

    const decoded = await admin.auth().verifyIdToken(idToken);
    const user = await prisma.user.findUnique({ where: { uid: decoded.uid } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
