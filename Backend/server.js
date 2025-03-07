const express = require('express');
require('dotenv').config();
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
require('./src/config/db'); // Import and establish database connection

const app = express();

// Middleware
app.use(cors({
    origin: "*",
    credentials: true // ✅ Allow cookies, authentication tokens
  }));app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;