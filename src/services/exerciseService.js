const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');
const ApiError = require('../utils/ApiError');

/**
 * Valida si un ID es un ObjectId válido de MongoDB
 */
const validateObjectId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid exerciseId');
  }
};

/**
 * Verifica si un usuario puede acceder a un ejercicio (viewing/reading)
 */
const checkExerciseAccess = (exercise, userId, userRole) => {
  const isOwner = userId && exercise.createdBy && String(exercise.createdBy) === String(userId);
  const isAdmin = userRole === 'admin';
  const isPublicApproved = exercise.visibility === 'public' && exercise.approvalStatus === 'approved';

  if (!isPublicApproved && !isOwner && !isAdmin) {
    throw new ApiError(404, 'Exercise not found');
  }
};

/**
 * Verifica si un usuario puede modificar/eliminar un ejercicio
 */
const checkExerciseOwnership = (exercise, userId, userRole) => {
  const isOwner = String(exercise.createdBy) === String(userId);
  const isAdmin = userRole === 'admin';

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, 'You are not allowed to modify this exercise');
  }
};

/**
 * Lista todos los ejercicios disponibles (filtra por rol)
 */
const listExercises = async (userRole) => {
  const filter = userRole === 'admin'
    ? {}
    : { visibility: 'public', approvalStatus: 'approved' };

  const items = await Exercise.find(filter).sort({ name: 1 });
  return items;
};

/**
 * Obtiene un ejercicio específico por ID
 */
const getExerciseById = async (exerciseId, userId = null, userRole = null) => {
  validateObjectId(exerciseId);

  const exercise = await Exercise.findById(exerciseId);

  if (!exercise) {
    throw new ApiError(404, 'Exercise not found');
  }

  // Verificar permisos de acceso
  checkExerciseAccess(exercise, userId, userRole);

  return exercise;
};

/**
 * Crea un nuevo ejercicio
 * @param {Object} cleanData - Datos sanitizados por Zod (solo campos permitidos)
 * @param {string} userId - ID del usuario creador
 * @param {string} userRole - Rol del usuario
 * @returns {Object} Ejercicio creado
 */
const createExercise = async (cleanData, userId, userRole) => {
  const isAdmin = userRole === 'admin';
  const visibility = cleanData.visibility || 'public';

  // Zod ya sanitizó los datos, usamos spread operator sin restricciones
  const exercise = await Exercise.create({
    ...cleanData,
    visibility,
    approvalStatus: isAdmin || visibility === 'private' ? 'approved' : 'pending',
    reviewedBy: isAdmin || visibility === 'private' ? userId : null,
    reviewedAt: isAdmin || visibility === 'private' ? new Date() : null,
    createdBy: userId
  });

  return exercise;
};

/**
 * Actualiza un ejercicio existente
 * @param {string} exerciseId - ID del ejercicio
 * @param {Object} cleanData - Datos sanitizados por Zod (solo campos permitidos)
 * @param {string} userId - ID del usuario
 * @param {string} userRole - Rol del usuario
 * @returns {Object} Ejercicio actualizado
 */
const updateExercise = async (exerciseId, cleanData, userId, userRole) => {
  validateObjectId(exerciseId);

  const exercise = await Exercise.findById(exerciseId);

  if (!exercise) {
    throw new ApiError(404, 'Exercise not found');
  }

  checkExerciseOwnership(exercise, userId, userRole);

  const nextVisibility = cleanData.visibility || exercise.visibility;
  const isAdmin = userRole === 'admin';

  // Zod garantiza que cleanData solo contiene campos permitidos
  Object.assign(exercise, cleanData);

  // Si cambió a público y no es admin, resetear a pending
  if (nextVisibility === 'public' && !isAdmin && exercise.approvalStatus !== 'approved') {
    exercise.approvalStatus = 'pending';
    exercise.reviewedBy = null;
    exercise.reviewedAt = null;
  }

  const savedExercise = await exercise.save();
  return savedExercise;
};

/**
 * Elimina un ejercicio
 */
const deleteExercise = async (exerciseId, userId, userRole) => {
  validateObjectId(exerciseId);

  const exercise = await Exercise.findById(exerciseId);

  if (!exercise) {
    throw new ApiError(404, 'Exercise not found');
  }
  checkExerciseOwnership(exercise, userId, userRole);

  await exercise.deleteOne();

  return exercise;
};

/**
 * Lista ejercicios creados por el usuario actual
 */
const listMyExercises = async (userId) => {
  const items = await Exercise.find({
    createdBy: userId,
    approvalStatus: { $ne: 'rejected' }
  }).sort({ createdAt: -1 });

  return items;
};

/**
 * Lista ejercicios pendientes de aprobación (admin only)
 */
const listPendingExercises = async () => {
  const items = await Exercise.find({
    visibility: 'public',
    approvalStatus: 'pending'
  }).sort({ createdAt: -1 });

  return items;
};

/**
 * Aprueba un ejercicio (admin only)
 */
const approveExercise = async (exerciseId, userId) => {
  validateObjectId(exerciseId);

  const exercise = await Exercise.findById(exerciseId);

  if (!exercise) {
    throw new ApiError(404, 'Exercise not found');
  }

  exercise.approvalStatus = 'approved';
  exercise.visibility = 'public';
  exercise.reviewedBy = userId;
  exercise.reviewedAt = new Date();

  const savedExercise = await exercise.save();
  return savedExercise;
};

/**
 * Rechaza un ejercicio eliminándolo (admin only)
 */
const rejectExercise = async (exerciseId) => {
  validateObjectId(exerciseId);

  const exercise = await Exercise.findById(exerciseId);

  if (!exercise) {
    throw new ApiError(404, 'Exercise not found');
  }

  await exercise.deleteOne();

  return { deleted: true, exerciseId };
};

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
