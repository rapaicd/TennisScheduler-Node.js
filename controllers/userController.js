const User = require('../models/user');
const factory = require('./handlerFactory')

exports.getAllUsers = factory.getAll(User)
exports.getUserById = factory.getById(User)
exports.updateUser = factory.update(User)
exports.deleteUser = factory.delete(User)