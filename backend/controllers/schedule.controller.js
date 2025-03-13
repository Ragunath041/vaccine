const db = require('../config/db');

exports.getSchedule = async (req, res) => {
  try {
    const [schedules] = await db.query(
      `SELECT vr.*, c.name as child_name, v.name as vaccine_name 
       FROM vaccination_records vr 
       JOIN children c ON vr.child_id = c.id 
       JOIN vaccines v ON vr.vaccine_id = v.id 
       WHERE c.parent_id = ? 
       ORDER BY vr.vaccination_date ASC`,
      [req.user.id]
    );
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ message: 'Server error while fetching schedule' });
  }
};

exports.getChildSchedule = async (req, res) => {
  try {
    const [schedules] = await db.query(
      `SELECT vr.*, c.name as child_name, v.name as vaccine_name 
       FROM vaccination_records vr 
       JOIN children c ON vr.child_id = c.id 
       JOIN vaccines v ON vr.vaccine_id = v.id 
       WHERE c.id = ? AND c.parent_id = ? 
       ORDER BY vr.vaccination_date ASC`,
      [req.params.childId, req.user.id]
    );
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching child schedule:', error);
    res.status(500).json({ message: 'Server error while fetching child schedule' });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const { schedules } = req.body;

    // Verify doctor's authorization (already handled by middleware)
    for (const schedule of schedules) {
      const { scheduleId, scheduledDate, status, notes } = schedule;
      
      await db.query(
        'UPDATE vaccination_schedule SET scheduled_date = ?, status = ?, notes = ? WHERE schedule_id = ?',
        [scheduledDate, status, notes, scheduleId]
      );
    }

    res.json({ message: "Vaccination schedule updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating vaccination schedule" });
  }
};

exports.markAsCompleted = async (req, res) => {
  try {
    const { completedDate, batchNumber, notes, nextDueDate } = req.body;

    // Start a transaction
    await db.query('START TRANSACTION');

    try {
      // Get schedule details
      const [schedules] = await db.query(
        'SELECT * FROM vaccination_schedule WHERE schedule_id = ?',
        [req.params.id]
      );

      if (schedules.length === 0) {
        throw new Error("Schedule not found");
      }

      const schedule = schedules[0];

      // Update schedule status
      await db.query(
        'UPDATE vaccination_schedule SET status = "completed", completed_date = ?, notes = ? WHERE schedule_id = ?',
        [completedDate, notes, req.params.id]
      );

      // Create vaccination record
      await db.query(
        `INSERT INTO vaccination_records 
         (child_id, vaccine_id, doctor_id, dose_number, vaccination_date, batch_number, next_due_date, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [schedule.child_id, schedule.vaccine_id, req.userId, schedule.dose_number, 
         completedDate, batchNumber, nextDueDate, notes]
      );

      // If there are more doses required, create next schedule
      const [vaccines] = await db.query(
        'SELECT doses_required FROM vaccines WHERE vaccine_id = ?',
        [schedule.vaccine_id]
      );

      if (schedule.dose_number < vaccines[0].doses_required) {
        await db.query(
          `INSERT INTO vaccination_schedule 
           (child_id, vaccine_id, dose_number, scheduled_date)
           VALUES (?, ?, ?, ?)`,
          [schedule.child_id, schedule.vaccine_id, schedule.dose_number + 1, nextDueDate]
        );
      }

      await db.query('COMMIT');
      res.json({ message: "Vaccination marked as completed successfully" });
    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error marking vaccination as completed" });
  }
};

exports.rescheduleVaccination = async (req, res) => {
  try {
    const { scheduledDate, reason } = req.body;

    let query;
    let queryParams;

    if (req.userRole === 'doctor') {
      query = `
        UPDATE vaccination_schedule 
        SET scheduled_date = ?, status = "rescheduled", notes = ? 
        WHERE schedule_id = ?
      `;
      queryParams = [scheduledDate, reason, req.params.id];
    } else {
      query = `
        UPDATE vaccination_schedule vs
        JOIN children c ON vs.child_id = c.child_id
        SET vs.scheduled_date = ?, vs.status = "rescheduled", vs.notes = ?
        WHERE vs.schedule_id = ? AND c.parent_id = ?
      `;
      queryParams = [scheduledDate, reason, req.params.id, req.userId];
    }

    const [result] = await db.query(query, queryParams);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Schedule not found or not authorized" });
    }

    res.json({ message: "Vaccination rescheduled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error rescheduling vaccination" });
  }
}; 