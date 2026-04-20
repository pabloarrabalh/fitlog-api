const mongoose = require('mongoose');
const WorkoutSession = require('../models/WorkoutSession');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const createSession = asyncHandler(async (req, res) => {
  const session = await WorkoutSession.create(req.body);

  res.status(201).json({
    success: true,
    data: session
  });
});

const listSessions = asyncHandler(async (req, res) => {
  const sessions = await WorkoutSession.find()
    .sort({ startedAt: -1 })
    .populate('entries.exercise', 'name primaryMuscles')
    .populate('routine', 'name objective');

  res.status(200).json({
    success: true,
    data: sessions
  });
});

const getSessionById = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  if (!mongoose.isValidObjectId(sessionId)) {
    throw new ApiError(400, 'Invalid sessionId');
  }

  const session = await WorkoutSession.findById(sessionId)
    .populate('entries.exercise', 'name primaryMuscles secondaryMuscles equipment')
    .populate('routine', 'name objective');

  if (!session) {
    throw new ApiError(404, 'Session not found');
  }

  res.status(200).json({
    success: true,
    data: session
  });
});

const updateSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  if (!mongoose.isValidObjectId(sessionId)) {
    throw new ApiError(400, 'Invalid sessionId');
  }

  const session = await WorkoutSession.findByIdAndUpdate(sessionId, req.body, {
    new: true,
    runValidators: true
  });

  if (!session) {
    throw new ApiError(404, 'Session not found');
  }

  res.status(200).json({
    success: true,
    data: session
  });
});

const deleteSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  if (!mongoose.isValidObjectId(sessionId)) {
    throw new ApiError(400, 'Invalid sessionId');
  }

  const session = await WorkoutSession.findByIdAndDelete(sessionId);

  if (!session) {
    throw new ApiError(404, 'Session not found');
  }

  res.status(200).json({
    success: true,
    data: session
  });
});

module.exports = {
  createSession,
  listSessions,
  getSessionById,
  updateSession,
  deleteSession
};
