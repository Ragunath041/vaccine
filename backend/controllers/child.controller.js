const db = require('../config/db');

const getAllChildren = async (req, res) => {
  try {
    const [children] = await db.query(
      'SELECT * FROM children WHERE parent_id = ?',
      [req.user.user_id]
    );
    res.json(children);
  } catch (error) {
    console.error('Error fetching children:', error);
    res.status(500).json({ message: 'Server error while fetching children' });
  }
};

const getChild = async (req, res) => {
  try {
    const [children] = await db.query(
      'SELECT * FROM children WHERE child_id = ? AND parent_id = ?',
      [req.params.id, req.user.user_id]
    );

    if (children.length === 0) {
      return res.status(404).json({ message: 'Child not found' });
    }

    res.json(children[0]);
  } catch (error) {
    console.error('Error fetching child:', error);
    res.status(500).json({ message: 'Server error while fetching child' });
  }
};

const createChild = async (req, res) => {
  try {
    const { 
      first_name, 
      last_name, 
      date_of_birth, 
      gender, 
      blood_group, 
      allergies,
      parent_id 
    } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !date_of_birth || !gender || !parent_id) {
      return res.status(400).json({ 
        message: 'Missing required fields. Please provide first_name, last_name, date_of_birth, gender, and parent_id.' 
      });
    }

    // Validate gender enum
    if (!['male', 'female', 'other'].includes(gender.toLowerCase())) {
      return res.status(400).json({ 
        message: 'Invalid gender. Must be one of: male, female, other' 
      });
    }

    // Insert the new child
    const [result] = await db.query(
      `INSERT INTO children 
       (parent_id, first_name, last_name, date_of_birth, gender, blood_group, allergies) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [parent_id, first_name, last_name, date_of_birth, gender.toLowerCase(), blood_group || null, allergies || null]
    );

    // Get the newly created child
    const [children] = await db.query(
      'SELECT * FROM children WHERE child_id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Child added successfully',
      child: children[0]
    });
  } catch (error) {
    console.error('Error creating child:', error);
    res.status(500).json({ message: 'Server error while creating child' });
  }
};

const updateChild = async (req, res) => {
  try {
    const { first_name, last_name, date_of_birth, gender, blood_group } = req.body;

    const [result] = await db.query(
      'UPDATE children SET first_name = ?, last_name = ?, date_of_birth = ?, gender = ?, blood_group = ? WHERE child_id = ? AND parent_id = ?',
      [first_name, last_name, date_of_birth, gender, blood_group, req.params.id, req.user.user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Child not found' });
    }

    const [updatedChild] = await db.query(
      'SELECT * FROM children WHERE child_id = ?',
      [req.params.id]
    );

    res.json(updatedChild[0]);
  } catch (error) {
    console.error('Error updating child:', error);
    res.status(500).json({ message: 'Server error while updating child' });
  }
};

const deleteChild = async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM children WHERE child_id = ? AND parent_id = ?',
      [req.params.id, req.user.user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Child not found' });
    }

    res.json({ message: 'Child deleted successfully' });
  } catch (error) {
    console.error('Error deleting child:', error);
    res.status(500).json({ message: 'Server error while deleting child' });
  }
};

const getVaccinationRecords = async (req, res) => {
  try {
    const [records] = await db.query(
      `SELECT vr.*, v.vaccine_name, v.description, u.first_name as doctor_first_name, u.last_name as doctor_last_name 
       FROM vaccination_records vr 
       JOIN vaccines v ON vr.vaccine_id = v.vaccine_id 
       JOIN users u ON vr.doctor_id = u.user_id 
       WHERE vr.child_id = ?
       ORDER BY vr.vaccination_date DESC`,
      [req.params.childId]
    );

    res.json(records);
  } catch (error) {
    console.error('Error fetching vaccination records:', error);
    res.status(500).json({ message: 'Error fetching vaccination records' });
  }
};

const getUpcomingVaccinations = async (req, res) => {
  try {
    const [schedules] = await db.query(
      `SELECT vs.*, v.vaccine_name, v.description 
       FROM vaccination_schedule vs 
       JOIN vaccines v ON vs.vaccine_id = v.vaccine_id 
       WHERE vs.child_id = ? AND vs.status = 'pending'
       ORDER BY vs.scheduled_date ASC`,
      [req.params.id]
    );

    res.json(schedules);
  } catch (error) {
    console.error('Error fetching upcoming vaccinations:', error);
    res.status(500).json({ message: 'Error fetching upcoming vaccinations' });
  }
};

// Helper function to create vaccination schedule for a new child
const createVaccinationSchedule = async (childId, dateOfBirth) => {
  try {
    // Get all vaccines
    const [vaccines] = await db.query('SELECT * FROM vaccines');
    
    // Create schedule entries for each vaccine
    for (const vaccine of vaccines) {
      // Calculate scheduled date based on recommended age
      const scheduledDate = new Date(dateOfBirth);
      scheduledDate.setMonth(scheduledDate.getMonth() + 2); // Example: Schedule 2 months after birth
      
      await db.query(
        'INSERT INTO vaccination_schedule (child_id, vaccine_id, dose_number, scheduled_date) VALUES (?, ?, ?, ?)',
        [childId, vaccine.vaccine_id, 1, scheduledDate]
      );
    }
  } catch (error) {
    console.error('Error creating vaccination schedule:', error);
    throw error;
  }
};

// Get all children for a specific parent
const getChildren = async (req, res) => {
  try {
    const { parent_id } = req.query;
    
    if (!parent_id) {
      return res.status(400).json({ message: 'Parent ID is required' });
    }

    const [children] = await db.query(
      'SELECT * FROM children WHERE parent_id = ? ORDER BY created_at DESC',
      [parent_id]
    );

    res.json(children);
  } catch (error) {
    console.error('Error fetching children:', error);
    res.status(500).json({ message: 'Server error while fetching children' });
  }
};

module.exports = {
  getAllChildren,
  getChild,
  createChild,
  updateChild,
  deleteChild,
  getVaccinationRecords,
  getUpcomingVaccinations,
  getChildren
}; 