const express = require('express');
const router = express.Router();
const { addSponsor, getAllSponsors, linkSponsorToEvent, addSponsorContribution, deleteSponsor } = require('../controllers/sponsorController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', getAllSponsors);
router.post('/', authMiddleware, adminMiddleware, addSponsor);
router.post('/link', authMiddleware, adminMiddleware, linkSponsorToEvent);
router.post('/contribution/add', authMiddleware, adminMiddleware, addSponsorContribution);
router.delete('/:id', authMiddleware, adminMiddleware, deleteSponsor);

module.exports = router;
