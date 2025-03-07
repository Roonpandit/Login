const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { userId: user._id }, 
    process.env.REFRESH_SECRET, 
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
};

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role: role || "user" });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User does not exist" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: "Wrong password" });

    const { accessToken, refreshToken } = generateTokens(user);
    const redirectPath = user.role === "admin" ? "/admin" : "/user";

    res.json({ accessToken, refreshToken, role: user.role, redirectPath });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup, login };