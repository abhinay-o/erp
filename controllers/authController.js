const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// 🔹 Helper function to validate password strength
const validatePassword = (password) => {
  const minLength = /.{8,}/;             // At least 8 characters
  const upperCase = /[A-Z]/;              // At least 1 uppercase letter
  const lowerCase = /[a-z]/;              // At least 1 lowercase letter
  const number = /[0-9]/;                 // At least 1 number
  const specialChar = /[^A-Za-z0-9]/;     // At least 1 special character

  return (
    minLength.test(password) &&
    upperCase.test(password) &&
    lowerCase.test(password) &&
    number.test(password) &&
    specialChar.test(password)
  );
};


// 📌 Register User (Super Admin/Admin will use this to create accounts)
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // 1️⃣ Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2️⃣ Validate password strength
    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters long and include 1 uppercase, 1 lowercase, 1 number, and 1 special character.'
      });
    }

    // 3️⃣ Hash the password
    const hashed = await bcrypt.hash(password, 10);

    // 4️⃣ Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: role || 'trainer', // default if not provided
      status: 'active'
    });

    // 5️⃣ Respond without password
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};


// 📌 Login User (Super Admin OR Role-based)
exports.login = async (req, res) => {
  const { email, password, role } = req.body; // 'role' is optional - sent only in role-based login

  try {
    // 1️⃣ Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 2️⃣ Check if account is active
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Account is inactive. Contact admin.' });
    }

    // 3️⃣ If role is provided (role-based login), it must match DB role
    if (role && role !== user.role) {
      return res.status(403).json({ message: 'Role does not match this account' });
    }

    // 4️⃣ Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // 5️⃣ Generate JWT with role
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 6️⃣ Respond with token + info
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};


// 📌 Get All Users (Super Admin/Admin Only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude password field
    res.json(users);
  } catch (err) {
    console.error("GetAllUsers Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
