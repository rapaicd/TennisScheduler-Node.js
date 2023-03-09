const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"First name is required!"],
        minlength:3,
        maxlength:20
    },
    lastName:{
        type:String,
        required:[true,"Last name is required!"],
        minlength:3,
        maxlength:20
    },
    email:{
        type:String,
        unique:[true,"Email must be unique!"],
        required:[true,"You must have email!"],
        validate: [validator.isEmail, 'Please provide a valid email'],
        lowercase: true
    },
    gender:{
        type:String,
        required:[true,"Gender is required!"],
        enum: ["MALE","FEMALE"] 
    },
    phoneNumber:String,
    role: {
        type: String,
        enum: ['tennisPlayer','admin'],
        default: 'tennisPlayer'
    },
    password:{
        type:String,
        required:[true,"Password is required!"],
        minlength: 8,
        select: false
    },
    confirmPassword:{
        type:String,
        required:[true,"Confirm password is required!"],
        validate:{
            validator: function(el){
                return el === this.password;
            },
            message: 'Password are not the same'
        }
    },
    passwordChangedAt: Date
    
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,12);
    this.confirmPassword = undefined;

    next();
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,2);
        return changedTimestamp > JWTTimestamp;
    }
    
    return false;
};

module.exports = mongoose.model('Users',userSchema);