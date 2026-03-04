const pool = require('../config/db');

const registerForEvent = async (req, res) => {
  const { event_id } = req.body;
  const student_id = req.user.id;

  try {
    const [eventRows] = await pool.query('SELECT * FROM Event WHERE event_id = ?', [event_id]);
    if (eventRows.length === 0) return res.status(404).json({ message: 'Event not found' });

    const event = eventRows[0];
    if (event.current_participants >= event.max_participants) {
      return res.status(400).json({ message: 'Event is full. Cannot register.' });
    }

    const [existing] = await pool.query(
      'SELECT registration_id FROM Registration WHERE student_id = ? AND event_id = ?',
      [student_id, event_id]
    );
    if (existing.length > 0) return res.status(409).json({ message: 'Already registered for this event' });

    await pool.query('INSERT INTO Registration (student_id, event_id) VALUES (?, ?)', [student_id, event_id]);

    // Fetch updated participant count
    const [updated] = await pool.query('SELECT current_participants FROM Event WHERE event_id = ?', [event_id]);
    res.status(201).json({ message: 'Successfully registered for event', current_participants: updated[0]?.current_participants });
  } catch (err) {
    if (err.message && err.message.includes('full')) {
      return res.status(400).json({ message: 'Event is full (trigger).' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyRegistrations = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.registration_id, r.registered_at, r.status,
        e.name AS event_name, e.date, e.time, e.venue, e.prize_pool, c.name AS category
      FROM Registration r
      JOIN Event e ON r.event_id = e.event_id
      LEFT JOIN Category c ON e.category_id = c.category_id
      WHERE r.student_id = ?
      ORDER BY r.registered_at DESC
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const cancelRegistration = async (req, res) => {
  try {
    await pool.query(
      'UPDATE Registration SET status = "cancelled" WHERE registration_id = ? AND student_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Registration cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteRegistration = async (req, res) => {
  try {
    // Get event_id before deleting so we can decrement the count
    const [reg] = await pool.query(
      'SELECT event_id, status FROM Registration WHERE registration_id = ? AND student_id = ?',
      [req.params.id, req.user.id]
    );
    if (reg.length === 0) return res.status(404).json({ message: 'Registration not found' });

    await pool.query(
      'DELETE FROM Registration WHERE registration_id = ? AND student_id = ?',
      [req.params.id, req.user.id]
    );

    // Decrement current_participants if the registration was confirmed
    if (reg[0].status === 'confirmed') {
      await pool.query(
        'UPDATE Event SET current_participants = GREATEST(current_participants - 1, 0) WHERE event_id = ?',
        [reg[0].event_id]
      );
    }

    res.json({ message: 'Registration deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const adminDeleteRegistration = async (req, res) => {
  try {
    // Get event_id before deleting so we can decrement the count
    const [reg] = await pool.query(
      'SELECT event_id, status FROM Registration WHERE registration_id = ?',
      [req.params.id]
    );
    if (reg.length === 0) return res.status(404).json({ message: 'Registration not found' });

    await pool.query('DELETE FROM Registration WHERE registration_id = ?', [req.params.id]);

    // Decrement current_participants if the registration was confirmed
    if (reg[0].status === 'confirmed') {
      await pool.query(
        'UPDATE Event SET current_participants = GREATEST(current_participants - 1, 0) WHERE event_id = ?',
        [reg[0].event_id]
      );
    }

    res.json({ message: 'Registration deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllRegistrations = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, s.name AS student_name, s.email, e.name AS event_name
      FROM Registration r
      JOIN Student s ON r.student_id = s.student_id
      JOIN Event e ON r.event_id = e.event_id
      ORDER BY r.registered_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerForEvent, getMyRegistrations, cancelRegistration, deleteRegistration, adminDeleteRegistration, getAllRegistrations };
