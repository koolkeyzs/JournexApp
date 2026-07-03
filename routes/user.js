const express = require('express');
const router = express.Router();
const passport = require('passport')
const catchAsync = require ('../utils/CatchAsync')
const { storeReturnTo, isLoggedIn } = require('../middleware');
const User = require ('../model/user');
const userController = require('../controllers/user-controller')
const multer = require('multer');
const {storage} = require('../cloudinary/index')
const upload = multer({ storage });


router.route('/register')
.get(userController.registerRenderForm )
.post(catchAsync ( userController.registerUser))


router.route('/login')
.get(userController.loginRenderForm )
.post(storeReturnTo, passport.authenticate('local', {failureFlash: true , failureRedirect: '/login'}), userController.loginUser  )

router.get('/logout', userController.logOutUser); 
router.get('/profile', isLoggedIn, (userController.profileRoute)); 
router.post('/profile/upload', isLoggedIn, upload.single('profilePic'), (userController.uploadProfilePic)); 


module.exports = router;