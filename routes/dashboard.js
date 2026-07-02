const express = require('express');
const router = express.Router();
const {entrySchema} = require('../model/JOIschema')
const catchAsync = require ('../utils/CatchAsync')
const ExpressError = require ('../utils/ExpressErrors')
const Journex = require ('../model/journex');
const {isLoggedIn , validateEntry, isAuthor} = require('../middleware')
const dashControl = require('../controllers/dashboard-controller')


router.get('/' ,isLoggedIn, catchAsync(dashControl.dashHome))
router.get('/private' ,isLoggedIn,  catchAsync(dashControl.privateEntry) )
router.get('/community' ,isLoggedIn, catchAsync(dashControl.communityFeed) )

module.exports = router;