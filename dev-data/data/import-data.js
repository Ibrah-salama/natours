const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})


const mongoose = require('mongoose');
const TourModel = require('../../models/tourModel');
const UserModel = require('../../models/userModel');
const ReviewModel = require('../../models/reviweModel');

// const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
mongoose.connect("mongodb+srv://ibrahim:BvIQM6q7RYBk6OBP@cluster0.mwecv.mongodb.net/natours?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true
}).then(con=>{
    //info about the connection
    // console.log(con.connections);
    console.log('Connection successfully with atlas!');
}).catch(err=> console.log(err.message))
console.log('shit hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'))

const importData = async ()=>{
    try{
        await TourModel.create(tours) 
        await UserModel.create(users,{validateBeforeSave:false}) 
        await ReviewModel.create(reviews) 
    }catch(err){
        console.log(err.message)
    }
    process.exit()
}
const deleteData = async ()=>{
    try{
        await TourModel.deleteMany() 
        await UserModel.deleteMany() 
        await ReviewModel.deleteMany() 
    }catch(err){
        console.log(err.message)
    }
    process.exit()
}

if(process.argv[2] === "--import"){
    importData()
}else if(process.argv[2]=== "--delete"){
    deleteData()
}