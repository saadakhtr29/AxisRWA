const express = require("express");
// const { loginOrRegister } = require("../controllers/authController");
const { login } = require("../controllers/authController")
const { register } = require("../controllers/authController")

const router = express.Router();

// router.post("/auth", loginOrRegister);
router.post("/register", register);
router.post("/login", login);

module.exports = router;
