const db = require('../config/db');

exports.getAllVaccines = async (req, res) => {
  try {
    const [vaccines] = await db.query('SELECT * FROM vaccines');
    res.json(vaccines);
  } catch (error) {
    console.error('Error fetching vaccines:', error);
    res.status(500).json({ message: 'Server error while fetching vaccines' });
  }
};

exports.getVaccine = async (req, res) => {
  try {
    const [vaccines] = await db.query(
      'SELECT * FROM vaccines WHERE id = ?',
      [req.params.id]
    );

    if (vaccines.length === 0) {
      return res.status(404).json({ message: 'Vaccine not found' });
    }

    res.json(vaccines[0]);
  } catch (error) {
    console.error('Error fetching vaccine:', error);
    res.status(500).json({ message: 'Server error while fetching vaccine' });
  }
};

exports.addVaccine = async (req, res) => {
  try {
    const { vaccineName, description, recommendedAge, dosesRequired, diseasePrevented, manufacturer } = req.body;

    const [result] = await db.query(
      'INSERT INTO vaccines (vaccine_name, description, recommended_age, doses_required, disease_prevented, manufacturer) VALUES (?, ?, ?, ?, ?, ?)',
      [vaccineName, description, recommendedAge, dosesRequired, diseasePrevented, manufacturer]
    );

    res.status(201).json({
      message: "Vaccine added successfully",
      vaccineId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding vaccine" });
  }
};

exports.updateVaccine = async (req, res) => {
  try {
    const { vaccineName, description, recommendedAge, dosesRequired, diseasePrevented, manufacturer } = req.body;

    const [result] = await db.query(
      'UPDATE vaccines SET vaccine_name = ?, description = ?, recommended_age = ?, doses_required = ?, disease_prevented = ?, manufacturer = ? WHERE vaccine_id = ?',
      [vaccineName, description, recommendedAge, dosesRequired, diseasePrevented, manufacturer, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Vaccine not found" });
    }

    res.json({ message: "Vaccine updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating vaccine" });
  }
};

exports.deleteVaccine = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM vaccines WHERE vaccine_id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Vaccine not found" });
    }

    res.json({ message: "Vaccine deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting vaccine" });
  }
}; 