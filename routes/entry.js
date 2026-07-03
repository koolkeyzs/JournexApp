const express = require('express');
const router = express.Router();
const {entrySchema} = require('../model/JOIschema')
const catchAsync = require ('../utils/CatchAsync')
const ExpressError = require ('../utils/ExpressErrors')
const Journex = require ('../model/journex');
const {isLoggedIn , validateEntry, isAuthor} = require('../middleware')
const entryControl = require('../controllers/entry-controller')
const multer = require('multer');
const {storage} = require('../cloudinary/index')

const upload = multer({ 
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
    
});




router.route('/')
// .get(catchAsync(entryControl.entryPage))
.post(isLoggedIn ,validateEntry, upload.array('image', 4) , catchAsync (entryControl.createForm))


router.get('/new' , isLoggedIn ,entryControl.newFormRender)


router.route('/:id')
.get(catchAsync(entryControl.showPage))
.put (isLoggedIn ,  isAuthor,  upload.array('image' , 4) , validateEntry, catchAsync(entryControl.editLogicRoute))
.delete(isLoggedIn , isAuthor, catchAsync(entryControl.deleteRoute))




router.get('/:id/edit', isLoggedIn , isAuthor , catchAsync(entryControl.editPage))
router.delete('/:id/images/:imageId', isLoggedIn , isAuthor , catchAsync(entryControl.deleteImage))





module.exports = router;

 