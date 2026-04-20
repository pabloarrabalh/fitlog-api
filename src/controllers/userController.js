const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);

  const createdUser = user.toObject();
  delete createdUser.password;

  res.status(201).json({
    success: true,
    data: createdUser
  });
});

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).select('-password');

  res.status(200).json({
    success: true,
    data: users
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  Object.assign(user, req.body);
  await user.save();

  const updatedUser = user.toObject();
  delete updatedUser.password;

  res.status(200).json({
    success: true,
    data: updatedUser
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByIdAndDelete(userId).select('-password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

module.exports = {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser
};
