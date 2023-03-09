const app = require('./app')
const mongoose = require('mongoose');
const dotenv = require('dotenv')

dotenv.config({path:'./config.env'})

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{console.log("Database is successfully connected!")})

app.listen(8080, () => {
    console.log(`App is running`);
});