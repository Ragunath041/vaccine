const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword } = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// All routes are protected with authentication
router.use(authMiddleware);

// Get user profile
router.get('/profile', getProfile);


// Update user profile
router.put('/profile', updateProfile);

// Change password
router.put('/change-password', changePassword);

module.exports = router; 