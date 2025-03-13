const db = require('../config/db.config');

// Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const [appointments] = await db.query(`
      SELECT 
        a.*,
        CONCAT(c.first_name, ' ', c.last_name) as child_name,
        CONCAT(u.first_name, ' ', u.last_name) as doctor_name
      FROM appointments a
      LEFT JOIN children c ON a.child_id = c.child_id
      LEFT JOIN users u ON a.doctor_id = u.user_id
      ORDER BY a.appointment_date, a.appointment_time
    `);
    
    res.json(appointments);
  } catch (error) {
    console.error('Error getting appointments:', error);
    res.status(500).json({ message: 'Server error while fetching appointments' });
  }
};

// Get appointments for a specific child
const getChildAppointments = async (req, res) => {
  try {
    const { childId } = req.params;
    const [appointments] = await db.query(`
      SELECT 
        a.*,
        CONCAT(c.first_name, ' ', c.last_name) as child_name,
        CONCAT(u.first_name, ' ', u.last_name) as doctor_name
      FROM appointments a
      LEFT JOIN children c ON a.child_id = c.child_id
      LEFT JOIN users u ON a.doctor_id = u.user_id
      WHERE a.child_id = ?
      ORDER BY a.appointment_date, a.appointment_time
    `, [childId]);
    
    res.json(appointments);
  } catch (error) {
    console.error('Error getting child appointments:', error);
    res.status(500).json({ message: 'Server error while fetching child appointments' });
  }
};

// Create a new appointment
const createAppointment = async (req, res) => {
  try {
    const {
      child_id,
      doctor_id,
      appointment_date,
      appointment_time,
      reason,
      notes
    } = req.body;

    // Validate required fields
    if (!child_id || !doctor_id || !appointment_date || !appointment_time) {
      return res.status(400).json({
        message: 'Missing required fields. Please provide child_id, doctor_id, appointment_date, and appointment_time.'
      });
    }

    // Insert the appointment
    const [result] = await db.query(
      `INSERT INTO appointments 
       (child_id, doctor_id, appointment_date, appointment_time, reason, notes) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [child_id, doctor_id, appointment_date, appointment_time, reason || null, notes || null]
    );

    // Get the created appointment
    const [appointments] = await db.query(
      `SELECT a.*, c.first_name as child_first_name, c.last_name as child_last_name,
       u.first_name as doctor_first_name, u.last_name as doctor_last_name
       FROM appointments a 
       JOIN children c ON a.child_id = c.child_id
       JOIN users u ON a.doctor_id = u.user_id
       WHERE a.appointment_id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: appointments[0]
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server error while creating appointment' });
  }
};

// Update an appointment
const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { appointment_date, appointment_time, status, reason, notes } = req.body;

    // Check if appointment exists
    const [existingAppointment] = await db.query(
      'SELECT * FROM appointments WHERE appointment_id = ?',
      [appointmentId]
    );

    if (existingAppointment.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Update the appointment
    await db.query(`
      UPDATE appointments 
      SET 
        appointment_date = COALESCE(?, appointment_date),
        appointment_time = COALESCE(?, appointment_time),
        status = COALESCE(?, status),
        reason = COALESCE(?, reason),
        notes = COALESCE(?, notes)
      WHERE appointment_id = ?
    `, [appointment_date, appointment_time, status, reason, notes, appointmentId]);

    // Get the updated appointment
    const [appointment] = await db.query(`
      SELECT 
        a.*,
        CONCAT(c.first_name, ' ', c.last_name) as child_name,
        CONCAT(u.first_name, ' ', u.last_name) as doctor_name
      FROM appointments a
      LEFT JOIN children c ON a.child_id = c.child_id
      LEFT JOIN users u ON a.doctor_id = u.user_id
      WHERE a.appointment_id = ?
    `, [appointmentId]);

    res.json(appointment[0]);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Server error while updating appointment' });
  }
};

// Delete an appointment
const deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Check if appointment exists
    const [appointment] = await db.query(
      'SELECT * FROM appointments WHERE appointment_id = ?',
      [appointmentId]
    );

    if (appointment.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Delete the appointment
    await db.query('DELETE FROM appointments WHERE appointment_id = ?', [appointmentId]);

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Server error while deleting appointment' });
  }
};

// Get appointments for a parent
const getParentAppointments = async (req, res) => {
  try {
    const { parent_id } = req.query;

    if (!parent_id) {
      return res.status(400).json({ message: 'Parent ID is required' });
    }

    const [appointments] = await db.query(
      `SELECT a.*, c.first_name as child_first_name, c.last_name as child_last_name,
       u.first_name as doctor_first_name, u.last_name as doctor_last_name
       FROM appointments a 
       JOIN children c ON a.child_id = c.child_id
       JOIN users u ON a.doctor_id = u.user_id
       WHERE c.parent_id = ?
       ORDER BY a.appointment_date ASC, a.appointment_time ASC`,
      [parent_id]
    );

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error while fetching appointments' });
  }
};

// Get available doctors
const getAvailableDoctors = async (req, res) => {
  try {
    const [doctors] = await db.query(
      `SELECT user_id, first_name, last_name 
       FROM users 
       WHERE role = 'doctor'`
    );

    res.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error while fetching doctors' });
  }
};

module.exports = {
  getAllAppointments,
  getChildAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getParentAppointments,
  getAvailableDoctors
};