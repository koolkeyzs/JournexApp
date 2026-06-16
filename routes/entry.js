const express = require('express');
const router = express.Router();
const {entrySchema} = require('../model/JOIschema')
const catchAsync = require ('../utils/CatchAsync')
const ExpressError = require ('../utils/ExpressErrors')
const Journex = require ('../model/journex');


const validateEntry = (req , res , next)=>{
    const {error} = entrySchema.validate(req.body)
  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  }else{
    next()
  }
}





router.get('/' , catchAsync(async (req , res) =>{
    const entries = await Journex.find({})
    res.render('entry' , {entries})
    
}))

router.get('/new' , (req , res) =>{
 res.render ('new')
})


router.post ('/' ,validateEntry, catchAsync (async (req , res , next) =>{
    const entryData = req.body.entry
    entryData.isPublic = entryData.isPublic === 'on' // 👈 convert 'on' to true
    const entries = new Journex(entryData)
    await entries.save()
    res.redirect (`/entries/${entries._id}`)
    
}))

router.get('/:id' , catchAsync( async(req , res) =>{
    const entries = await Journex.findById(req.params.id).populate('comment')
    res.render('show' , {entries})
} ))

router.get('/:id/edit' , catchAsync(async (req , res) =>{
     const entries = await Journex.findById(req.params.id)
    res.render('edit' , {entries})

}))

router.put ('/:id' , validateEntry, catchAsync(async (req , res) =>{
    const {id} = req.params
    const entryData = req.body.entry
    entryData.isPublic = entryData.isPublic === 'on' // 👈 convert 'on' to true
    const entries = await Journex.findByIdAndUpdate(id , {...entryData})
     res.redirect (`/entries/${entries._id}`)
}))

router.delete('/:id' , catchAsync(async (req , res) =>{
    const {id} = req.params
    const entries = await Journex.findByIdAndDelete(id)
     res.redirect ('/entries');
}))


module.exports = router;