const express = require('express')
const cors = require('cors')
const timeslotRoutes = require('./routes/timeslotRoutes')
const userRoutes = require('./routes/userRoutes')
const tennisCourtRoutes = require('./routes/tennisCourtRoutes')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

const app = express();
app.use(cors())

app.use(express.json())
app.use('/users',userRoutes)
app.use('/timeslots',timeslotRoutes)
app.use('/tennis-courts',tennisCourtRoutes)

app.all("*",(req,res,next)=>{
    next(new AppError(`Can't find URL: ${req.originalUrl}`,404))
})

app.use(globalErrorHandler)

module.exports = app;