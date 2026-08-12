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
// .get(userController.registerRenderForm )
.post(catchAsync ( userController.registerUser))


router.route('/login')
.post(storeReturnTo, passport.authenticate('local', {
    failureMessage: true,
    failureWithError: true
}), userController.loginUser)


router.get('/logout', userController.logOutUser); 
router.get('/profile', isLoggedIn, (userController.profileRoute)); 
router.post('/profile/upload', isLoggedIn, upload.single('profilePic'), (userController.uploadProfilePic)); 

router.put('/profile/update', isLoggedIn, catchAsync(userController.updateProfile))
router.put('/profile/change-password', isLoggedIn, catchAsync(userController.changePassword))
router.put('/profile/update-details', isLoggedIn, catchAsync(userController.updateDetails))
router.get('/users/:id', isLoggedIn, catchAsync(userController.publicProfile))
router.get('/my-reports', isLoggedIn, catchAsync(userController.myReports))
module.exports = router;