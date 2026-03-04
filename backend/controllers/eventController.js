const pool = require('../config/db');

const getAllEvents = async (req, res) => {
  try {
    const [events] = await pool.query(`
      SELECT e.*, c.name AS category_name,
        (SELECT COUNT(*) FROM Registration r WHERE r.event_id = e.event_id AND r.status = 'confirmed') AS registered_count
      FROM Event e
      LEFT JOIN Category c ON e.category_id = c.category_id
      ORDER BY e.date ASC
    `);
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getEventById = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, c.name AS category_name
      FROM Event e
      LEFT JOIN Category c ON e.category_id = c.category_id
      WHERE e.event_id = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Event not found' });

    const [sponsors] = await pool.query(`
      SELECT s.name, s.tier, s.logo_url, es.sponsorship_amount
      FROM Sponsor s
      JOIN Event_Sponsor es ON s.sponsor_id = es.sponsor_id
      WHERE es.event_id = ?
    `, [req.params.id]);

    res.json({ ...rows[0], sponsors });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const createEvent = async (req, res) => {
  const { name, description, category_id, date, time, venue, max_participants, prize_pool, image_url } = req.body;
  if (!name || !date || !max_participants) {
    return res.status(400).json({ message: 'Name, date, and max_participants are required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO Event (name, description, category_id, date, time, venue, max_participants, prize_pool, image_url) VALUES (?,?,?,?,?,?,?,?,?)',
      [name, description, category_id, date, time, venue, max_participants, prize_pool, image_url]
    );
    res.status(201).json({ message: 'Event created', event_id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateEvent = async (req, res) => {
  const { name, description, category_id, date, time, venue, max_participants, prize_pool, status, image_url } = req.body;
  try {
    await pool.query(
      'UPDATE Event SET name=?, description=?, category_id=?, date=?, time=?, venue=?, max_participants=?, prize_pool=?, status=?, image_url=? WHERE event_id=?',
      [name, description, category_id, date, time, venue, max_participants, prize_pool, status, image_url, req.params.id]
    );
    res.json({ message: 'Event updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    await pool.query('DELETE FROM Event WHERE event_id = ?', [req.params.id]);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getEventReport = async (req, res) => {
  try {
    const [report] = await pool.query('SELECT * FROM Event_Report');
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent, getEventReport };
