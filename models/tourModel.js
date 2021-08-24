const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')
const UserModel = require('./userModel')
//create tour schema
const tourSchema = mongoose.Schema({
    name: { 
            type:String,
            required:[ true,"A tour must has a name "],
            unique:true,
            trim:true,
            maxLength:[40,'A tour name must have less or equal 40 character'],
            minLength:[10,'A tour name must have more or equal 10 characters'],
            // validate: [validator.isAlpha, 'Tour name must only containes characters']
          },
    slug:    String,
    duration:{ 
            type:Number, 
            required:[ true,"A tour must have a duration"]
          },
    maxGroupSize:{ 
            type:Number, 
            required:[ true,"A tour must have a group size"]
    },
    difficulty:{ 
        type:String, 
            required:[ true,"A tour must have a difficulty"], 
            enum:{ values:['easy','medium','difficult'], 
            message: 'Difficulty is either: easy, meduium, Difficult'}
               },
    ratingsAverage:{ 
            type:Number, 
            default: 4.5,
            min:[1,'Rating must be above 1'], 
            max:[5,'Rating must be below 5'],
            set : val => Math.round(val*10)/10
              },
    ratingsQuantity:{ 
            type:Number , 
            default: 0 
              },
    price: { 
            type:Number , 
            required:[ true,"A tour must has a price"] 
            },
    priceDiscount: { 
            type:Number,
            // custom validator 
            validate: {
                validator: function(val){
                    // THIS HERE REFERS TO THE NEW CREATED DOCUMENT 
                    return val < this.price
                    },
                    message:"A discuont ({VALUE}) must be less than the real price"
                }
            },
    summary: { 
            type:String, 
            trim:true, 
            required:true
        },
    description: { 
            type:String, 
            trim:true
        },
    imageCover: { 
            type:String, 
            required:[true,"a tour must have a cover image"]
        },
    images: [String], // aray of strings,
    createdAt: { 
            type:Date, 
            default:Date.now(), 
            select:false 
        },  
    startDates: [Date],
    secretTour: { 
            type:Boolean, 
            default:false
        },
        startLocation: { 
            //GeoJSON 
            type: {
                type:String,
                default:'Point',
                enum:['Point']
            },
            coordinates:[Number],
            address:String,
            description:String
        },
        locations:[
            {
            type: {
                    type:String,
                    default:'Point',
                    enum:['Point']
                },
                coordinates:[Number],
                address:String,
                description:String,
                day:Number
            }
        ],
        // guides:Array,
        guides:[ 
                {
                    type: mongoose.Schema.ObjectId,
                    ref:'User'
                }
        ]
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals:true }
})
//vid-103
// we used regular function here because arrow function does not has its own [this] 
tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7
})
//104- docemnet middleware 
//this runs between .save and .create but not on insertMany 
tourSchema.pre('save',function(next){
    this.slug = slugify(this.name,{lower:true})
    next()
})

// Embedding user docs 
/*
tourSchema.pre('save', async function(next){
    const guidesDocs = this.guides.map( async id => await UserModel.findById(id))
    this.guides = await Promise.all(guidesDocs)
    console.log(this.guides);
    next()
})
*/

tourSchema.pre('save',function(next){
    console.log('Will save document....');
    next()
})
//post middlware 
tourSchema.post('save',function(doc,next){
    console.log(doc)
    next()
})

//152 populate
tourSchema.pre(/^find/, function(next){
    this.populate({
        path:'guides',
        select:'-__v -passwordChangedAt'
      })
      next()
})

//Increasing reading performance by creating index
// right here we creating a compound index 
tourSchema.index({ price:1 , ratingsAverage: -1})
tourSchema.index({ slug:1 })
// add index geo 
tourSchema.index({startLocation: '2dsphere'})
//156 virtual populate
tourSchema.virtual('reviews',{
    ref:'Review',
    foreignField:'tour',
    localField:'_id'
})

//105-qyery middleware 
// tourSchema.pre('find',function(next){
tourSchema.pre(/^find/,function(next){
    //this equal to the query in which is result of [find]
    this.find({secretTour:{$ne:true}})
    this.start = Date.now()
    next()
})

tourSchema.post(/^find/,function(docs,next){
    console.log(`Query took ${Date.now()-this.start} Milliseconds `);
    // console.log(docs)
    next()
})
//106-aggrigation middleware 
//disabled in order to $geoNear aggregation must work 
/*
tourSchema.pre('aggregate',function(next){
    this.pipeline().unshift({$match:{secretTour:{$ne : true}}})
    console.log('aggregate');
    next()
})
*/
//create tour model
const TourModel = mongoose.model('Tour',tourSchema);
module.exports = TourModel