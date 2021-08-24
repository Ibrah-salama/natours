const AppError = require("../util/AppError");
const catchAsync = require("../util/catchAsync");
const mongoose = require('mongoose')
const ReviewModel = require('./../models/reviweModel')
const factory = require('./factory')
 
//Reffactory 
exports.getAllReviews = factory.getAll(ReviewModel)
/*
exports.getAllReviews = catchAsync( async (req,res,next)=>{
    let filter = {}
    if(req.params.tourId) filter = {tour:req.params.tourId}
    const reviews = await ReviewModel.find(filter) 
    res.status(200).json({
        status:'success',
        reults: reviews.length,
        data: reviews
    })
})
*/

//Refactory 
exports.getReview = factory.getOne(ReviewModel)

/*
exports.getReview = catchAsync( async (req,res,next)=>{
    const reviewsId = req.params.id
    const review = await ReviewModel.findById(reviewId)
    if(!review) return next(new AppError("There is no reviews with that id",404))
    res.status(200).json({
        status:'success',
        data: review
    })
})
*/


// here some solution to decoubeld the create review middleware
exports.setTourUserIds = (req,res,next)=>{
    if(!req.body.user) req.body.user = req.user.id
    if(!req.body.tour) req.body.tour = req.params.tourId
    next()
}

exports.createReview = factory.createOne(ReviewModel)
/*
exports.createReview = catchAsync( async(req,res,next)=>{  
    if(!req.body.user) req.body.user = req.user.id
    if(!req.body.tour) req.body.tour = req.params.tourId
    const newReview = await ReviewModel.create(req.body)
    res.status(201).json({
        status :'succsess',
        review :newReview
    })
})
*/

exports.deleteReview = factory.deleteOne(ReviewModel)
// exports.deleteReview = catchAsync( async (req,res,next)=>{
//     await ReviewModel.findByIdAndDelete(req.params.id)
//     res.status(204).json({
//         status:"success",
//         data:null
//     })
// })

exports.updateReview = factory.updateOne(ReviewModel)

// exports.updateReview = catchAsync( async (req,res,next)=>{
//     const updatedReview = await ReviewModel.findByIdAndUpdate(req.params.id,{

//     })
// })