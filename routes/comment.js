const express = require('express');
const router = express.Router({mergeParams:true});
const {commentSchema} = require('../model/JOIschema')
const catchAsync = require ('../utils/CatchAsync')
const ExpressError = require ('../utils/ExpressErrors')
const Journex = require ('../model/journex');
const Comment = require('../model/comments')


const validateComment = (req , res , next)=>{
    const {error} = commentSchema.validate(req.body)
  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  }else{
    next()
  }
}




router.post('/' , validateComment, catchAsync (async(req,res)=>{
   const entries = await Journex.findById(req.params.id)
   const comment = new Comment(req.body.comment)
   entries.comment.push(comment)
await comment.save()
await entries.save()
res.redirect (`/entries/${entries._id}`);

}))


router.delete('/:commentId' , catchAsync(async (req , res)=>{
    const {id , commentId} = req.params
    await Journex.findByIdAndUpdate(id , {$pull:{comment: commentId} })
 await Comment.findByIdAndDelete(commentId)
 res.redirect(`/entries/${id}`)
}))


module.exports = router