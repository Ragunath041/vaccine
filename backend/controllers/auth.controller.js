const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Assuming you have a database connection module

// Array of hardcoded doctors
const DOCTORS = [
  { doctor_id: 1, first_name: 'Arun', last_name: 'Patel', specialization: 'Pediatrician', email: 'doctor1@example.com' },
  { doctor_id: 2, first_name: 'Priya', last_name: 'Sharma', specialization: 'Vaccination Specialist', email: 'doctor2@example.com' },
  { doctor_id: 3, first_name: 'Rajesh', last_name: 'Kumar', specialization: 'Child Specialist', email: 'doctor3@example.com' },
  { doctor_id: 4, first_name: 'Deepa', last_name: 'Gupta', specialization: 'Pediatrician', email: 'doctor4@example.com' },
  { doctor_id: 5, first_name: 'Suresh', last_name: 'Verma', specialization: 'Immunologist', email: 'doctor5@example.com' },
  { doctor_id: 6, first_name: 'Anita', last_name: 'Singh', specialization: 'Pediatrician', email: 'doctor6@example.com' },
  { doctor_id: 7, first_name: 'Vikram', last_name: 'Malhotra', specialization: 'Child Specialist', email: 'doctor7@example.com' }
];

// Register a new user (only parents)
exports.register = async (req, res) => {
  const { email, password, role, firstName, lastName, phoneNumber } = req.body;

  // Ensure role is 'parent' since we only allow parent registration
  if (role !== 'parent') {
    return res.status(400).json({ message: 'Only parent registration is allowed' });
  }

  try {
    // Check if a doctor with this email exists
    const isDoctor = DOCTORS.some(doctor => doctor.email === email);
    if (isDoctor) {
      return res.status(400).json({ message: 'This email is reserved for system use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await db.query(
      'INSERT INTO users (email, password, role, first_name, last_name, phone_number) VALUES (?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, role, firstName, lastName, phoneNumber]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login a user (both parents and doctors)
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if it's a doctor login
    if (role === 'doctor') {
      const doctor = DOCTORS.find(d => d.email === email);
      if (doctor && password === 'doctor123') {
        // Generate a JWT token for the doctor
        const token = jwt.sign(
          { 
            userId: doctor.doctor_id, 
            role: 'doctor',
            firstName: doctor.first_name,
            lastName: doctor.last_name,
            email: doctor.email
          }, 
          process.env.JWT_SECRET, 
          { expiresIn: '1h' }
        );

        return res.json({ 
          token, 
          role: 'doctor', 
          userId: doctor.doctor_id,
          user: {
            id: doctor.doctor_id,
            firstName: doctor.first_name,
            lastName: doctor.last_name,
            email: doctor.email
          }
        });
      } else {
        return res.status(401).json({ message: 'Invalid doctor credentials' });
      }
    }

    // If not a doctor, proceed with normal parent login
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the role matches
    if (user.role !== role) {
      return res.status(403).json({ message: 'Access denied for this role' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.user_id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ 
      token, 
      role: user.role, 
      userId: user.user_id,
      user: {
        id: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 