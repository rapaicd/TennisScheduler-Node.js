const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

exports.getAll = (Model) =>
    catchAsync(async(req,res,next) =>{
        const model = await Model.find();
        
        res.status(200).json({
            status:"success",
            length: model.length,
            data:{
                model
            }
        })
    }
);

exports.create = (Model) =>
    catchAsync(async(req,res,next) =>{
        await Model.create(req.body);
    
        res.status(201).json({
            status:"success",
            data:{
                model:req.body
            }
        })
    }
);

exports.getById = (Model) =>
    catchAsync(async(req,res,next) =>{
        const model = await Model.findById(req.params.id);
        
        if(!model) return next(new AppError("Id doesn't exist!",404));

        res.status(200).json({
            status:"success",
            data:{
                model
            }
        })
    }
);

exports.update = (Model) =>
    catchAsync(async(req,res,next) =>{
        const model = await Model.findOneAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators: true
        })

        if(!model) return next(new AppError("Id doesn't exist!",404));
        
        res.status(200).json({
            status:"success",
            data:{
                model
            }
        })
    }
);

exports.delete = (Model) =>
    catchAsync(async(req,res,next) =>{
        const model = await Model.findOneAndRemove(req.params.id)

        if(!model) return next(new AppError("Id doesn't exist!",404));
        
        res.status(204).json({
            status:"success"
        })
    }
);