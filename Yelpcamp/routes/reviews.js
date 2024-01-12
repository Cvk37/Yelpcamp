const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../errors/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/reviews')
const {validateReview,isLoggedIn,isReviewAuthor}=require('../isLoggedIn')



router.post('/',isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview))

module.exports = router;