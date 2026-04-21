const mongoose = require('mongoose');
const Routine = require('../models/Routine');
const WorkoutSession = require('../models/WorkoutSession');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const createSession = asyncHandler(async (req, res) => {
  const { routineId, exercises = [], user, objective, notes } = req.body;
  let sessionObjective = objective || 'hypertrophy';

  if (!user) {
    throw new ApiError(400, 'user is required');
  }

  let entries = exercises;

  if (routineId) {
    if (!mongoose.isValidObjectId(routineId)) {
      throw new ApiError(400, 'Invalid routineId');
    }

    const routine = await Routine.findById(routineId).populate('exercises.exercise', 'name primaryMuscles equipment');

    if (!routine) {
      throw new ApiError(404, 'Routine not found');
    }

    sessionObjective = objective || routine.objective || 'hypertrophy';

    entries = routine.exercises.map((item) => ({
      exercise: item.exercise,
      order: item.order,
      plannedSets: item.targetSets,
      plannedRepsMin: item.targetRepsMin,
      plannedRepsMax: item.targetRepsMax,
      plannedWeightKg: item.targetWeightKg || 0,
      restSeconds: item.restSeconds || 90,
      notes: item.notes || '',
      performedSets: []
    }));
  } else {
    entries = entries.map((item) => ({
      ...item,
      performedSets: item.performedSets || []
    }));
  }

  const session = await WorkoutSession.create({
    user,
    routine: routineId || null,
    objective: sessionObjective,
    notes: notes || '',
    entries,
    status: 'in_progress'
  });

  res.status(201).json({
    success: true,
    data: session
  });
});

const listSessions = asyncHandler(async (req, res) => {
  const { user } = req.query;
  const filter = {};

  if (user) {
    filter.user = user;
  }

  const sessions = await WorkoutSession.find(filter)
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

const addSetToEntry = asyncHandler(async (req, res) => {
  const { sessionId, entryId } = req.params;

  if (!mongoose.isValidObjectId(sessionId) || !mongoose.isValidObjectId(entryId)) {
    throw new ApiError(400, 'Invalid sessionId or entryId');
  }

  const session = await WorkoutSession.findById(sessionId);

  if (!session) {
    throw new ApiError(404, 'Session not found');
  }

  const entry = session.entries.id(entryId);
  if (!entry) {
    throw new ApiError(404, 'Exercise entry not found in session');
  }

  entry.performedSets.push(req.body);
  await session.save();

  res.status(200).json({
    success: true,
    data: session
  });
});

const completeSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  if (!mongoose.isValidObjectId(sessionId)) {
    throw new ApiError(400, 'Invalid sessionId');
  }

  const session = await WorkoutSession.findById(sessionId);

  if (!session) {
    throw new ApiError(404, 'Session not found');
  }

  session.status = 'completed';
  session.completedAt = new Date();
  session.notes = req.body.notes || session.notes;
  session.totalVolumeKg = session.entries.reduce((total, entry) => {
    return total + entry.performedSets.reduce((setTotal, set) => setTotal + set.reps * set.weightKg, 0);
  }, 0);

  await session.save();

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
  deleteSession,
  addSetToEntry,
  completeSession
};
