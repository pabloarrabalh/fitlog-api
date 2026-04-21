const express = require('express');
const sessionController = require('../controllers/sessionController');

const router = express.Router();

router.post('/', sessionController.createSession);
router.get('/', sessionController.listSessions);
router.get('/:sessionId', sessionController.getSessionById);
router.patch('/:sessionId', sessionController.updateSession);
router.delete('/:sessionId', sessionController.deleteSession);
router.post('/:sessionId/entries/:entryId/sets', sessionController.addSetToEntry);
router.post('/:sessionId/complete', sessionController.completeSession);

module.exports = router;