const express = require('express');
const routineController = require('../controllers/routineController');
const validate = require('../middlewares/validate');
const { createRoutineSchema, updateRoutineSchema } = require('../validators/routineSchemas');

const router = express.Router();

router.post('/', validate(createRoutineSchema), routineController.createRoutine);
router.get('/', routineController.listRoutines);
router.get('/:routineId', routineController.getRoutineById);
router.patch('/:routineId', validate(updateRoutineSchema), routineController.updateRoutine);
router.delete('/:routineId', routineController.deleteRoutine);

module.exports = router;
