const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getParentAppointments,
  getAvailableDoctors
} = require('../controllers/appointment.controller');

// Create a new appointment
router.post('/', createAppointment);

// Get appointments for a parent
router.get('/', getParentAppointments);

// Get available doctors
router.get('/doctors', getAvailableDoctors);

module.exports = router; 