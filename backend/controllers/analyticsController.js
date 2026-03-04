const pool = require('../config/db');

const getDashboardStats = async (req, res) => {
  try {
    const [[{ total_events }]] = await pool.query('SELECT COUNT(*) AS total_events FROM Event');
    const [[{ total_students }]] = await pool.query('SELECT COUNT(*) AS total_students FROM Student WHERE role = "student"');
    const [[{ total_registrations }]] = await pool.query('SELECT COUNT(*) AS total_registrations FROM Registration WHERE status = "confirmed"');
    const [[{ total_volunteers }]] = await pool.query('SELECT COUNT(*) AS total_volunteers FROM Volunteer WHERE status = "active"');

    res.json({ total_events, total_students, total_registrations, total_volunteers });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getRegistrationsPerEvent = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.name AS event_name, COUNT(r.registration_id) AS total_registrations
      FROM Event e
      LEFT JOIN Registration r ON e.event_id = r.event_id AND r.status = 'confirmed'
      GROUP BY e.event_id, e.name
      ORDER BY total_registrations DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getTopEvent = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.name, COUNT(r.registration_id) AS participants
      FROM Event e
      JOIN Registration r ON e.event_id = r.event_id AND r.status = 'confirmed'
      GROUP BY e.event_id, e.name
      ORDER BY participants DESC
      LIMIT 1
    `);
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getVolunteerDistribution = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.name AS event_name, COUNT(a.assignment_id) AS volunteer_count
      FROM Event e
      LEFT JOIN Assignment a ON e.event_id = a.event_id
      GROUP BY e.event_id, e.name
      ORDER BY volunteer_count DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getCategoryBreakdown = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.name AS category, COUNT(e.event_id) AS event_count,
        COALESCE(SUM(e.current_participants), 0) AS total_participants
      FROM Category c
      LEFT JOIN Event e ON c.category_id = e.category_id
      GROUP BY c.category_id, c.name
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboardStats, getRegistrationsPerEvent, getTopEvent, getVolunteerDistribution, getCategoryBreakdown };
