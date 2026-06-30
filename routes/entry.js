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
const upload = multer({ storage });





router.route('/')
.get(catchAsync(entryControl.entryPage))
// .post(isLoggedIn ,validateEntry, catchAsync (entryControl.createForm))
.post(upload.array('image'), (req , res)=>{
    console.log(req.body , req.files)
    res.send('it worked')
})

router.get('/new' , isLoggedIn ,entryControl.newFormRender)


router.route('/:id')
.get(catchAsync(entryControl.showPage))
.put (isLoggedIn ,  isAuthor, validateEntry, catchAsync(entryControl.editLogicRoute))
.delete(isLoggedIn , isAuthor, catchAsync(entryControl.deleteRoute))



router.get('/:id/edit', isLoggedIn , isAuthor , catchAsync(entryControl.editPage))





module.exports = router;

 