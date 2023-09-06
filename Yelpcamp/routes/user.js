const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport')
const { storeReturnTo } = require('../isLoggedIn');

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

router.get('/login',async (req,res)=>{
  res.render('users/login')
})

router.post('/login',storeReturnTo, passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
 const redirectURL=res.locals.returnTo || '/campgrounds'
 req.flash("success","Welcome back")
 res.redirect(redirectURL)
})
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}); 
module.exports = router;