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

const addSponsorContribution = async (req, res) => {
  const { event_id, sponsor_id, additional_amount } = req.body;
  const amount = Number(additional_amount);

  if (!event_id || !sponsor_id || Number.isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Valid event_id, sponsor_id, and additional_amount are required' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE Event_Sponsor SET sponsorship_amount = COALESCE(sponsorship_amount, 0) + ? WHERE event_id = ? AND sponsor_id = ?',
      [amount, event_id, sponsor_id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'No existing sponsor contribution found for this event' });
    }

    res.json({ message: 'Sponsor contribution updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteSponsor = async (req, res) => {
  const { id } = req.params;
  const forceDelete = req.query.force === 'true';
  try {
    const [linkedRows] = await pool.query(
      'SELECT COUNT(*) AS linked_count FROM Event_Sponsor WHERE sponsor_id = ?',
      [id]
    );
    const linkedCount = linkedRows?.[0]?.linked_count || 0;

    if (linkedCount > 0 && !forceDelete) {
      return res.status(409).json({
        message: 'Sponsor has active contributions. Confirm force delete to proceed.',
        requiresForce: true,
        linkedCount
      });
    }

    const [result] = await pool.query('DELETE FROM Sponsor WHERE sponsor_id = ?', [id]);
    if (!result.affectedRows) {
      return res.status(404).json({ message: 'Sponsor not found' });
    }
    res.json({ message: 'Sponsor deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addSponsor, getAllSponsors, linkSponsorToEvent, addSponsorContribution, deleteSponsor };
