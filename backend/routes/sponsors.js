const express = require('express');
const router = express.Router();
const { addSponsor, getAllSponsors, linkSponsorToEvent } = require('../controllers/sponsorController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', getAllSponsors);
router.post('/', authMiddleware, adminMiddleware, addSponsor);
router.post('/link', authMiddleware, adminMiddleware, linkSponsorToEvent);

module.exports = router;
