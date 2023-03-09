const mongoose = require('mongoose')

const timeslotSchema = new mongoose.Schema({
    startDate:{
        type:Date,
        required:[true,"Start date is required!"]
    },
    endDate:{
        type:Date,
        required:[true,"End date is required!"]
    },
    userEmail:{
        type:String
    },
    tennisCourtName:{
        type:String,
        required:[true,"Tennis court name is required!"] 
    }
});

module.exports = mongoose.model('Timeslots',timeslotSchema);