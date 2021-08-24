const crypto = require('crypto')
const { promisify } = require('util')
const UserModel = require('./../models/userModel')
const catchAsync = require('./../util/catchAsync')
const jwt = require('jsonwebtoken')
const AppError = require('../util/AppError')
const sendEmail = require('../util/email')

const signToken = id =>{ 
    return jwt.sign({ id },process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRES_IN})
}

const createAndSendToken = (user,statusCode,res)=>{
    const token = signToken(user._id)
    const cookieOptions = {
        expires:new Date(Date.now()+ process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
        // to send the token via https only ====> HTTPS FOR PRODUCTION
        // secure:true,
        // to send the token with every request
        httpOnly:true
    }
    if(process.env.NODE_ENV == "production") cookieOptions.secure = true
    // sending jwt token with responce to save it in cookie
    // res.cookie('jwt',token,cookieOptions)
    // to prevent the password field to apears in the responce 
    res.cookie('jwt',token,cookieOptions)
    user.password = undefined
    res.status(statusCode).json({
        status:'success',
        token,
        data:{ 
            user
        }
    })
}
exports.signUp = catchAsync(async(req,res,next)=>{
    // const newUser = await UserModel.create(req.body)

    const newUser = await UserModel.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirmed: req.body.passwordConfirmed,
        role: req.body.role
    })
    createAndSendToken(newUser,201,res)
    // const token = signToken(newUser._id)
    // res.status(201).json({
    //     status:'success',
    //     token,
    //     data:{ 
    //         user: newUser
    //     }
    // })
})

exports.logIn = catchAsync( async (req,res,next)=>{
    const { email , password } = req.body
    // 1) check if email and password exits 
    if(!email || !password) return next(new AppError("Please provide email and password!",404))
    
    // 2) check if user exist and password correct 
    const user = await UserModel.findOne({ email }).select('+password')
    const correct = await user.correctPassword(password,user.password)
    console.log(correct);
    if(!user || !correct){
        return next(new AppError("Incorrect email or password",401))
    }

    createAndSendToken(user,200,res)

    // const token = signToken(user._id)
   
    // // 3) if everything is ok, send token to the client 
    // res.status(200).json({
    //     user : "Success",
    //     token
    // })
})

exports.protect = catchAsync ( async (req,res,next)=>{ 
    // 1) get the token and check if it there  
    let token 
    if( req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer')){
        token = req.headers['authorization'].split(' ')[1]
    }else if(req.cookies.jwt){
        token = req.cookies.jwt
    }
    if(!token){
        return next( new AppError("You are not logged in! please log in to get access.",401))
    }

    // 2) verification of token 
    const decodedData = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
    console.log(decodedData);

    // 3) Check if the user still exists [ If the user alterd after verification]
    const currentUser = await UserModel.findById(decodedData.id)
    if(!currentUser) return next(new AppError("The token is no longer exist.",401))

    // 4) check if user changed password after the token was issued
    if(currentUser.changedPasswordAfter(decodedData.iat)) return next(new AppError("User recently changed password! Please log in again.",401))

    //GRANT ACCESS TO PROTECTED ROUTE\
    req.user = currentUser
    res.locals.user = currentUser
    next()
})

//
exports.isLoggedIn = async (req,res,next)=>{ 
    // 1) get the token and check if it there  
   if(req.cookies.jwt){
       try{
       // 1) verifies token 
      const decodedData = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET)
    // 2) Check if the user still exists [ If the user alterd after verification]
    const currentUser = await UserModel.findById(decodedData.id)
    if(!currentUser) return next()

    // 4) check if user changed password after the token was issued
    if(currentUser.changedPasswordAfter(decodedData.iat)) return next(new AppError("User recently changed password! Please log in again.",401))

    //There is a logged in user
    res.locals.user = currentUser
    return next()
       }catch(err){
           return next()
       }
}
next()
}


exports.restrictTo =(...roles)=> {
return (req,res,next)=>{ 
    // admin can delete roles = ['admin', 'lead-tours']
    if(!roles.includes(req.user.role)){
        return next(new AppError("You are not allowed to perform this action!",403))
    }
    next()
}
}

exports.forgotPassword = catchAsync( async(req,res,next)=>{
    // 1) check if user exist based on his email address 
    const user = await UserModel.findOne({email:req.body.email})
    if(!user) return next(new AppError("There is no users with this email address!",404))
    // 2) if user exist  => generate random access token 
    // console.log(user.createPasswordResetToken());
    const resetToken = user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false})

    // 3) send resetToken to user email address 
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

    const message = `Forgot your password? \n Please Submit a PAtch request with your
    new password and confirmpassword to: \n ${resetURL}. \n 
    If you did not forget your password, please ignore this email`
    
    try{
        await sendEmail({
            email:user.email,
            subject:'your password reset token valid for 10 min',
            message: message
        })
        res.status(200).json({
            status:'success',
            message:'Token sent to email.'
        })
    }catch(err){
         user.passwordResetToken= undefined
         user.asswordResetExpired= undefined
         await user.save({ validateBeforeSave: false})
         next(new AppError("There is a problem sending the email, please try again later"),500)
     }

})

exports.resetPassword =catchAsync( async(req,res,next)=>{
     // 1) get the user based on token 
     const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
     const user = await UserModel.findOne({
            passwordResetToken:hashedToken,
            passwordResetExpired: { $gt : Date.now() }
        })
     
     // 2) chick if the token expired and there is a user set a new password
     if(!user){ 
         return next(new AppError("Token is invalid or expired",400))
     }

     console.log('Before =========> user');
     console.log(user);
     console.log('After  =========> user');

     user.password = req.body.password
     user.passwordConfirmed = req.body.passwordConfirmed
     user.passwordResetToken = undefined
     user.passwordResetExpired = undefined 
     
     await user.save()
     // 3) update changedPasswordAt for the user
     // 4) log the user in, send JWT to the client 
     createAndSendToken(user,200,res)
    //  const token = signToken(user._id)
    //  res.status(200).json({
    //      user : "Success",
    //      token
    //  })
})

exports.updatePassword = catchAsync( async (req,res,next)=>{
    // 1) Get the user from collection 
    const user = await UserModel.findById(req.user.id).select('+password')
    const passwordCurrent = req.body.passwordCurrent
    const correctedPassword = await user.correctPassword(passwordCurrent,user.password)
    console.log(correctedPassword);
    if(!correctedPassword) return next(new AppError("Your current password is incorrect",400))
    user.password = req.body.password
    user.passwordConfirmed = req.body.passwordConfirmed
    await user.save()
    // UserModel.findOneAndUpdate will not work as intended
    createAndSendToken(user,200,res)
    //  const token = signToken(user._id)
    //  res.status(200).json({
    //      user : "Success",
    //      token
    //  })
})


exports.logout = (req,res)=>{
    res.cookie('jwt','loggedout',{
        expires: new Date(Date.now()+10*1000),
        httpOnly:true
    })
    res.status(200).json({
        status:'success'
    })
}