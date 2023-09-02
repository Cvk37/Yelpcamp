const express = require('express');
const router = express.Router();
const catchAsync = require('../errors/catchAsync');
const Campground = require('../models/campground');
const {campgroundSchema}=require('../schemas');
const ObjectID = require('mongoose').Types.ObjectId;
const ExpressError = require('../errors/ExpressError');





const validateCampground = (req,res,next)=>{
    
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el=>el.message).join('')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}

router.get('/',catchAsync( async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
})) 
router.get('/new',(req,res)=>{
    res.render('campgrounds/new')
})
router.post('/',validateCampground, catchAsync(async (req,res,next)=>{
   
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success','Sucessfully saved Campground')
    res.redirect(`/campgrounds/${campground._id}`)
    
}))

router.get('/:id',catchAsync (async(req,res,next)=>{
   
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if(!campground){
        req.flash('err','Cannot find the Campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}))
router.get('/:id/edit', catchAsync( async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
     res.render('campgrounds/edit',{campground})
}))
router.put('/:id', validateCampground, catchAsync ( async(req,res)=>{
   const {id}=req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success','Sucessfully updated Campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))
router.delete('/:id',catchAsync (async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('del','Sucessfully deleted Campground')
    res.redirect('/campgrounds');

}))


module.exports = router;