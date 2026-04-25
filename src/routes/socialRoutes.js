const express = require('express');
const authMiddleware = require('../middlewares/auth');
const socialController = require('../controllers/socialController');

const router = express.Router();

router.use(authMiddleware);

router.get('/friends', socialController.listFriends);
router.post('/friends/:friendUsername', socialController.addFriend);
router.delete('/friends/:friendId', socialController.removeFriend);
router.get('/friends/:friendId/workouts', socialController.getFriendWorkouts);

module.exports = router;