const express = require('express');
const exerciseController = require('../controllers/exerciseController');

const router = express.Router();

router.get('/', exerciseController.listExercises);
router.get('/:exerciseId', exerciseController.getExerciseById);
router.post('/', exerciseController.createExercise);
router.patch('/:exerciseId', exerciseController.updateExercise);
router.delete('/:exerciseId', exerciseController.deleteExercise);

module.exports = router;
