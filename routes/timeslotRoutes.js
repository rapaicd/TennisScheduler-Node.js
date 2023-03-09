const express = require('express')
const timeslotController = require('../controllers/timeslotController')
const timeslotValidations = require('../utils/timeslotValidations')
const authController = require('../controllers/authController')

const router = express.Router();

router.route('')
    .get(authController.protect, authController.restrictTo('tennisPlayer', 'admin'), timeslotController.getAllTimeslots)
    .post(authController.protect, authController.restrictTo('tennisPlayer', 'admin'), timeslotValidations,timeslotController.createTimeslot);

router.route('/:id')
    .get(authController.protect, authController.restrictTo('tennisPlayer', 'admin'), timeslotController.getTimeslotById)
    .patch(authController.protect, authController.restrictTo('tennisPlayer', 'admin'), timeslotValidations, timeslotController.updateTimeslot)
    .delete(authController.protect, authController.restrictTo('tennisPlayer', 'admin'), timeslotController.deleteTimeslot);

module.exports = router;