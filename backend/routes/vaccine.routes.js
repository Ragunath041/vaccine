const express = require('express');
const router = express.Router();
const { getAllVaccines, getVaccine } = require('../controllers/vaccine.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// All routes are protected with authentication
router.use(authMiddleware);

// Get all vaccines
router.get('/', getAllVaccines);

// Get a specific vaccine
router.get('/:id', getVaccine);

module.exports = router; 