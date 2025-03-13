const jwt = require('jsonwebtoken');
const db = require('../config/db');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const [users] = await db.query('SELECT id, name, email FROM users WHERE id = ?', [decoded.id]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user to request object
    req.user = users[0];
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).send({
      message: "Require Admin Role!"
    });
  }
  next();
};

const isDoctor = (req, res, next) => {
  if (req.userRole !== 'doctor' && req.userRole !== 'admin') {
    return res.status(403).send({
      message: "Require Doctor Role!"
    });
  }
  next();
};

module.exports = {
  authMiddleware,
  isAdmin,
  isDoctor
}; 