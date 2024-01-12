const express = require('express');
const router = express.Router();
const catchAsync = require('../errors/catchAsync');
const campgrounds = require('../controllers/campgrounds')
const {isLoggedIn,validateCampground,isAuthor} = require('../isLoggedIn');

router.route('/')
   .get(catchAsync(campgrounds.index))
   .post(isLoggedIn,validateCampground, catchAsync(campgrounds.create))

router.get('/new',isLoggedIn,campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync (campgrounds.show))
    .put(isLoggedIn, isAuthor,validateCampground, catchAsync (campgrounds.edit))
    .delete(isLoggedIn,isAuthor, catchAsync (campgrounds.delete))

router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(campgrounds.renderEditForm))




module.exports = router;