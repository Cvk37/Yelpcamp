const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport')
const { storeReturnTo } = require('../isLoggedIn');
const users = require('../controllers/users')


router.route('/register')
    .get(users.renderRegisterForm)
    .post(users.createUser)

router.route('/login')
   .get(users.renderLoginForm)
   .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),users.loginUser)

router.get('/logout',users.logoutUser); 

module.exports = router;