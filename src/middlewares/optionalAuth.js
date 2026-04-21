const User = require('../models/User');
const { verifyAccessToken } = require('../utils/jwt');

async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.sub).select('-password');
    req.user = user || null;
  } catch (error) {
    req.user = null;
  }

  return next();
}

module.exports = optionalAuth;