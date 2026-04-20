const mongoose = require('mongoose');
const Routine = require('../models/Routine');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const createRoutine = asyncHandler(async (req, res) => {
  const routine = await Routine.create(req.body);

  res.status(201).json({
    success: true,
    data: routine
  });
});

const listRoutines = asyncHandler(async (req, res) => {
  const routines = await Routine.find().sort({ updatedAt: -1 }).populate('exercises.exercise', 'name primaryMuscles equipment');

  res.status(200).json({
    success: true,
    data: routines
  });
});

const getRoutineById = asyncHandler(async (req, res) => {
  const { routineId } = req.params;

  if (!mongoose.isValidObjectId(routineId)) {
    throw new ApiError(400, 'Invalid routineId');
  }

  const routine = await Routine.findById(routineId).populate(
    'exercises.exercise',
    'name primaryMuscles secondaryMuscles equipment movementPattern'
  );

  if (!routine) {
    throw new ApiError(404, 'Routine not found');
  }

  res.status(200).json({
    success: true,
    data: routine
  });
});

const updateRoutine = asyncHandler(async (req, res) => {
  const { routineId } = req.params;

  if (!mongoose.isValidObjectId(routineId)) {
    throw new ApiError(400, 'Invalid routineId');
  }

  const routine = await Routine.findByIdAndUpdate(routineId, req.body, {
    new: true,
    runValidators: true
  });

  if (!routine) {
    throw new ApiError(404, 'Routine not found');
  }

  res.status(200).json({
    success: true,
    data: routine
  });
});

const deleteRoutine = asyncHandler(async (req, res) => {
  const { routineId } = req.params;

  if (!mongoose.isValidObjectId(routineId)) {
    throw new ApiError(400, 'Invalid routineId');
  }

  const routine = await Routine.findByIdAndDelete(routineId);

  if (!routine) {
    throw new ApiError(404, 'Routine not found');
  }

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
