const express = require('express');
require('dotenv').config();
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
require('./src/config/db'); // Import and establish database connection

const app = express();

// Middleware
app.use(cors({origin:"https://login-demo-system.netlify.app/"}));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;