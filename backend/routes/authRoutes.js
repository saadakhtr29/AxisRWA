const express = require("express");
const { loginOrRegister } = require("../controllers/authController");

const router = express.Router();

// Single endpoint: accepts Firebase ID token, then logs in or registers
router.post("/auth", loginOrRegister);

module.exports = router;
