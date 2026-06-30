const express = require('express');
const router = express.Router();
const passport = require('passport')
const catchAsync = require ('../utils/CatchAsync')
const { storeReturnTo } = require('../middleware');
const User = require ('../model/user');
const userController = require('../controllers/user-controller')


router.route('/register')
.get(userController.registerRenderForm )
.post(catchAsync ( userController.registerUser))


router.route('/login')
.get(userController.loginRenderForm )
.post(storeReturnTo, passport.authenticate('local', {failureFlash: true , failureRedirect: '/login'}), userController.loginUser  )

router.get('/logout', userController.logOutUser); 


module.exports = router;