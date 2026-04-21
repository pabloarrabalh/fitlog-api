const express = require('express');
const userController = require('../controllers/userController');
const validate = require('../middlewares/validate');
const { createUserSchema, updateUserSchema } = require('../validators/userSchemas');

const router = express.Router();

router.post('/', validate(createUserSchema), userController.createUser);
router.get('/', userController.listUsers);
router.get('/:userId', userController.getUserById);
router.patch('/:userId', validate(updateUserSchema), userController.updateUser);
router.delete('/:userId', userController.deleteUser);

module.exports = router;
