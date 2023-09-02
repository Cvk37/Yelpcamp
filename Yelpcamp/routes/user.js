const express = require('express');
const router = express.Router();
const User = require('../models/User');

const catchAsync = require('../errors/catchAsync');

router.get('/register',(req,res)=>{
    res.render('users/register')
})

router.post('/register',async (req,res)=>{
    try{
    const{email,username,password}= req.body
    const user = new User({email,username})
    const registeredUser = await User.register(user,password);
    req.flash('success','Welcome to YelpCamp')
    res.redirect('/campgrounds')
    }catch(err){
        req.flash('error',err.message);
        res.redirect('register')
    }
})
module.exports = router;