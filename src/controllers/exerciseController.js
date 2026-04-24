const asyncHandler = require('../utils/asyncHandler');
const exerciseService = require('../services/exerciseService');
const { createExerciseSchema, updateExerciseSchema } = require('../validators/exerciseSchemas');

const listExercises = asyncHandler(async (req, res) => {
  const userRole = req.user?.role || null;
  const items = await exerciseService.listExercises(userRole);

  res.status(200).json({
    success: true,
    data: items
  });
});

const getExerciseById = asyncHandler(async (req, res) => {
  const { exerciseId } = req.params;
  const exercise = await exerciseService.getExerciseById(
    exerciseId,
    req.user?._id,
    req.user?.role
  );

  res.status(200).json({
    success: true,
    data: exercise
  });
});

const createExercise = asyncHandler(async (req, res) => {
  const cleanData = createExerciseSchema.parse(req.body);

  const exercise = await exerciseService.createExercise(
    cleanData,
    req.user._id,
    req.user.role
  );

  res.status(201).json({
    success: true,
    data: exercise
  });
});

const updateExercise = asyncHandler(async (req, res) => {
  const { exerciseId } = req.params;
  const cleanData = updateExerciseSchema.parse(req.body);

  const savedExercise = await exerciseService.updateExercise(
    exerciseId,
    cleanData,
    req.user._id,
    req.user.role
  );

  res.status(200).json({
    success: true,
    data: savedExercise
  });
});

const deleteExercise = asyncHandler(async (req, res) => {
  const { exerciseId } = req.params;
  const exercise = await exerciseService.deleteExercise(
    exerciseId,
    req.user._id,
    req.user.role
  );

  res.status(200).json({
    success: true,
    data: exercise
  });
});

const listMyExercises = asyncHandler(async (req, res) => {
  const items = await exerciseService.listMyExercises(req.user._id);

  res.status(200).json({
    success: true,
    data: items
  });
});

const listPendingExercises = asyncHandler(async (req, res) => {
  const items = await exerciseService.listPendingExercises();

  res.status(200).json({
    success: true,
    data: items
  });
});

const approveExercise = asyncHandler(async (req, res) => {
  const { exerciseId } = req.params;
  const savedExercise = await exerciseService.approveExercise(exerciseId, req.user._id);

  res.status(200).json({
    success: true,
    data: savedExercise
  });
});

const rejectExercise = asyncHandler(async (req, res) => {
  const { exerciseId } = req.params;
  const result = await exerciseService.rejectExercise(exerciseId);

  res.status(200).json({
    success: true,
    data: result
  });
});

module.exports = {
  listExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  listMyExercises,
  listPendingExercises,
  approveExercise,
  rejectExercise
};
