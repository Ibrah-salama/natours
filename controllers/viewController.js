const TourModel = require('../models/tourModel')
const catchAsync= require('../util/catchAsync')
const AppError = require('../util/AppError')
const UserModel = require('../models/userModel')

exports.getOverview = catchAsync( async(req,res,next)=>{
    // 1) Get tour data from collection 
    const tours = await TourModel.find()
    // 2) build template
    // 3) Render that template using tour data from 1 

    res.status(200).set(
        'Content-Security-Policy',
        "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
      ).render('overview',{
        title:'All Tours',
        tours
    })
})


exports.getTour = catchAsync(async (req,res,next)=>{
    // 1) Get the data, for the requested tour (including reviews and guides)
    const tour = await TourModel.findOne({slug:req.params.slug}).populate({
        path:'reviews',
        fields: 'review rating user'
    })
    if(!tour){
        return next(new AppError('There is no tour with that name',404))
    }
    res.status(200).set(
        'Content-Security-Policy',
        "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
      ).render('tour',{
        title:`${tour.name} tour`,
        tour
    })
})

exports.getLogInForm = catchAsync(async (req,res,next)=>{

    res.status(200).setHeader( 'Content-Security-Policy', "script-src 'self' https://cdnjs.cloudflare.com" ).render('login',{
        title:'Log in to your account'
    })
})


exports.getAccount = (req,res)=>{ 
    res.status(200).setHeader( 'Content-Security-Policy', "script-src 'self' https://cdnjs.cloudflare.com" ).render('account',{
        title:'Your account'
    })
}

exports.updateUserData = catchAsync ( async (req,res,next)=>{
    const updatedUser = await UserModel.findByIdAndUpdate(req.user.id , {
        name: req.body.name,
        email: req.body.email
    },{
        new: true,
        runValidators:true
    })
    res.status(200).render('account',{
        title:'Your account',user: updatedUser
    })
})