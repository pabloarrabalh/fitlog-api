const express = require('express');
const exerciseController = require('../controllers/exerciseController');
const validate = require('../middlewares/validate');
const { exerciseQuerySchema, createExerciseSchema, updateExerciseSchema } = require('../validators/exerciseSchemas');

const router = express.Router();

router.get('/', validate(exerciseQuerySchema, 'query'), exerciseController.listExercises);
router.get('/:exerciseId', exerciseController.getExerciseById);
router.post('/', validate(createExerciseSchema), exerciseController.createExercise);
router.patch('/:exerciseId', validate(updateExerciseSchema), exerciseController.updateExercise);
router.delete('/:exerciseId', exerciseController.deleteExercise);

module.exports = router;
