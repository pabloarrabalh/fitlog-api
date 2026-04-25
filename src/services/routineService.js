const mongoose = require('mongoose');
const Routine = require('../models/Routine');
const ApiError = require('../utils/ApiError');

/**
 * Valida si un ID es un ObjectId válido de MongoDB
 */
const validateObjectId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid routineId');
  }
};

/**
 * Verifica que el usuario es propietario de la rutina
 */
const checkRoutineOwnership = (routine, userId) => {
  if (String(routine.user) !== String(userId)) {
    throw new ApiError(403, 'You are not allowed to modify this routine');
  }
};

/**
 * Crea una nueva rutina
 * @param {Object} cleanData - Datos sanitizados por Zod (name, objective, description, exercises)
 * @param {string} userId - ID del usuario propietario
 * @returns {Object} Rutina creada
 */
const createRoutine = async (cleanData, userId) => {
  const routine = await Routine.create({
    ...cleanData,
    user: userId
  });

  return routine;
};

/**
 * Lista todas las rutinas del usuario actual
 * @param {string} userId - ID del usuario
 * @returns {Array} Rutinas del usuario
 */
const listRoutines = async (userId) => {
  const routines = await Routine.find({ user: userId })
    .sort({ updatedAt: -1 })
    .populate('exercises.exercise', 'name primaryMuscles equipment');

  return routines;
};

/**
 * Obtiene una rutina específica por ID (solo si es propietario)
 * @param {string} routineId - ID de la rutina
 * @param {string} userId - ID del usuario
 * @returns {Object} Rutina encontrada
 */
const getRoutineById = async (routineId, userId) => {
  validateObjectId(routineId);

  const routine = await Routine.findOne({
    _id: routineId,
    user: userId
  }).populate(
    'exercises.exercise',
    'name primaryMuscles secondaryMuscles equipment movementPattern'
  );

  if (!routine) {
    throw new ApiError(404, 'Routine not found');
  }

  return routine;
};

/**
 * Actualiza una rutina existente
 * @param {string} routineId - ID de la rutina
 * @param {Object} cleanData - Datos sanitizados por Zod (solo campos permitidos)
 * @param {string} userId - ID del usuario
 * @returns {Object} Rutina actualizada
 */
const updateRoutine = async (routineId, cleanData, userId) => {
  validateObjectId(routineId);
  const updatedRoutine = await Routine.findOneAndUpdate(
    { _id: routineId, user: userId },
    { ...cleanData },
    { new: true, runValidators: true }
  ).populate(
    'exercises.exercise',
    'name primaryMuscles secondaryMuscles equipment movementPattern'
  );

  if (!updatedRoutine) {
    throw new ApiError(404, 'Routine not found or you do not have permissions');
  }

  return updatedRoutine;
};
/**
 * Elimina una rutina
 * @param {string} routineId - ID de la rutina
 * @param {string} userId - ID del usuario
 * @returns {Object} Rutina eliminada
 */
const deleteRoutine = async (routineId, userId) => {
    validateObjectId(routineId);
    const deletedRoutine = await Routine.findOneAndDelete({
        _id: routineId,
        user: userId
    });
    if (!deletedRoutine) {
        throw new ApiError(404, 'Routine not found or you do not have permissions');
    }
    return deletedRoutine;
};

module.exports = {
  createRoutine,
  listRoutines,
  getRoutineById,
  updateRoutine,
  deleteRoutine
};
