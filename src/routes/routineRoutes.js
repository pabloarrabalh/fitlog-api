const express = require('express');
const routineController = require('../controllers/routineController');
const authMiddleware = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createRoutineSchema, updateRoutineSchema } = require('../validators/routineSchemas');

const router = express.Router();

router.use(authMiddleware);

router.post('/', validate(createRoutineSchema), routineController.createRoutine);
router.get('/', routineController.listRoutines);
router.get('/:routineId', routineController.getRoutineById);
router.patch('/:routineId', validate(updateRoutineSchema), routineController.updateRoutine);
router.delete('/:routineId', routineController.deleteRoutine);

module.exports = router;
