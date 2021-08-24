const sharp = require('sharp')

const catchAsync = require("../util/catchAsync");
const UserModel = require('../models/userModel');
const AppError = require("../util/AppError");
const factory = require('./factory') 

const multer  = require('multer')

// uploading image
    // storage 
// const multerStorage = multer.diskStorage({
//     destination : (req , file , cb)=>{
//         const dest = 'public/img/users'
//         cb(null , dest)
//     },
//     filename: (req, file, cb)=>{
//         const ext = file.mimetype.split('/')[1]
//         const fileName = `user-${req.user.id}-${Date.now()}.${ext}`
//         cb(null, fileName)
//     }
// })
    // storage will be in memory 
const multerStorage = multer.memoryStorage()

const multerFilter = (req , file, cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null , true)
    }else{
        cb(new AppError('Not an image! Please upload only images.',400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})
exports.uploadUserPhoto = upload.single('photo')

exports.resizeUserPhoto = (req , res, next)=>{ 
    if(!req.file) return next()
    console.log(req.file.buffer);
    sharp(req.file.buffer)
}

const filteredData = (obj , ...filteredUserData)=>{
    const filteredObject = {}
    // I do not know why this fucken shit under this line not working!!!
    // Object.keys(obj).forEach(el=>{
    //     if(filteredUserData.includes[el]){
    //         console.log(el);
    //         filteredObject[el] = obj[el]
    //     }
    // })
    const kys = Object.keys(obj)
    for(let i= 0 ; i< kys.length; i++){
        if(filteredUserData.includes(kys[i])) filteredObject[kys[i]] = obj[kys[i]]
    }
    console.log(filteredObject);
    return filteredObject
}

// Me ROute
exports.getMe = (req,res,next)=>{
    req.params.id = req.user.id
    next()
}

//refactory 
exports.getAllUsers = factory.getAll(UserModel)
/*
exports.getAllUsers = catchAsync( async (req,res,next)=>{
    const users = await UserModel.find();
  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    result: users.length,
    users: users,
  });
})
*/

//Refactory 
exports.getUser = factory.getOne(UserModel)

/*
exports.getUser = (req,res)=>{
    res.status(500).json({
        status:'Failed',
        message: 'This route is not defined yet'
    })
}
*/

exports.createUser = (req,res)=>{
    res.status(500).json({
        status:'Failed',
        message: 'This route is not defined yet'
    })
}

exports.updateMe = catchAsync( async(req,res,next)=>{
    console.log(req.file);
    // 1) create err if user POSTs password data
    if(req.body.password || req.body.passwordConfirmed){
        return next(new AppError("This route is not for password updates. Please use updateMyPassword route.",400))
    }

    // 2) filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filteredData(req.body,"email","name")
    if(req.file) filteredBody.photo = req.file.filename
    // 3) updated user document
    const updatedUser = await UserModel.findByIdAndUpdate(req.user.id,filteredBody,{ runValidators:true, new:true})
    // const user = req.user 
    // const updtedUser = await UserModel.findOneAndUpdate({_id:user._id},{
    //     name : userData.name? userData.name : user.name,
    //     email: userData.email? userData.email : user.name,
    // })
    res.status(200).json({
        status:'success',
        user:updatedUser
    })
})

exports.deleteMe = catchAsync(async(req,res,next)=>{
    await UserModel.findByIdAndUpdate(req.user.id,{
        active:false
    })

    res.status(204).json({
        status:'success',
        data:null
    })
})




//Refactory
exports.deleteUser = factory.deleteOne(UserModel)

// exports.deleteUser = (req,res)=>{
//     res.status(500).json({
//         status:'Failed',
//         message: 'This route is not defined yet'
//     })
// }

//Refactory
exports.updateUser = factory.updateOne(UserModel)