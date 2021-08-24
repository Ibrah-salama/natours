const AppError = require('./../util/AppError')
const catchAsync = require('./../util/catchAsync')
const APIFeatures = require('./../util/apiFeatures');

exports.deleteOne = Model => catchAsync(async (req, res,next) => {
    console.log(req.params.id);
    const userId = req.params.id
    const doc = await Model.findByIdAndDelete(userId);
    if(!doc){ 
      return next(new AppError(`No document found with that ID`,404))
  }
    res.status(204).json({
      status: 'Success',
      data: null,
    })
})

exports.updateOne = Model => catchAsync(async (req, res,next) => {
    const doc = await Model.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true, //to run all the validators on the updated data!!
      }
    );
    if(!doc){ 
      return next(new AppError(`No document found with that ID`,404))
  }
    res.status(200).json({
      status: 'Success',
      data: {
        tour: doc,
      },
    });
})

exports.createOne = Model => catchAsync(async (req, res,next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      createdAt: req.requestTime,
      data: {
        tour: doc,
      },
    });
})

exports.getOne= (Model,popOptions) => catchAsync( async (req, res,next) => {
    let query = Model.findById(req.params.id)
    if(popOptions) query = query.populate(popOptions)
    const doc = await query;
    //Tour.findOne({_id:req.params.id})
    if(!doc){ 
        return next(new AppError(`No document found with that ID`,404))
    }
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: doc
    })
})

exports.getAll = Model =>catchAsync(async (req, res,next) => {
    // To allow Nested Get reviews on Tour (hack)
    let filter = {}
    if(req.params.tourId) filter = {tour:req.params.tourId}
    
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limiting()
      .paginating();
    // const doc = await features.query.explain()
    const doc = await features.query.explain()
    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      result: doc.length,
      doc: doc,
    });
})