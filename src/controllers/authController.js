const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { signAccessToken } = require('../utils/jwt');

const register = asyncHandler(async (req, res) => {
  const email = req.body.email.trim().toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'Email already in use');
  }

  const user = await User.create({
    ...req.body,
    email
  });
  const token = signAccessToken({ sub: user._id.toString() });

  res.status(201).json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        experience: user.experience,
        objective: user.objective,
        bodyWeightKg: user.bodyWeightKg
      }
    }
  });
});

const login = asyncHandler(async (req, res) => {
  const identifier = req.body.email.trim().toLowerCase();
  const { password } = req.body;

  const user = await User.findOne({
    $or: [
      { email: identifier },
      { username: identifier }
    ]
  }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isValid = await user.comparePassword(password);
  if (!isValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = signAccessToken({ sub: user._id.toString() });

  res.status(200).json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        experience: user.experience,
        objective: user.objective,
        bodyWeightKg: user.bodyWeightKg
      }
    }
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
