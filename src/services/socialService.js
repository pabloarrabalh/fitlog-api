const mongoose = require('mongoose');
const User = require('../models/User');
const WorkoutSession = require('../models/WorkoutSession');
const ApiError = require('../utils/ApiError');

/**
 * Valida si un ID es un ObjectId válido de MongoDB
 */
const validateObjectId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid friendId');
  }
};

/**
 * Verifica que el usuario exista
 */
const ensureUserExists = async (userId, errorMessage = 'User not found') => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, errorMessage);
  }
  return user;
};

/**
 * Lista todos los amigos del usuario actual
 * @param {string} userId - ID del usuario
 * @returns {Array} Array de amigos formateados
 */
const listFriends = async (userId) => {
  const user = await User.findById(userId).populate(
    'friends',
    'firstName lastName email username experience objective bodyWeightKg'
  );

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user.friends;
};

/**
 * Agrega un amigo (relación bidireccional - operación atómica)
 * @param {string} userId - ID del usuario actual
 * @param {string} friendUsername - Nombre de usuario del amigo a agregar
 * @returns {Object} { friendId }
 */
const addFriend = async (userId, friendUsername) => {
  // Find friend by username
  const friend = await User.findOne({ username: friendUsername });
  if (!friend) {
    throw new ApiError(404, 'Friend not found');
  }
  const friendId = friend._id;

  if (String(friendId) === String(userId)) {
    throw new ApiError(400, 'You cannot add yourself as a friend');
  }

  const currentUser = await ensureUserExists(userId, 'User not found');


  await Promise.all([
    User.findByIdAndUpdate(
      userId,
      { $addToSet: { friends: friendId } },
      { new: true }
    ),
    User.findByIdAndUpdate(
      friendId,
      { $addToSet: { friends: userId } },
      { new: true }
    )
  ]);

  return { friendId };
};

/**
 * Elimina un amigo (relación bidireccional - operación atómica)
 * @param {string} userId - ID del usuario actual
 * @param {string} friendId - ID del usuario a eliminar
 * @returns {Object} { friendId }
 */
const removeFriend = async (userId, friendId) => {
  validateObjectId(friendId);
  await Promise.all([
    User.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } },
      { new: true }
    ),
    User.findByIdAndUpdate(
      friendId,
      { $pull: { friends: userId } },
      { new: true }
    )
  ]);

  return { friendId };
};

/**
 * Obtiene los workouts completados de un amigo
 * @param {string} userId - ID del usuario actual
 * @param {string} friendId - ID del amigo
 * @returns {Array} Array de workouts del amigo
 */
const getFriendWorkouts = async (userId, friendId) => {
  validateObjectId(friendId);

  // Obtener usuario actual (para verificar si friendId es amigo)
  const currentUser = await User.findById(userId);
  if (!currentUser) {
    throw new ApiError(404, 'User not found');
  }

  // Verificar que friendId está en la lista de amigos
  const isFriend = currentUser.friends.some(
    (id) => String(id) === String(friendId)
  );
  if (!isFriend) {
    throw new ApiError(403, 'You can only view workouts from your friends');
  }

  // Obtener workouts completados del amigo
  const workouts = await WorkoutSession.find({
    user: friendId,
    status: 'completed'
  })
    .sort({ startedAt: -1 })
    .populate('entries.exercise', 'name primaryMuscles equipment')
    .populate('routine', 'name objective');

  return workouts;
};

module.exports = {
  listFriends,
  addFriend,
  removeFriend,
  getFriendWorkouts
};
