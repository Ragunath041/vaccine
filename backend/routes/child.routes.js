const express = require('express');
const router = express.Router();
const { 
  getAllChildren,
  getChild,
  createChild,
  updateChild,
  deleteChild,
  getVaccinationRecords,
  getUpcomingVaccinations,
  getChildren
} = require('../controllers/child.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// Get all children for a specific parent
router.get('/', getChildren);

// Get a specific child
router.get('/:id', getChild);

// Create a new child
router.post('/', createChild);

// Update a child
router.put('/:id', updateChild);

// Delete a child
router.delete('/:id', deleteChild);

// Get child's vaccination history
router.get('/:id/vaccinations', authMiddleware, getChild, (req, res) => {
  // Implementation of getting vaccination history
});

// Get child's upcoming vaccinations
router.get('/:id/upcoming-vaccinations', getUpcomingVaccinations);

// Get vaccination records for a child
router.get('/:childId/vaccination-records', getVaccinationRecords);

module.exports = router; 