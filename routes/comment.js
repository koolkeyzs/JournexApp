const express = require('express');
const router = express.Router({mergeParams:true});
const {commentSchema} = require('../model/JOIschema')
const catchAsync = require ('../utils/CatchAsync')
const ExpressError = require ('../utils/ExpressErrors')
const Journex = require ('../model/journex');
const Comment = require('../model/comments')
const{validateComment, isLoggedIn , isCommentAuthor} = require('../middleware')
const commentController = require('../controllers/comment-controller')





router.post('/' , isLoggedIn, validateComment,  catchAsync (commentController.createComment))
router.delete('/:commentId' , isLoggedIn , isCommentAuthor,  catchAsync(commentController.deleteComment))






module.exports = router