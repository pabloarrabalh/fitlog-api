const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { updateMeSchema } = require('../validators/authSchemas');

const router = express.Router();

router.use(authMiddleware);

router.get('/me/dashboard', userController.getDashboardStats);
router.get('/me', userController.getMe);
router.patch('/me', validate(updateMeSchema), userController.updateMe);
router.delete('/me', userController.deleteMe);
router.get('/', userController.listUsers);
router.get('/:userId', userController.getUserById);

module.exports = router;
