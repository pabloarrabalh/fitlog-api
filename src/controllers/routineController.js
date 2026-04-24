const asyncHandler = require('../utils/asyncHandler');
const routineService = require('../services/routineService');
const { createRoutineSchema, updateRoutineSchema } = require('../validators/routineSchemas');

const createRoutine = asyncHandler(async (req, res) => {
  // Validar y sanitizar datos con Zod
  const cleanData = createRoutineSchema.parse(req.body);

  const routine = await routineService.createRoutine(cleanData, req.user._id);

  res.status(201).json({
    success: true,
    data: routine
  });
});

const listRoutines = asyncHandler(async (req, res) => {
  const routines = await routineService.listRoutines(req.user._id);

  res.status(200).json({
    success: true,
    data: routines
  });
});

const getRoutineById = asyncHandler(async (req, res) => {
  const { routineId } = req.params;

  const routine = await routineService.getRoutineById(routineId, req.user._id);

  res.status(200).json({
    success: true,
    data: routine
  });
});

const updateRoutine = asyncHandler(async (req, res) => {
  const { routineId } = req.params;

  // Validar y sanitizar datos con Zod
  const cleanData = updateRoutineSchema.parse(req.body);

  const routine = await routineService.updateRoutine(routineId, cleanData, req.user._id);

  res.status(200).json({
    success: true,
    data: routine
  });
});

const deleteRoutine = asyncHandler(async (req, res) => {
  const { routineId } = req.params;

  const routine = await routineService.deleteRoutine(routineId, req.user._id);

  res.status(200).json({
    success: true,
    data: routine
  });
});

module.exports = {
  createRoutine,
  listRoutines,
  getRoutineById,
  updateRoutine,
  deleteRoutine
};
