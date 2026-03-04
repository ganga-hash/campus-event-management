const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

const register = async (req, res) => {
  const { name, email, password, department, year, phone } = req.body;

  if (!name || !email || !password || !year) {
    return res.status(400).json({ message: 'Name, email, password, and year are required' });
  }

  if (year < 1 || year > 4) {
    return res.status(400).json({ message: 'Year must be between 1 and 4' });
  }

  try {
    const [existing] = await pool.query('SELECT student_id FROM Student WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO Student (name, email, password_hash, department, year, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, password_hash, department, year, phone]
    );

    const token = jwt.sign(
      { id: result.insertId, email, role: 'student', name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: result.insertId, name, email, role: 'student', department, year }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM Student WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.student_id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.student_id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT student_id, name, email, department, year, phone, role, created_at FROM Student WHERE student_id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, getProfile };
