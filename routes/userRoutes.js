const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const { getAllUsers, deleteUser } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');

// ✅ Get All Users (Only Super Admin)
router.get('/', protect, authorize('super_admin'), getAllUsers);

// ✅ Delete User (Only Super Admin)
router.delete('/:id', protect, authorize('super_admin'), deleteUser);

module.exports = router;
