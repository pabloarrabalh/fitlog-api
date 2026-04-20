const express = require('express');
const routineController = require('../controllers/routineController');

const router = express.Router();

router.post('/', routineController.createRoutine);
router.get('/', routineController.listRoutines);
router.get('/:routineId', routineController.getRoutineById);
router.patch('/:routineId', routineController.updateRoutine);
router.delete('/:routineId', routineController.deleteRoutine);

module.exports = router;
