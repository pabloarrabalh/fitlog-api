const express = require('express');
const exerciseController = require('../controllers/exerciseController');
const authMiddleware = require('../middlewares/auth');
const optionalAuth = require('../middlewares/optionalAuth');
const requireAdmin = require('../middlewares/requireAdmin');
const validate = require('../middlewares/validate');
const { exerciseQuerySchema, createExerciseSchema, updateExerciseSchema } = require('../validators/exerciseSchemas');

const router = express.Router();

router.get('/', optionalAuth, validate(exerciseQuerySchema, 'query'), exerciseController.listExercises);
router.get('/mine', authMiddleware, exerciseController.listMyExercises);
router.get('/pending', authMiddleware, requireAdmin, exerciseController.listPendingExercises);
router.get('/:exerciseId', optionalAuth, exerciseController.getExerciseById);
router.post('/', authMiddleware, validate(createExerciseSchema), exerciseController.createExercise);
router.patch('/:exerciseId', authMiddleware, validate(updateExerciseSchema), exerciseController.updateExercise);
router.delete('/:exerciseId', authMiddleware, exerciseController.deleteExercise);
router.patch('/:exerciseId/approve', authMiddleware, requireAdmin, exerciseController.approveExercise);
router.patch('/:exerciseId/reject', authMiddleware, requireAdmin, exerciseController.rejectExercise);

module.exports = router;
