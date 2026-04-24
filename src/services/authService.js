const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { signAccessToken } = require('../utils/jwt');

/**
 * Registra un nuevo usuario
 * @param {Object} cleanData - Datos sanitizados por Zod (ya validados)
 * @returns {Object} { token, user }
 */
const registerUser = async (cleanData) => {
  const email = cleanData.email.toLowerCase();
  const username = cleanData.username.toLowerCase();

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new ApiError(409, 'Email already in use');
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new ApiError(409, 'Username already in use');
  }

  const user = await User.create({
    ...cleanData,
    email,
    username,
    role: 'user',
    profileCompleted: false
  });

  const token = signAccessToken({ sub: user._id.toString() });

  return {
    token,
    user
  };
};

/**
 * Autentica un usuario y devuelve token
 * @param {Object} cleanData - { email, password } sanitizado por Zod
 * @returns {Object} { token, user }
 */
const loginUser = async (cleanData) => {
  const normalizedIdentifier = cleanData.email.toLowerCase();

  const user = await User.findOne({
    $or: [
      { email: normalizedIdentifier },
      { username: normalizedIdentifier }
    ]
  }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isValid = await user.comparePassword(cleanData.password);
  if (!isValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = signAccessToken({ sub: user._id.toString() });

  return {
    token,
    user
  };
};

module.exports = {
  registerUser,
  loginUser
};
