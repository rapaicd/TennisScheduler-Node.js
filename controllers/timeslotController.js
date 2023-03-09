const Timeslot = require('../models/timeslot')
const User = require('../models/user')
const factory = require('./handlerFactory')
const catchAsync = require('../utils/catchAsync')

exports.isAdminOrPlayer = async(req,res,next) => {

    if(req.user.role === 'tennisPlayer'){

    }

    next()
}

exports.getAllTimeslots = catchAsync(async(req,res,next) =>{
    let timeslots;

    if(req.user.role === 'tennisPlayer')
        timeslots = await Timeslot.find({userEmail:req.user.email});
    else
        timeslots = await Timeslot.find();
    
    res.status(200).json({
        status:"success",
        length: timeslots.length,
        data:{
            timeslots
        }
    })
});

exports.createTimeslot = factory.create(Timeslot)
exports.getTimeslotById = factory.getById(Timeslot)
exports.updateTimeslot = factory.update(Timeslot)
exports.deleteTimeslot = factory.delete(Timeslot)