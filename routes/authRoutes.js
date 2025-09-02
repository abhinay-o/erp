const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getAllUsers
} = require('../controllers/authController');

const protect = require('../middleware/authMiddleware'); // Checks JWT token
const authorize = require('../middleware/authorize'); // Checks roles

// 🔹 Public Auth Routes
router.post('/login', login);

// 🔹 Protected - Only Super Admin & Admin can create users
router.post('/register', protect, authorize('super_admin', 'admin'), register);

// 🔹 Protected route to get profile info of logged-in user
router.get('/me', protect, (req, res) => {
  res.json({ message: 'Token is valid', user: req.user });
});

// 🔹 Example: Admin-only test route
router.get(
  '/admin-only',
  protect,
  authorize('super_admin', 'admin'),
  (req, res) => {
    res.json({ message: 'Welcome Admin/Super Admin', user: req.user });
  }
);

// 🔹 Admin/Super Admin - List All Users
router.get('/users', protect, authorize('super_admin', 'admin'), getAllUsers);

module.exports = router;
