const asyncHandler = require('../utils/asyncHandler');
const userService = require('../services/userService');
const { updateProfileSchema, userIdSchema } = require('../validators/userSchemas');

const listUsers = asyncHandler(async (req, res) => {
  const users = await userService.listUsers();

  res.status(200).json({
    success: true,
    data: users
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Validar userId con Zod
  const cleanData = userIdSchema.parse({ userId });

  const user = await userService.getUserById(
    cleanData.userId,
    req.user._id,
    req.user.friends
  );

  res.status(200).json({
    success: true,
    data: user
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getMe(req.user._id);

  res.status(200).json({
    success: true,
    data: user
  });
});

const updateMe = asyncHandler(async (req, res) => {
  // Validar y sanitizar datos con Zod
  const cleanData = updateProfileSchema.parse(req.body);

  const user = await userService.updateMe(req.user._id, cleanData);

  res.status(200).json({
    success: true,
    data: user
  });
});

const deleteMe = asyncHandler(async (req, res) => {
  const user = await userService.deleteMe(req.user._id);

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
