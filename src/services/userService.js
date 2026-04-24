const mongoose = require('mongoose');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * Valida si un ID es un ObjectId válido de MongoDB
 */
const validateObjectId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid userId');
  }
};

/**
 * Campos públicos a mostrar de un usuario
 */
const PUBLIC_USER_FIELDS = 'username firstName lastName email profileCompleted role experience objective bodyWeightKg friends createdAt updatedAt';

/**
 * Formatea un usuario para respuesta HTTP (sin password)
 */
const formatUser = (user) => {
  const userObj = user.toJSON ? user.toJSON() : user;
  return {
    id: userObj._id,
    username: userObj.username,
    firstName: userObj.firstName,
    lastName: userObj.lastName,
    email: userObj.email,
    profileCompleted: userObj.profileCompleted,
    role: userObj.role,
    experience: userObj.experience,
    objective: userObj.objective,
    bodyWeightKg: userObj.bodyWeightKg,
    friends: userObj.friends,
    createdAt: userObj.createdAt,
    updatedAt: userObj.updatedAt
  };
};

/**
 * Lista todos los usuarios (información pública)
 * @returns {Array} Array de usuarios
 */
const listUsers = async () => {
  const users = await User.find()
    .sort({ createdAt: -1 })
    .select(PUBLIC_USER_FIELDS);

  return users.map(formatUser);
};

/**
 * Obtiene un usuario específico por ID (con validación de permisos)
 * @param {string} userId - ID del usuario a obtener
 * @param {string} currentUserId - ID del usuario actual (para validar permisos)
 * @param {Array} currentUserFriends - Array de amigos del usuario actual
 * @returns {Object} Usuario formateado
 */
const getUserById = async (userId, currentUserId, currentUserFriends = []) => {
  validateObjectId(userId);

  const user = await User.findById(userId).select(PUBLIC_USER_FIELDS);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  const isSelf = String(user._id) === String(currentUserId);
  const isFriend = Array.isArray(currentUserFriends) &&
    currentUserFriends.some((friendId) => String(friendId) === String(user._id));

  if (!isSelf && !isFriend) {
    throw new ApiError(403, 'You can only view your own profile or friends profiles');
  }

  return formatUser(user);
};

/**
 * Obtiene el perfil del usuario actual
 * @param {string} userId - ID del usuario
 * @returns {Object} Usuario actual formateado
 */
const getMe = async (userId) => {
  const user = await User.findById(userId).select(PUBLIC_USER_FIELDS);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return formatUser(user);
};

/**
 * Actualiza el perfil del usuario actual (operación atómica)
 * @param {string} userId - ID del usuario
 * @param {Object} cleanData - Datos sanitizados por Zod (solo campos permitidos)
 * @returns {Object} Usuario actualizado
 */
const updateMe = async (userId, cleanData) => {
  // 1. Buscamos al usuario actual
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // 2. Mezclamos los datos antiguos con los nuevos que vienen en cleanData
  Object.assign(user, cleanData);

  // 3. Ahora SÍ calculamos profileCompleted basándonos en el objeto completo y actualizado
  user.profileCompleted = Boolean(
    user.bodyWeightKg !== null &&
    user.bodyWeightKg !== undefined &&
    user.experience &&
    user.objective
  );

  // 4. Guardamos (esto disparará el hook pre('save') si hay cambio de contraseña)
  await user.save();

  // 5. Devolvemos el usuario limpio usando el formato
  return formatUser(user);
};

/**
 * Elimina la cuenta del usuario (operación atómica)
 * @param {string} userId - ID del usuario
 * @returns {Object} Usuario eliminado
 */
const deleteMe = async (userId) => {
  // Operación atómica: eliminar usuario y todas sus referencias
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return formatUser(user);
};

module.exports = {
  listUsers,
  getUserById,
  getMe,
  updateMe,
  deleteMe
};
