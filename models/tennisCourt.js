const mongoose = require('mongoose')
const address = require('./address')
const workingTime = require('./workingTime')

const tennisCourtSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:[true,"Name must be unique!"],
        required:[true,"Tennis court must have name!"],
        minlength:3,
        maxlength:50
    },
    surfaceType:{
        type:String,
        default:'GRASS',
        enum:['GRASS','CLAY','HARD']
    },
    description:{
        type:String,
        trim:true
    },
    image:{
        type:String,
        required:[true,"Image is required!"]
    },
    address,
    workingTime
});

module.exports = mongoose.model('tennisCourts',tennisCourtSchema);