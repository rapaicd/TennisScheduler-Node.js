const express = require('express')
const tennisCourtController = require('../controllers/tennisCourtController')
const authController = require('../controllers/authController')

const router = express.Router();


router.route('')
    .get(tennisCourtController.getAllTennisCourts)
    .post(authController.protect, authController.restrictTo('admin'), tennisCourtController.createTennisCourt);

router.route('/:id')
    .get(tennisCourtController.getTennisCourtById)
    .patch(authController.protect, authController.restrictTo('admin'), tennisCourtController.updateTennisCourt)
    .delete(authController.protect, authController.restrictTo('admin'), tennisCourtController.deleteTennisCourt);

module.exports = router;