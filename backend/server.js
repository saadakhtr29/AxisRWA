require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { PrismaClient } = require("@prisma/client");

// Route imports
const authRoutes = require("./routes/authRoutes");
const assetRoutes = require("./routes/assetRoutes");
const ownershipRoutes = require("./routes/ownershipRoutes");
const roiRoutes = require("./routes/roiRoutes");

const app = express();
const prisma = new PrismaClient();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/investments", ownershipRoutes);
app.use("/api/roi", roiRoutes);

// Health check
app.get("/", (req, res) => res.send("✅ AXISRWA API is running."));

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`AxisRWA server running on port ${PORT}`);
});
