const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const listExercises = asyncHandler(async (req, res) => {
  const items = await Exercise.find().sort({ name: 1 });

  res.status(200).json({
    success: true,
    data: items
  });
});

const getExerciseById = asyncHandler(async (req, res) => {
  const { exerciseId } = req.params;

  if (!mongoose.isValidObjectId(exerciseId)) {
    throw new ApiError(400, 'Invalid exerciseId');
  }

  const exercise = await Exercise.findById(exerciseId);

  if (!exercise) {
    throw new ApiError(404, 'Exercise not found');
  }

  res.status(200).json({
    success: true,
    data: exercise
  });
});

const createExercise = asyncHandler(async (req, res) => {
  const exercise = await Exercise.create(req.body);

  res.status(201).json({
    success: true,
    data: exercise
  });
});

const updateExercise = asyncHandler(async (req, res) => {
  const { exerciseId } = req.params;

  const exercise = await Exercise.findByIdAndUpdate(exerciseId, req.body, {
    new: true,
    runValidators: true
  });

  if (!exercise) {
    throw new ApiError(404, 'Exercise not found');
  }

  res.status(200).json({
    success: true,
    data: exercise
  });
});

const deleteExercise = asyncHandler(async (req, res) => {
  const { exerciseId } = req.params;

  const exercise = await Exercise.findByIdAndDelete(exerciseId);

  if (!exercise) {
    throw new ApiError(404, 'Exercise not found');
  }

  res.status(200).json({
    success: true,
    data: exercise
  });
});

module.exports = {
  listExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise
};
