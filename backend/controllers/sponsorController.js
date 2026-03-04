const pool = require('../config/db');

const addSponsor = async (req, res) => {
  const { name, contact_email, contact_phone, tier, website, logo_url } = req.body;
  if (!name) return res.status(400).json({ message: 'Sponsor name is required' });
  try {
    const [result] = await pool.query(
      'INSERT INTO Sponsor (name, contact_email, contact_phone, tier, website, logo_url) VALUES (?,?,?,?,?,?)',
      [name, contact_email, contact_phone, tier || 'silver', website, logo_url]
    );
    res.status(201).json({ message: 'Sponsor added', sponsor_id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllSponsors = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Sponsor_Event_Summary');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const linkSponsorToEvent = async (req, res) => {
  const { event_id, sponsor_id, sponsorship_amount } = req.body;
  try {
    await pool.query(
      'INSERT INTO Event_Sponsor (event_id, sponsor_id, sponsorship_amount) VALUES (?,?,?)',
      [event_id, sponsor_id, sponsorship_amount]
    );
    res.status(201).json({ message: 'Sponsor linked to event' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addSponsor, getAllSponsors, linkSponsorToEvent };
