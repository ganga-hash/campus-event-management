const express = require('express');
const router = express.Router();
const { registerForEvent, getMyRegistrations, cancelRegistration, deleteRegistration, adminDeleteRegistration, getAllRegistrations } = require('../controllers/registrationController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, registerForEvent);
router.get('/my', authMiddleware, getMyRegistrations);
router.put('/:id/cancel', authMiddleware, cancelRegistration);
router.delete('/:id', authMiddleware, deleteRegistration);
router.delete('/admin/:id', authMiddleware, adminMiddleware, adminDeleteRegistration);
router.get('/all', authMiddleware, adminMiddleware, getAllRegistrations);

module.exports = router;
