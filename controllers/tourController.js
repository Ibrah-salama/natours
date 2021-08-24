const catchAsync = require('./../util/catchAsync');
const TourModel = require('.././models/tourModel');
// const fs = require('fs');
const APIFeatures = require('./../util/apiFeatures');
const AppError = require('./../util/AppError');

const factory = require('./factory')

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))
exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//Refactory
exports.getAllTours = factory.getAll(TourModel)

/*
exports.getAllTours = catchAsync(async (req, res,next) => {
  const features = new APIFeatures(TourModel.find(), req.query)
    .filter()
    .sort()
    .limiting()
    .paginating();
  const tours = await features.query;
  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    result: tours.length,
    tours: tours,
  });

  // console.log(req.query);
  //    try{
  //     //BUILD QUERY
  //     // // 1A) filtering
  //     // const queryObj = {...req.query}
  //     // const execludedFields = ['page','limit','sort','fields']
  //     // execludedFields.forEach(el=> delete queryObj[el])
  //     // //we make it without await for future use pagination and sort
  //     // // 1B) advanced filtering
  //     // let queryStr = JSON.stringify(queryObj)
  //     // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=> `$${match}`)
  //     // let query = TourModel.find(JSON.parse(queryStr))

  //     // // 2)SORTING
  //     // if(req.query.sort){
  //     //     const sortBy = req.query.sort.split(',').join(' ')
  //     //     console.log(sortBy);
  //     //     query = query.sort(sortBy)
  //     // }else{
  //     //     query = query.sort('-createdAt')
  //     // }

  //     // // 3) field limiting: which fields will get back to the client
  //     // if(req.query.fields){
  //     //     const fields = req.query.fields.split(',').join(' ')
  //     //     query = query.select(fields)
  //     // }else{
  //     //     query =query.select('-__v')
  //     // }

  //     // // 4) pagination
  //     // const page = req.query.page*1 || 1;
  //     // const limit = req.query.limit*1 || 100;
  //     // const skip = (page-1)*limit;
  //     // query = query.skip(skip).limit(limit)
  //     // if(req.query.page){
  //     //     const numTours = await TourModel.countDocuments();
  //     //     if(skip >= numTours) throw new Error('page not found')
  //     // }

  //     // const query = await TourModel.find().where('duration').equals(5).where('difficulty').equals('easy')
  //     //EXECUTE QUERY
  //     const features = new APIFeatures(TourModel.find(),req.query).filter().sort().limiting().paginating()
  //         const tours = await features.query
  //     //SEND RESPONSE
  //     res.status(200).json({
  //         status:'success',
  //         requestedAt:req.requestTime,
  //         result: tours.length,
  //         tours : tours
  //       })
  //    }catch (err){
  //        res.status(404).json({
  //            status:"Fail",
  //            message:err.message
  //        })
  //    }
});
*/

//Refactory
exports.getTour = factory.getOne(TourModel,{path:'reviews'})

/*
exports.getTour = catchAsync( async (req, res,next) => {
  const tour = await TourModel.findById(req.params.id).populate('reviews')
  //Tour.findOne({_id:req.params.id})
  if(!tour){ 
      return next(new AppError(`No tour found with that ID`,404))
  }
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: tour
  });
  // const id = req.params.id*1; // to convert id to number and up here == converts automatically
  // const tour = tours.find(tor => tor.id === id)
  // if(!tour){
  //     return res.status(404).json({
  //         status:'failed',
  //         message:'Invalid request'
  //     })
  // }
    // try {
    //   const tour = await TourModel.findById(req.params.id);
    //   //Tour.findOne({_id:req.params.id})
    //   console.log('tour is ', tour);
    //   res.status(200).json({
    //     status: 'success',
    //     requestedAt: req.requestTime,
    //     data: tour
    //   });
    // } catch (err) {
    //   res.status(404).json({
    //     status: 'Fail',
    //     message: err.message,
    //   });
    // }
});

*/

//Refactory 
exports.createTour = factory.createOne(TourModel)

/*
exports.createTour = catchAsync(async (req, res,next) => {
  const newTour = await TourModel.create(req.body);
  res.status(201).json({
    status: 'success',
    createdAt: req.requestTime,
    data: {
      tour: newTour,
    },
  });

  //     try{
  //         // const newTour = new TourModel({})
  //     // TourModel.save()
  //     //this is equivalent to the above
  //    const newTour = await TourModel.create(req.body)
  //    res.status(201).json({
  //        status:'success',
  //        createdAt:req.requestTime,
  //        data:{
  //            tour:newTour
  //        }
  //    })
  //    }catch (err){
  //        res.status(400).json({
  //            status:'fail',
  //            message:err.message
  //        })
  //    }
});

*/

//Refactory 
exports.updateTour = factory.updateOne(TourModel)
/*
exports.updateTour = catchAsync(async (req, res,next) => {
  const updatedTour = await TourModel.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true, //to run all the validators on the updated data!!
    }
  );
  if(!updatedTour){ 
    return next(new AppError(`No tour found with that ID`,404))
}
  res.status(200).json({
    status: 'Success',
    data: {
      tour: updatedTour,
    },
  });
  //   try {
  //     const updatedTour = await TourModel.findByIdAndUpdate(
  //       { _id: req.params.id },
  //       req.body,
  //       {
  //         new: true,
  //         runValidators: true, //to run all the validators on the updated data!!
  //       }
  //     );
  //     res.status(200).json({
  //       status: 'Success',
  //       data: {
  //         tour: updatedTour,
  //       },
  //     });
  //   } catch (err) {
  //     res.status(400).json({
  //       status: 'fail',
  //       message: err.message,
  //     });
  //   }
});

*/
// Refactory 
exports.deleteTour = factory.deleteOne(TourModel)
/*
exports.deleteTour = catchAsync(async (req, res,next) => {
  console.log(req.params.id);
  const userId = req.params.id
  const tour = await TourModel.findByIdAndDelete(userId);
  console.log(tour)
  if(!tour){ 
    return next(new AppError(`No tour found with that ID`,404))
}
  res.status(204).json({
    status: 'Success',
    data: null,
  });
  //   try {
  //     await TourModel.findByIdAndDelete(req.params.id);
  //     res.status(204).json({
  //       status: 'Success',
  //       data: null,
  //     });
  //   } catch (err) {
  //     res.status(400).json({
  //       status: 'fail',
  //       message: err.message,
  //     });
  //   }
});

*/
//vid-101
exports.getToursStats = catchAsync(async (req, res,next) => {
  const stats = await TourModel.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        // _id:"$difficulty",
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //     $match:{_id:{$ne:'EASY'}}
    // }
  ]);
  res.status(200).json({
    status: 'Success',
    data: stats,
  });
  //   try {
  //     const stats = await TourModel.aggregate([
  //       {
  //         $match: { ratingsAverage: { $gte: 4.5 } },
  //       },
  //       {
  //         $group: {
  //           _id: { $toUpper: '$difficulty' },
  //           // _id:"$difficulty",
  //           numTours: { $sum: 1 },
  //           numRatings: { $sum: '$ratingsQuantity' },
  //           avgRating: { $avg: '$ratingsAverage' },
  //           avgPrice: { $avg: '$price' },
  //           minPrice: { $min: '$price' },
  //           maxPrice: { $max: '$price' },
  //         },
  //       },
  //       {
  //         $sort: { avgPrice: 1 },
  //       },
  //       // {
  //       //     $match:{_id:{$ne:'EASY'}}
  //       // }
  //     ]);
  //     res.status(200).json({
  //       status: 'Success',
  //       data: stats,
  //     });
  //   } catch (err) {
  //     res.status(400).json({
  //       status: 'fail',
  //       message: err.message,
  //     });
  //   }
});

//vid-102
exports.getMonthlyPlan = catchAsync(async (req, res,next) => {
  const year = req.params.year * 1;
  const plan = await TourModel.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      // add new field that containe the value of _id
      $addFields: { month: '$_id' },
    },
    {
      // to delete _id field we use projection
      $project: { _id: 0 },
    },
    {
      // sort desc
      $sort: { numTourStarts: -1 },
    },
    {
      // limit the output to 12 outputs
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: 'Success',
    data: {
      plan,
    },
  });
  //   try {
  //     const year = req.params.year * 1;
  //     const plan = await TourModel.aggregate([
  //       {
  //         $unwind: '$startDates',
  //       },
  //       {
  //         $match: {
  //           startDates: {
  //             $gte: new Date(`${year}-01-01`),
  //             $lte: new Date(`${year}-12-31`),
  //           },
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: { $month: '$startDates' },
  //           numTourStarts: { $sum: 1 },
  //           tours: { $push: '$name' },
  //         },
  //       },
  //       {
  //         // add new field that containe the value of _id
  //         $addFields: { month: '$_id' },
  //       },
  //       {
  //         // to delete _id field we use projection
  //         $project: { _id: 0 },
  //       },
  //       {
  //         // sort desc
  //         $sort: { numTourStarts: -1 },
  //       },
  //       {
  //         // limit the output to 12 outputs
  //         $limit: 12,
  //       },
  //     ]);
  //     res.status(200).json({
  //       status: 'Success',
  //       data: {
  //         plan,
  //       },
  //     });
  //   } catch (err) {
  //     res.status(400).json({
  //       status: 'fail',
  //       message: err.message,
  //     });
  //   }
});

// Geo speial data => get tours within closest specific location
exports.getToursWithin = async (req,res,next)=>{
  const { distance , latlng , unit } = req.params
  const [lat,lng] = latlng.split(',')
  const radius = unit === 'mi' ? distance/1963.2 : distance/6378.1
  
  if(!lat || !lng){
    next(new AppError('Please provide latitued an longitude in the format lat,lng.',400))
  }

  const tours = await TourModel.find( { startLocation : {$geoWithin: { $centerSphere : [[lng,lat],radius]}}}) 

  res.status(200).json({
    status:'success',
    results : tours.length,
    data: {
      data : tours
    }
  })
} 


exports.getDistance = catchAsync(async(req,res,next)=>{
  const { latlng , unit } = req.params
  const [lat,lng] = latlng.split(',')
  
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001

  if(!lat || !lng){
    next(new AppError('Please provide latitued an longitude in the format lat,lng.',400))
  }

  const distances = await TourModel.aggregate([{
    $geoNear:{
      near:{ type: 'Point' , coordinates: [ lng*1 , lat*1 ] },
      distanceField: 'distance',
      distanceMultiplier : multiplier
    }   
  },
  {
    $project:{
      distance: 1, 
      name: 1
    }
  }
])
  
  res.status(200).json({
    status:'success',
    data: {
      distanceField : distances
    }
  })
})