const mongoose = require('mongoose')
const TourModel = require('./tourModel')

const reviewSchema = mongoose.Schema({
    review: {
         type:String, 
         required:[true, 'Review can not be empty']
        },
    rating: {
         type:Number, 
         min:1 , 
         max:5 
        },
    createdAt: {
         type:Date , 
         default:Date.now() 
        },
    tour: {
         type: mongoose.Schema.ObjectId ,
         ref:'Tour' , 
         required:[true, 'Review Must Belong to tour']
        },
    user: {
        type: mongoose.Schema.ObjectId, 
        ref: 'User',
        required: [true, 'A review Must belong to user']
         }
},{
    toJson: { virtual:true },
    toObject: { virtual:true }
})

reviewSchema.pre(/^find/,function(next){
    // this.populate({
    //     path:'tour',
    //     select: 'name'
    // }).populate({
    //     path:'user',
    //     select: 'name photo'
    // })
    this.populate({
        path:'user',
        select: 'name photo'
    })
    next()
})

// preventing the dublication of reviews by using indexes
reviewSchema.index({ tour:1 , user:1 },{ unique:true })


//Calculating rating average of all reviews to a specific tour 
reviewSchema.statics.calcAverageRatig = async function(tourId){
    const stats = await this.aggregate([
        { $match : {tour:tourId}},
        {
            $group:{
                _id: '$tour',
                nRating: { $sum : 1 },
                avgRating: { $avg: '$rating' }
        }
    }
    ])
    if(stats.length >0){
        await TourModel.findByIdAndUpdate(tourId,{
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        })
    }else{
        await TourModel.findByIdAndUpdate(tourId,{
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        })
    }
    
}

reviewSchema.post('save', function(){
    // this points to the current review
    this.constructor.calcAverageRatig(this.tour)
})

// Calculating avgRating in updating reviews
reviewSchema.pre(/^findOneAnd/, async function(next){
    this.r = await this.findOne()
    next()
})

reviewSchema.post(/^findOneAnd/, async function(){
    //await this.findOne() does not work here, as the query has already executed
    await this.r.constructor.calcAverageRatig(this.r.tour)
})

const ReviewModel = mongoose.model('Review',reviewSchema)

module.exports = ReviewModel