const mongoose = require('mongoose');
const Routine = require('../models/Routine');
const WorkoutSession = require('../models/WorkoutSession');
const ApiError = require('../utils/ApiError');

/**
 * Valida si un ID es un ObjectId válido de MongoDB
 */
const validateObjectId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid id');
  }
};

/**
 * Verifica que el usuario es propietario de la sesión
 */
const checkSessionOwnership = async (sessionId, userId) => {
  const session = await WorkoutSession.findOne({ _id: sessionId, user: userId });

  if (!session) {
    throw new ApiError(404, 'Session not found');
  }

  return session;
};

/**
 * Transforma ejercicios de una rutina a formato de entry de sesión
 */
const transformRoutineExercisesToEntries = (routineExercises) => {
  return routineExercises.map((item) => ({
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
};

/**
 * Transforma ejercicios ad-hoc a formato de entry
 */
const transformAdHocExercisesToEntries = (adHocExercises) => {
  return adHocExercises.map((item) => ({
    ...item,
    performedSets: []
  }));
};

/**
 * Calcula el volumen total de la sesión (suma de todos los sets realizados)
 */
const calculateSessionVolume = (entries) => {
  return entries.reduce((total, entry) => {
    const entryVolume = entry.performedSets.reduce(
      (setTotal, set) => setTotal + (set.reps * set.weightKg),
      0
    );
    return total + entryVolume;
  }, 0);
};

/**
 * Crea una nueva sesión de entrenamiento
 * @param {Object} cleanData - Datos sanitizados por Zod
 * @param {string} userId - ID del usuario propietario
 * @returns {Object} Sesión creada
 */
const createSession = async (cleanData, userId) => {
  const { routineId, objective, notes, exercises } = cleanData;
  let sessionObjective = objective || 'hypertrophy';
  let entries = exercises || [];

  // Si se proporciona routineId, obtener ejercicios de la rutina
  if (routineId) {
    validateObjectId(routineId);

    // Operación atómica: obtener rutina del usuario
    const routine = await Routine.findOne(
      { _id: routineId, user: userId }
    ).populate('exercises.exercise', 'name primaryMuscles equipment');

    if (!routine) {
      throw new ApiError(404, 'Routine not found');
    }

    sessionObjective = objective || routine.objective || 'hypertrophy';
    entries = transformRoutineExercisesToEntries(routine.exercises);
  } else if (entries.length > 0) {
    // Usar ejercicios ad-hoc proporcionados
    entries = transformAdHocExercisesToEntries(entries);
  }

  // Crear sesión atómicamente
  const session = await WorkoutSession.create({
    user: userId,
    routine: routineId || null,
    objective: sessionObjective,
    notes: notes || '',
    entries,
    status: 'in_progress'
  });

  return session;
};

/**
 * Lista todas las sesiones del usuario
 * @param {string} userId - ID del usuario
 * @returns {Array} Sesiones del usuario
 */
const listSessions = async (userId) => {
  const sessions = await WorkoutSession.find({ user: userId })
    .sort({ startedAt: -1 })
    .populate('entries.exercise', 'name primaryMuscles')
    .populate('routine', 'name objective');

  return sessions;
};

/**
 * Obtiene una sesión específica por ID (solo si es propietario)
 * @param {string} sessionId - ID de la sesión
 * @param {string} userId - ID del usuario
 * @returns {Object} Sesión encontrada
 */
const getSessionById = async (sessionId, userId) => {
  validateObjectId(sessionId);

  const session = await WorkoutSession.findOne({
    _id: sessionId,
    user: userId
  })
    .populate('entries.exercise', 'name primaryMuscles secondaryMuscles equipment')
    .populate('routine', 'name objective');

  if (!session) {
    throw new ApiError(404, 'Session not found');
  }

  return session;
};

/**
 * Actualiza una sesión existente (operación atómica)
 * @param {string} sessionId - ID de la sesión
 * @param {Object} cleanData - Datos sanitizados por Zod (solo campos permitidos)
 * @param {string} userId - ID del usuario
 * @returns {Object} Sesión actualizada
 */
const updateSession = async (sessionId, cleanData, userId) => {
  validateObjectId(sessionId);

  // Operación atómica: actualizar solo basado en { _id, user }
  const session = await WorkoutSession.findOneAndUpdate(
    { _id: sessionId, user: userId },
    { ...cleanData },
    { new: true, runValidators: true }
  );

  if (!session) {
    throw new ApiError(404, 'Session not found');
  }

  return session;
};

/**
 * Elimina una sesión (operación atómica)
 * @param {string} sessionId - ID de la sesión
 * @param {string} userId - ID del usuario
 * @returns {Object} Sesión eliminada
 */
const deleteSession = async (sessionId, userId) => {
  validateObjectId(sessionId);
  const ownedSession = await checkSessionOwnership(sessionId, userId);

  if (ownedSession.status === 'in_progress') {
    throw new ApiError(400, 'Active sessions cannot be deleted');
  }

  const session = await WorkoutSession.findOneAndDelete({
    _id: sessionId,
    user: userId
  });

  if (!session) {
    throw new ApiError(404, 'Session not found');
  }

  return session;
};

/**
 * Agrega un set a un ejercicio específico de la sesión (operación atómica)
 * @param {string} sessionId - ID de la sesión
 * @param {string} entryId - ID del entry (ejercicio) dentro de la sesión
 * @param {Object} cleanData - Datos sanitizados por Zod del set
 * @param {string} userId - ID del usuario
 * @returns {Object} Sesión actualizada
 */
const addSetToEntry = async (sessionId, entryId, cleanData, userId) => {
  validateObjectId(sessionId);
  validateObjectId(entryId);
  const session = await WorkoutSession.findOneAndUpdate(
    {
      _id: sessionId,
      user: userId,
      'entries._id': entryId
    },
    {
      $push: {
        'entries.$.performedSets': cleanData
      }
    },
    { new: true, runValidators: true }
  );

  if (!session) {
    throw new ApiError(404, 'Session or exercise entry not found');
  }

  return session;
};

/**
 * Completa una sesión y calcula el volumen total (operación atómica)
 * @param {string} sessionId - ID de la sesión
 * @param {Object} cleanData - { notes } sanitizado por Zod
 * @param {string} userId - ID del usuario
 * @returns {Object} Sesión completada
 */
const completeSession = async (sessionId, cleanData, userId) => {
  validateObjectId(sessionId);
  const session = await checkSessionOwnership(sessionId, userId);
  const totalVolumeKg = calculateSessionVolume(session.entries);
  const completedSession = await WorkoutSession.findOneAndUpdate(
    { _id: sessionId, user: userId },
    {
      status: 'completed',
      completedAt: new Date(),
      notes: cleanData.notes || session.notes,
      totalVolumeKg
    },
    { new: true, runValidators: true }
  );

  return completedSession;
};

/**
 * Cancela una sesión activa 
 * @param {string} sessionId - ID de la sesión
 * @param {string} userId - ID del usuario
 * @returns {Object} Sesión cancelada
 */
const cancelSession = async (sessionId, userId) => {
  validateObjectId(sessionId);
  const ownedSession = await checkSessionOwnership(sessionId, userId);

  if (ownedSession.status !== 'in_progress') {
    throw new ApiError(400, 'Only active sessions can be canceled');
  }

  const session = await WorkoutSession.findOneAndDelete({
    _id: sessionId,
    user: userId,
    status: 'in_progress'
  });

  if (!session) {
    throw new ApiError(404, 'Session not found');
  }

  return session;
};

module.exports = {
  createSession,
  listSessions,
  getSessionById,
  updateSession,
  deleteSession,
  addSetToEntry,
  completeSession,
  cancelSession
};

