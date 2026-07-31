const ExpressError = require ('./utils/ExpressErrors')
const {entrySchema , commentSchema} = require('./model/JOIschema')
const Journex = require ('./model/journex');
const Comment = require('./model/comments')



module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
         return res.status(401).json({ message: 'You must be logged in!' })
        // return res.redirect('/login');
    }
    next();
};


module.exports.validateEntry = (req , res , next)=>{
    const {error} = entrySchema.validate(req.body)
  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  }else{
    next()
  }
}


module.exports.isAuthor = async (req, res , next)=>{
   const {id} = req.params
    const entries = await Journex.findById(id)
     if(!entries.author.equals(req.user._id)){
      return res.status(403).json({message: 'You do no have the permission to do that'} )
     
     
     }
next()
}


module.exports.isCommentAuthor = async (req, res , next)=>{
   const {id , commentId} = req.params
    const comment = await Comment.findById(commentId)
     if(!comment.author.equals(req.user._id)){
           return res.status(403).json({message: 'You do no have the permission to do that'} )
     
     }
next()
}

module.exports.validateComment = (req , res , next)=>{
    const {error} = commentSchema.validate(req.body)
  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  }else{
    next()
  }
}


