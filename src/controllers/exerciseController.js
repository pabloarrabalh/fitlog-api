const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const listExercises = asyncHandler(async (req, res) => {
  const filter = req.user && req.user.role === 'admin'
    ? {}
    : { visibility: 'public', approvalStatus: 'approved' };

  const items = await Exercise.find(filter).sort({ name: 1 });

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

  const isOwner = req.user && exercise.createdBy && String(exercise.createdBy) === String(req.user._id);
  const isAdmin = req.user && req.user.role === 'admin';
  const isPublicApproved = exercise.visibility === 'public' && exercise.approvalStatus === 'approved';

  if (!isPublicApproved && !isOwner && !isAdmin) {
    throw new ApiError(404, 'Exercise not found');
  }

  res.status(200).json({
    success: true,
    data: exercise
  });
});

const createExercise = asyncHandler(async (req, res) => {
  const visibility = req.body.visibility || 'public';
  const isAdmin = req.user.role === 'admin';

  const exercise = await Exercise.create({
    ...req.body,
    visibility,
    approvalStatus: isAdmin || visibility === 'private' ? 'approved' : 'pending',
    reviewedBy: isAdmin || visibility === 'private' ? req.user._id : null,
    reviewedAt: isAdmin || visibility === 'private' ? new Date() : null,
    createdBy: req.user._id
  });

  res.status(201).json({
    success: true,
    data: exercise
  });
});

const updateExercise = asyncHandler(async (req, res) => {
  const { exerciseId } = req.params;

  if (!mongoose.isValidObjectId(exerciseId)) {
    throw new ApiError(400, 'Invalid exerciseId');
  }

  const exercise = await Exercise.findById(exerciseId);

  if (!exercise) {
    throw new ApiError(404, 'Exercise not found');
  }

  const isOwner = String(exercise.createdBy) === String(req.user._id);
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'You are not allowed to modify this exercise');
  }

  const nextVisibility = req.body.visibility || exercise.visibility;
  Object.assign(exercise, req.body);

  if (nextVisibility === 'public' && !isAdmin && exercise.approvalStatus !== 'approved') {
    exercise.approvalStatus = 'pending';
    exercise.reviewedBy = null;
    exercise.reviewedAt = null;
  }

  const savedExercise = await exercise.save();

  res.status(200).json({
    success: true,
    data: savedExercise
  });
});

const deleteExercise = asyncHandler(async (req, res) => {
  const { exerciseId } = req.params;

  if (!mongoose.isValidObjectId(exerciseId)) {
    throw new ApiError(400, 'Invalid exerciseId');
  }

  const exercise = await Exercise.findById(exerciseId);

  if (!exercise) {
    throw new ApiError(404, 'Exercise not found');
  }

  const isOwner = String(exercise.createdBy) === String(req.user._id);
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'You are not allowed to delete this exercise');
  }

  await exercise.deleteOne();

  res.status(200).json({
    success: true,
    data: exercise
  });
});

const listMyExercises = asyncHandler(async (req, res) => {
  const items = await Exercise.find({
    createdBy: req.user._id,
    approvalStatus: { $ne: 'rejected' }
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: items
  });
});

const listPendingExercises = asyncHandler(async (req, res) => {
  const items = await Exercise.find({ visibility: 'public', approvalStatus: 'pending' }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: items
  });
});

const approveExercise = asyncHandler(async (req, res) => {
  const { exerciseId } = req.params;

  if (!mongoose.isValidObjectId(exerciseId)) {
    throw new ApiError(400, 'Invalid exerciseId');
  }

  const exercise = await Exercise.findById(exerciseId);

  if (!exercise) {
    throw new ApiError(404, 'Exercise not found');
  }

  exercise.approvalStatus = 'approved';
  exercise.visibility = 'public';
  exercise.reviewedBy = req.user._id;
  exercise.reviewedAt = new Date();

  const savedExercise = await exercise.save();

  res.status(200).json({
    success: true,
    data: savedExercise
  });
});

const rejectExercise = asyncHandler(async (req, res) => {
  const { exerciseId } = req.params;

  if (!mongoose.isValidObjectId(exerciseId)) {
    throw new ApiError(400, 'Invalid exerciseId');
  }

  const exercise = await Exercise.findById(exerciseId);

  if (!exercise) {
    throw new ApiError(404, 'Exercise not found');
  }

  await exercise.deleteOne();

  res.status(200).json({
    success: true,
    data: { deleted: true, exerciseId }
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
