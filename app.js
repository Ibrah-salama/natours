const path = require('path')
const cors = require('cors')
const express = require('express');
const morgan = require('morgan')


const cookieParser = require('cookie-parser')
// for limiting #requests in a specific route and its routes 
const rateLimit = require('express-rate-limit')

// secure http headers 
const helmet = require('helmet')

// sanitize body from malicious mongo query 
const mongoSanitize = require('express-mongo-sanitize')

// prevent xss attack 
const xss = require('xss-clean')

// prevent parameter pullution 
const hpp = require('hpp')

const app = express()
app.use(cors())
app.set('view engine', 'pug')
app.set('views', path.join(__dirname,'views'))

// serving static files 
// app.use(express.static(`${__dirname}/public`))
app.use(express.static(path.join(__dirname,'public')))

const userRouter = require('./routes/userRoutes')
const tourRouter = require('./routes/tourRoutes');
const AppError = require('./util/AppError')
const globalErrorHandler = require('./controllers/errorController')
const reviewRouter = require('./routes/reviewRoutes')
const bookingRouter = require('./routes/bookingRoutes')

// server side rendering 
const viewRouter = require('./routes/viewroutes')
// 1) Global MiddleWares 

//Body-parser, reading data from body into req.body
app.use(express.json({limit:'10kb'}))
app.use(express.urlencoded({extended:true, limit:'10kb'}))
app.use(cookieParser())

// Data sanitization againest noSql query injection 
app.use(mongoSanitize())

// Clean any user input from maliciuos html code
app.use(xss())

// prevent parameter pullution 
app.use(hpp({
    whitelist:[ 
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}))

// set security http headers
app.use(helmet())

// development login
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
    app.use(morgan('dev'))
}

// limit requests from same API 
const limiter = rateLimit({
    max:100, // max 100 request 
    windowMs: 60*60*1000, // in one hour ,
    message : 'Too many requests from this ip, Please try again in an hour.'
})
// for all the routes connected with api
app.use('/api',limiter)



// Test middleware
app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    next()
})

// app.get('/',(req , res)=>{
//    res.status(200).json('hello from simple server :)')
// })

// server side rendering
app.use('/',viewRouter)
//mounting routers 
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/reviews',reviewRouter)
app.use('/api/v1/bookings',bookingRouter)

app.all('*',(req,res,next)=>{
    // res.status(404).json({
    //     status:"fail",
    //     message:`Can't find ${req.originalUrl} on this server`
    // })
    // const err = new Error(`Can't find ${req.originalUrl} on this server`)
    // err.statusCode = 404
    // err.status = 'fail'
    // next(err)
    next(new AppError(`Can't find ${req.originalUrl} on this server`,404))
})

//globak=l error handling middleware 
app.use(globalErrorHandler)

// 4) starting server 

module.exports= app ;