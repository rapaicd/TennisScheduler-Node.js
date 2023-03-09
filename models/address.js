const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    country:{
        type:String,
        required:[true,"Country is required!"]
    },
    city:{
        type:String,
        required:[true,"City is required!"]

    },
    street:{
        type:String,
        required:[true,"Street is required!"]

    },
    number:{
        type:Number,
        required:[true,"Number is required!"]

    }
});

module.exports = addressSchema;