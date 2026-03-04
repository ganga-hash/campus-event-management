const express = require('express');
const router = express.Router();
const { getDashboardStats, getRegistrationsPerEvent, getTopEvent, getVolunteerDistribution, getCategoryBreakdown } = require('../controllers/analyticsController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/stats', authMiddleware, adminMiddleware, getDashboardStats);
router.get('/registrations-per-event', authMiddleware, adminMiddleware, getRegistrationsPerEvent);
router.get('/top-event', authMiddleware, adminMiddleware, getTopEvent);
router.get('/volunteer-distribution', authMiddleware, adminMiddleware, getVolunteerDistribution);
router.get('/category-breakdown', authMiddleware, adminMiddleware, getCategoryBreakdown);

module.exports = router;
