const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).select('firstName lastName email role experience objective bodyWeightKg friends createdAt updatedAt');

  res.status(200).json({
    success: true,
    data: users
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select('firstName lastName email role experience objective bodyWeightKg friends createdAt updatedAt');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isSelf = String(user._id) === String(req.user._id);
  const isFriend = Array.isArray(req.user.friends) && req.user.friends.some((friendId) => String(friendId) === String(user._id));

  if (!isSelf && !isFriend) {
    throw new ApiError(403, 'You can only view your own profile or friends profiles');
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('firstName lastName email role experience objective bodyWeightKg friends createdAt updatedAt');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  Object.assign(user, req.body);
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

const deleteMe = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

module.exports = {
  listUsers,
  getUserById,
  getMe,
  updateMe,
  deleteMe
};
