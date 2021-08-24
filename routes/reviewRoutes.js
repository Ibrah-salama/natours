const express = require('express')
const authController = require('./../controllers/authController')
const reviewController = require('./../controllers/reviewController')

const router = express.Router({mergeParams:true})

// Add protect middlewatre to these routes
router.use(authController.protect)

router.route('/')
    .get(reviewController.getAllReviews)
    .post(authController.restrictTo('user'),reviewController.setTourUserIds,reviewController.createReview)

router.route('/:id')
.delete(reviewController.deleteReview)
.patch(authController.restrictTo('user','admin'),reviewController.updateReview)
.get(authController.restrictTo('user','admin'),reviewController.getReview)

module.exports = router