const mongoose = require('mongoose')

const workingTimeSchema = new mongoose.Schema({
    startWorkingTimeWeekDay:{
        type:Date,
        required:[true,"Working time is required!"]

    },
    endWorkingTimeWeekDay:{
        type:Date,
        required:[true,"Working time is required!"]
    },
    startWorkingTimeWeekend:{
        type:Date,
        required:[true,"Working time is required!"]
    },
    endWorkingTimeWeekend:{
        type:Date,
        required:[true,"Working time is required!"]
    }
});

module.exports = workingTimeSchema;