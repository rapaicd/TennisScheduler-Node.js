const AppError = require('../utils/appError')
const Timeslot = require('../models/timeslot')
const TennisCourt = require('../models/tennisCourt')
const User = require('../models/user')
const message = require('../messages/validationMessage')

let messages = [];

const DurationValidator = (body,next) => {
    const startTimeHours = body.startDate.slice(11,13)*1;
    const startTimeMinutes = body.startDate.slice(14,16)*1;
    const  endTimeHours = body.endDate.slice(11,13)*1;
    const  endTimeMinutes = body.endDate.slice(14,16)*1;

    if(endTimeHours - startTimeHours < 2)
        return
    else if(endTimeHours - startTimeHours === 2){
        if(endTimeMinutes - startTimeMinutes <= 0)
            return
    }

    return next(new AppError(message.invalidDuration,400))
}

const FutureAndSameDateValidator = (body,next) =>{
    const startTimeMs = new Date(body.startDate).getTime();
    const endTimeMs = new Date(body.endDate).getTime();
    const currentTime = new Date().getTime();

    if(startTimeMs > endTimeMs || startTimeMs < currentTime || endTimeMs < currentTime)
        return next(new AppError(message.futureAndSameDate,400))

    return;
}

const IsReservedValidator = async(body,timeslotId,next) => {

    const users = await getUsers();

    let currentUserEmail;
    users.forEach(user =>{
        if(user.email === body.userEmail)
            currentUserEmail = user.email;
    })

    if(!currentUserEmail)
        return next(new AppError(message.invalidEmail,400));

    var newDate = new Date(body.startDate).toISOString().split('T')[0]
    const startDate = new Date(newDate)
    let startDatePlusOne = new Date(startDate);
    startDatePlusOne = startDatePlusOne.setDate(startDate.getDate()+1)

    const isTimeslotAlredyReservered = await checkIsTimeslotAlreadyReserved(currentUserEmail, startDate, startDatePlusOne, timeslotId);

    if(isTimeslotAlredyReservered.length > 0)
        return next(new AppError(message.alredyReserved,400));

    return;
}
const OverlappingTimeslotsValidator = async(body,timeslotId,next) => {
    const getAllTennisCourts = await getTennisCourts();
    let courtName;
    getAllTennisCourts.forEach(court=>{
        if(court.name===body.tennisCourtName)
            courtName = court.name
    })

    if(!courtName)
        return next(new AppError(message.invalidTennisCourtName,400));
    
    const getOverlappingTimeslots = await checkOverlapping(body,courtName,timeslotId);

    if(getOverlappingTimeslots.length > 0)
        return next(new AppError(message.overlappingTimeslots,400));
    
        
    return;
}

const WorkingDayValidator = async (body,next) => {
    const tennisCourts = await getTennisCourts();

    let currentCourt;
    tennisCourts.forEach(court => {
        if(body.tennisCourtName === court.name)
            currentCourt = court;
    })

    if(!currentCourt)
        return next(new AppError(message.invalidTennisCourtName,400));

    const startTimeWeekDay = new Date(currentCourt.workingTime.startWorkingTimeWeekDay);
    const endTimeWeekDay = new Date(currentCourt.workingTime.endWorkingTimeWeekDay);
    const startTimeWeekend = new Date(currentCourt.workingTime.startWorkingTimeWeekend);
    const endTimeWeekend = new Date(currentCourt.workingTime.endWorkingTimeWeekend);

    const startTime = new Date(body.startDate);
    const endTime = new Date(body.endDate);
    
    if(startTime.getDay === 6 || startTime.getDay === 7){
        if(startTime.getHours() < startTimeWeekend.getHours() || endTime.getHours() > endTimeWeekend.getHours())
            return next(new AppError(message.invalidWorkingtTime,400));
        else if(startTime.getHours() === startTimeWeekend.getHours() || endTime.getHours() === endTimeWeekend.getHours()){
            if(startTime.getMinutes() < startTimeWeekend.getMinutes() || endTime.getMinutes() > endTimeWeekend.getMinutes())
                return next(new AppError(message.invalidWorkingtTime,400));
        }
    }else{
        if(startTime.getHours() < startTimeWeekDay.getHours() || endTime.getHours() > endTimeWeekDay.getHours())
            return next(new AppError(message.invalidWorkingtTime,400));
        else if(startTime.getHours() === startTimeWeekDay.getHours() || endTime.getHours() === endTimeWeekDay.getHours()){
            if(startTime.getMinutes() < startTimeWeekDay.getMinutes() || endTime.getMinutes() > endTimeWeekDay.getMinutes())
                return next(new AppError(message.invalidWorkingtTime,400));
        }
    }

    return;
}

const checkOverlapping = (body,tennisCourtName,timeslotId,next) =>{
    return Timeslot.find({
        startDate:{"$lte": body.endDate},
        endDate:{"$gte":body.startDate},
        tennisCourtName:{"$eq":tennisCourtName},
        _id:{"$ne":timeslotId}
    });
}

const getTennisCourts = () =>{
    return TennisCourt.find();
}

const getUsers = () =>{
    return User.find();
}

const checkIsTimeslotAlreadyReserved = (userEmail,startTime, startDatePlusOne,timeslotId) =>{
    return  Timeslot.find({
        userEmail: {"$eq":userEmail},
        startDate: {"$gte": startTime,
                    "$lt": startDatePlusOne},
        _id: {"$ne":timeslotId}
    });
}

module.exports = async (req,res,next) => {

    if(!req.body.userEmail)
        req.body.userEmail = req.user.email;

    if(req.user.role === 'tennisPlayer' && req.body.userEmail !== req.user.email)
        return next(new AppError("You don't have permission",401))
    
    DurationValidator(req.body,next)
    FutureAndSameDateValidator(req.body,next)
    await IsReservedValidator(req.body, req.params.id,next)
    await OverlappingTimeslotsValidator(req.body,req.params.id,next)
    await WorkingDayValidator(req.body,next);

    return next();
}