const express = require('express');
const router = express.Router();
const { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent, getEventReport } = require('../controllers/eventController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', getAllEvents);
router.get('/report', authMiddleware, adminMiddleware, getEventReport);
router.get('/:id', getEventById);
router.post('/', authMiddleware, adminMiddleware, createEvent);
router.put('/:id', authMiddleware, adminMiddleware, updateEvent);
router.delete('/:id', authMiddleware, adminMiddleware, deleteEvent);

module.exports = router;
