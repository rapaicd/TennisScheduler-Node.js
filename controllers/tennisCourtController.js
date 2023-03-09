const TennisCourt = require('../models/tennisCourt')
const factory = require("./handlerFactory")

exports.getAllTennisCourts = factory.getAll(TennisCourt)
exports.createTennisCourt = factory.create(TennisCourt)
exports.getTennisCourtById = factory.getById(TennisCourt)
exports.updateTennisCourt = factory.update(TennisCourt)
exports.deleteTennisCourt = factory.delete(TennisCourt)