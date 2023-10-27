const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../errors/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');
const {validateReview}=require('../isLoggedIn')



router.post('/', validateReview, catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','New Review Posted')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId',catchAsync(async(req,res)=>{
    const {id,reviewId}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('del','Review Successfully deleted')
    res.redirect(`/campgrounds/${id}`)  
    
}))

module.exports = router;