const express = require("express");
const {
  register,
  login,
  assignRole,
  getCurrentUser,
} = require("../controllers/authController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Admin-only role assignment
router.post(
  "/assign-role",
  authMiddleware,
  roleMiddleware(["admin"]),
  assignRole
);

// Auth debug endpoint
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
