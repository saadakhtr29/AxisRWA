require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const authRoutes = require('./routes/authRoutes');
const assetRoutes = require('./routes/assetRoutes');
// Add more routes as needed

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
// Add more APIs here

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`AXISRWA server running on port ${PORT}`);
});