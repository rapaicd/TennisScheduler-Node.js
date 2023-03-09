const jwt = require('jsonwebtoken');
const { promisify } = require('util')
const User = require('./../models/user');
const authMessage = require('../messages/authMessage')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });
}

exports.signup = catchAsync(async(req,res,next) =>{
    const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        gender: req.body.gender,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        role:req.body.role
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status:"success",
        token,
        data:{
            model: newUser
        }
    })
});

exports.login = catchAsync(async(req,res,next) =>{

    const {email, password} = req.body;

    if(!email || !password)
        return next(new AppError(authMessage.provideCredentials,400));

    const user = await User.findOne({ email }).select('+password');

    if(!user || !(await user.correctPassword(password,user.password)))
        return next(new AppError(authMessage.incorrectCredentials,401))

    const token = signToken(user._id);;

    res.status(201).json({
        status:"success",
        token
    });
});


exports.protect = catchAsync(async(req,res,next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1]

    if(!token)
        return next(new AppError(authMessage.notLogged,401))
    
    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    
    if(!currentUser)
        return next(new AppError(authMessage.userNotExist,401))

    if(currentUser.changedPasswordAfter(decoded.iat))
        return next(new AppError(authMessage.passwordChanged,401))
     
    req.user = currentUser;
    next()
})

exports.restrictTo = (...roles) => {
    return (req, res ,next) => {
        if(!roles.includes(req.user.role))
            return next(new AppError(authMessage.dontPermission,403));
        next();
    }
}
