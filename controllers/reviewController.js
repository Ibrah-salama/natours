
const ReviewModel = require("./../models/reviweModel");
const factory = require("./factory");

exports.getAllReviews = factory.getAll(ReviewModel);

exports.getReview = factory.getOne(ReviewModel);

// here some solution to decoubeld the create review middleware
exports.setTourUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  next();
};

exports.createReview = factory.createOne(ReviewModel);

exports.deleteReview = factory.deleteOne(ReviewModel);

exports.updateReview = factory.updateOne(ReviewModel);
