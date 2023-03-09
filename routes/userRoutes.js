const express = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

const router = express.Router();

router.post('/signup',authController.signup);
router.post('/login',authController.login);

router.route('').get(authController.protect, authController.restrictTo('tennisPlayer', 'admin'),userController.getAllUsers);

router.route('/:id')
    .get(authController.protect, authController.restrictTo('tennisPlayer', 'admin'), userController.getUserById)
    .patch(authController.protect, authController.restrictTo('tennisPlayer', 'admin'), userController.updateUser)
    .delete(authController.protect, authController.restrictTo('tennisPlayer', 'admin'), userController.deleteUser);

module.exports = router;