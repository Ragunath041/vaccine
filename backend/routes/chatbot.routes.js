const express = require('express');
const router = express.Router();
const { getVaccineInfo, saveChat } = require('../controllers/chatbot.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// All routes are protected with authentication
router.use(authMiddleware);

// Get vaccine information
router.get('/vaccine-info', getVaccineInfo);

// Save chat message
router.post('/save', saveChat);

module.exports = router; 