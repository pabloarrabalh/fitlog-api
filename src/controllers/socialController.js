const mongoose = require('mongoose');
const User = require('../models/User');
const WorkoutSession = require('../models/WorkoutSession');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

function formatUser(user) {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    experience: user.experience,
    objective: user.objective,
    bodyWeightKg: user.bodyWeightKg
  };
}

const listFriends = asyncHandler(async (req, res) => {
  const me = await User.findById(req.user._id).populate('friends', 'firstName lastName email experience objective bodyWeightKg');

  if (!me) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json({
    success: true,
    data: me.friends.map(formatUser)
  }); 
});

const addFriend = asyncHandler(async (req, res) => {
  const { friendId } = req.params;

  if (!mongoose.isValidObjectId(friendId)) {
    throw new ApiError(400, 'Invalid friendId');
  }

  if (String(friendId) === String(req.user._id)) {
    throw new ApiError(400, 'You cannot add yourself as a friend');
  }

  const [me, friend] = await Promise.all([
    User.findById(req.user._id),
    User.findById(friendId)
  ]);

  if (!me || !friend) {
    throw new ApiError(404, 'User not found');
  }

  if (!me.friends.some((id) => String(id) === String(friendId))) {
    me.friends.push(friendId);
  }

  if (!friend.friends.some((id) => String(id) === String(me._id))) {
    friend.friends.push(me._id);
  }

  await Promise.all([me.save(), friend.save()]);

  res.status(200).json({
    success: true,
    data: { friendId }
  });
});

const removeFriend = asyncHandler(async (req, res) => {
  const { friendId } = req.params;

  if (!mongoose.isValidObjectId(friendId)) {
    throw new ApiError(400, 'Invalid friendId');
  }

  const [me, friend] = await Promise.all([
    User.findById(req.user._id),
    User.findById(friendId)
  ]);

  if (!me || !friend) {
    throw new ApiError(404, 'User not found');
  }

  me.friends = me.friends.filter((id) => String(id) !== String(friendId));
  friend.friends = friend.friends.filter((id) => String(id) !== String(me._id));

  await Promise.all([me.save(), friend.save()]);

  res.status(200).json({
    success: true,
    data: { friendId }
  });
});

const getFriendWorkouts = asyncHandler(async (req, res) => {
  const { friendId } = req.params;

  if (!mongoose.isValidObjectId(friendId)) {
    throw new ApiError(400, 'Invalid friendId');
  }

  const me = await User.findById(req.user._id);
  if (!me) {
    throw new ApiError(404, 'User not found');
  }

  const isFriend = me.friends.some((id) => String(id) === String(friendId));
  if (!isFriend) {
    throw new ApiError(403, 'You can only view workouts from your friends');
  }

  const workouts = await WorkoutSession.find({ user: friendId, status: 'completed' })
    .sort({ startedAt: -1 })
    .populate('entries.exercise', 'name primaryMuscles equipment')
    .populate('routine', 'name objective');

  res.status(200).json({
    success: true,
    data: workouts
  });
});

module.exports = {
  listFriends,
  addFriend,
  removeFriend,
  getFriendWorkouts
};