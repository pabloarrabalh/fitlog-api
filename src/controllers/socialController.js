const asyncHandler = require('../utils/asyncHandler');
const socialService = require('../services/socialService');
const { friendIdSchema } = require('../validators/socialSchemas');

const listFriends = asyncHandler(async (req, res) => {
  const friends = await socialService.listFriends(req.user._id);

  res.status(200).json({
    success: true,
    data: friends
  });
});

const addFriend = asyncHandler(async (req, res) => {
  const { friendId } = req.params;

  // Validar friendId con Zod
  const cleanData = friendIdSchema.parse({ friendId });

  const result = await socialService.addFriend(req.user._id, cleanData.friendId);

  res.status(200).json({
    success: true,
    data: result
  });
});

const removeFriend = asyncHandler(async (req, res) => {
  const { friendId } = req.params;

  // Validar friendId con Zod
  const cleanData = friendIdSchema.parse({ friendId });

  const result = await socialService.removeFriend(req.user._id, cleanData.friendId);

  res.status(200).json({
    success: true,
    data: result
  });
});

const getFriendWorkouts = asyncHandler(async (req, res) => {
  const { friendId } = req.params;

  // Validar friendId con Zod
  const cleanData = friendIdSchema.parse({ friendId });

  const workouts = await socialService.getFriendWorkouts(
    req.user._id,
    cleanData.friendId
  );

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