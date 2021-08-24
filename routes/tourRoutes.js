const express = require('express');
const router = express.Router()
const tourController = require("./../controllers/tourController")
const authController = require("./../controllers/authController")
// const reviewController = require('./../controllers/reviewController')
const reviewRouter = require('./../routes/reviewRoutes')

// router.param('id',tourController.checkID)
// 3) routes
// app.get('/api/v1/tours',getAllTours)
// app.get('/api/v1/tours/:id',getTour)
// app.post('/api/v1/tours',creteTour)
// app.patch("/api/v1/tours/:id",updateTour)
// app.delete("/api/v1/tours/:id",deleteTour)

//tours 
router.use('/:tourId/reviews', reviewRouter)

router.route('/top-5-cheap').get(tourController.aliasTopTours,tourController.getAllTours)

router.route("/get-stats").get(tourController.getToursStats)

router.route("/monthly-plan/:year")
      .get( authController.protect,
            authController.restrictTo('admin','lead-guide','guide'),
            tourController.getMonthlyPlan)

// GEOSPECIAL DATA 
router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin)
// calculate distance based on point 
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistance)

            // protect getAllTour route to check if the user is logged in or not....
router.route('/')
    .get(tourController.getAllTours)
    .post(authController.protect,
          authController.restrictTo('admin','lead-guide'),
          tourController.createTour
          )

router.route('/:id')
    .get(tourController.getTour)
    .patch(authController.protect,
        authController.restrictTo('admin','lead-guide'),
        tourController.updateTour)
    .delete(authController.protect , authController.restrictTo('admin','lead-tours'), tourController.deleteTour)

// router.route('/:tourId/review').post(authController.protect,authController.restrictTo('user'),reviewController.createReview)

module.exports = router