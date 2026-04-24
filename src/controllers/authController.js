const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');
const { registerSchema, loginSchema } = require('../validators/authSchemas');

const register = asyncHandler(async (req, res) => {
  const cleanData = registerSchema.parse(req.body);

  const result = await authService.registerUser(cleanData);

  res.status(201).json({
    success: true,
    data: result
  });
});

const login = asyncHandler(async (req, res) => {
  const cleanData = loginSchema.parse(req.body);

  const result = await authService.loginUser(cleanData);

  res.status(200).json({
    success: true,
    data: result
  });
});

const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
});

module.exports = {
  register,
  login,
  me
};
