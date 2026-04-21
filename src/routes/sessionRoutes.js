const express = require('express');
const sessionController = require('../controllers/sessionController');
const authMiddleware = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { startSessionSchema, addSetSchema, completeSessionSchema } = require('../validators/sessionSchemas');

const router = express.Router();

router.use(authMiddleware);

router.post('/', validate(startSessionSchema), sessionController.createSession);
router.get('/', sessionController.listSessions);
router.get('/:sessionId', sessionController.getSessionById);
router.patch('/:sessionId', sessionController.updateSession);
router.delete('/:sessionId', sessionController.deleteSession);
router.post('/:sessionId/entries/:entryId/sets', validate(addSetSchema), sessionController.addSetToEntry);
router.post('/:sessionId/complete', validate(completeSessionSchema), sessionController.completeSession);

module.exports = router;