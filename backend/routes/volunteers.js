const express = require('express');
const router = express.Router();
const { registerVolunteer, applyVolunteerEvent, assignVolunteer, getMyAssignments, deleteMyAssignment, adminDeleteAssignment, getAllVolunteers, getAllAssignments } = require('../controllers/volunteerController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/register', authMiddleware, registerVolunteer);
router.post('/apply-event', authMiddleware, applyVolunteerEvent);
router.post('/assign', authMiddleware, adminMiddleware, assignVolunteer);
router.get('/my-assignments', authMiddleware, getMyAssignments);
router.delete('/my-assignments/:id', authMiddleware, deleteMyAssignment);
router.delete('/assignments/:id', authMiddleware, adminMiddleware, adminDeleteAssignment);
router.get('/assignments/all', authMiddleware, adminMiddleware, getAllAssignments);
router.get('/', authMiddleware, adminMiddleware, getAllVolunteers);

module.exports = router;
