const pool = require('../config/db');

const registerVolunteer = async (req, res) => {
  const { skills, availability } = req.body;
  const student_id = req.user.id;
  try {
    const [existing] = await pool.query('SELECT volunteer_id FROM Volunteer WHERE student_id = ?', [student_id]);
    if (existing.length > 0) return res.status(409).json({ message: 'Already registered as volunteer' });
    const [result] = await pool.query('INSERT INTO Volunteer (student_id, skills, availability) VALUES (?, ?, ?)', [student_id, skills || 'Event support', availability || 'All days']);
    res.status(201).json({ message: 'Volunteer registration successful', volunteer_id: result.insertId });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

const applyVolunteerEvent = async (req, res) => {
  const { event_id, role, availability, skills } = req.body;
  const student_id = req.user.id;
  try {
    if (!event_id) {
      return res.status(400).json({ message: 'event_id is required' });
    }

    const [participantRows] = await pool.query(
      `SELECT registration_id
       FROM Registration
       WHERE student_id = ? AND event_id = ? AND status <> 'cancelled'
       LIMIT 1`,
      [student_id, event_id]
    );
    if (participantRows.length > 0) {
      return res.status(409).json({ message: 'You are already registered as a participant for this event. Choose only one role.' });
    }

    let [volRows] = await pool.query('SELECT volunteer_id FROM Volunteer WHERE student_id = ?', [student_id]);
    let volunteer_id;
    if (volRows.length === 0) {
      const [r] = await pool.query('INSERT INTO Volunteer (student_id, skills, availability) VALUES (?, ?, ?)', [student_id, skills || 'Event support', availability || 'All days']);
      volunteer_id = r.insertId;
    } else { volunteer_id = volRows[0].volunteer_id; }
    const [ex] = await pool.query('SELECT assignment_id FROM Assignment WHERE volunteer_id=? AND event_id=?', [volunteer_id, event_id]);
    if (ex.length > 0) return res.status(409).json({ message: 'Already applied to volunteer for this event' });
    await pool.query('INSERT INTO Assignment (volunteer_id, event_id, role) VALUES (?, ?, ?)', [volunteer_id, event_id, role || 'Any / Flexible']);
    res.status(201).json({ message: 'Volunteer application submitted successfully' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

const assignVolunteer = async (req, res) => {
  const { volunteer_id, event_id, role } = req.body;
  try {
    await pool.query('INSERT INTO Assignment (volunteer_id, event_id, role) VALUES (?, ?, ?)', [volunteer_id, event_id, role]);
    res.status(201).json({ message: 'Volunteer assigned' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

const getMyAssignments = async (req, res) => {
  try {
    const [volRows] = await pool.query('SELECT volunteer_id FROM Volunteer WHERE student_id = ?', [req.user.id]);
    if (volRows.length === 0) return res.json([]);
    const [rows] = await pool.query(`
      SELECT a.assignment_id, a.role, a.assigned_at, a.hours_worked,
        e.name AS event_name, e.date, e.time, e.venue, e.event_id, c.name AS category
      FROM Assignment a
      JOIN Event e ON a.event_id = e.event_id
      LEFT JOIN Category c ON e.category_id = c.category_id
      WHERE a.volunteer_id = ? ORDER BY a.assigned_at DESC
    `, [volRows[0].volunteer_id]);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

const getAllVolunteers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT v.volunteer_id, s.name AS volunteer_name, s.email, s.department,
        COUNT(a.assignment_id) AS total_events, COALESCE(SUM(a.hours_worked),0) AS total_hours, v.status
      FROM Volunteer v JOIN Student s ON v.student_id=s.student_id
      LEFT JOIN Assignment a ON v.volunteer_id=a.volunteer_id
      GROUP BY v.volunteer_id, s.name, s.email, s.department, v.status
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

const getAllAssignments = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.assignment_id, a.role, a.assigned_at, a.hours_worked,
        s.name AS volunteer_name, s.email, e.name AS event_name, e.date, e.venue, c.name AS category
      FROM Assignment a JOIN Volunteer v ON a.volunteer_id=v.volunteer_id
      JOIN Student s ON v.student_id=s.student_id
      JOIN Event e ON a.event_id=e.event_id
      LEFT JOIN Category c ON e.category_id=c.category_id
      ORDER BY a.assigned_at DESC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

const deleteMyAssignment = async (req, res) => {
  try {
    const [volRows] = await pool.query('SELECT volunteer_id FROM Volunteer WHERE student_id = ?', [req.user.id]);
    if (volRows.length === 0) return res.status(404).json({ message: 'Not a volunteer' });
    await pool.query('DELETE FROM Assignment WHERE assignment_id = ? AND volunteer_id = ?', [req.params.id, volRows[0].volunteer_id]);
    res.json({ message: 'Volunteer assignment deleted' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

const adminDeleteAssignment = async (req, res) => {
  try {
    await pool.query('DELETE FROM Assignment WHERE assignment_id = ?', [req.params.id]);
    res.json({ message: 'Assignment deleted' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

module.exports = { registerVolunteer, applyVolunteerEvent, assignVolunteer, getMyAssignments, deleteMyAssignment, adminDeleteAssignment, getAllVolunteers, getAllAssignments };
