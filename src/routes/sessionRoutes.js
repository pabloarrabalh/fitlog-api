const express = require('express');
const sessionController = require('../controllers/sessionController');

const router = express.Router();

router.post('/', sessionController.createSession);
router.get('/', sessionController.listSessions);
router.get('/:sessionId', sessionController.getSessionById);
router.patch('/:sessionId', sessionController.updateSession);
router.delete('/:sessionId', sessionController.deleteSession);

module.exports = router;
