const express = require('express');
const router = express.Router();
const { getSchedule, getChildSchedule } = require('../controllers/schedule.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// All routes are protected with authentication
router.use(authMiddleware);

// Get all schedules for the logged-in user
router.get('/', getSchedule);

// Get schedule for a specific child
router.get('/child/:childId', getChildSchedule);

module.exports = router; 