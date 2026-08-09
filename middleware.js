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


module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;

    const entry = await Journex.findById(id);

    if (!entry) {
        return res.status(404).json({
            message: "Entry not found."
        });
    }

    // Admin can do anything
    if (req.user.role === "admin") {
        return next();
    }

    // Owner can also do it
    if (entry.author.equals(req.user._id)) {
        return next();
    }

    return res.status(403).json({
        message: "You don't have permission."
    });
};


module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, commentId } = req.params
    const comment = await Comment.findById(commentId)

    if (!comment) {
        return res.status(404).json({ message: 'Comment not found.' })
    }

    // Admin can do anything
    if (req.user.role === 'admin') {
        return next()
    }

    // Owner can also do it
    if (comment.author.equals(req.user._id)) {
        return next()
    }

    return res.status(403).json({ message: 'You do not have permission to do that' })
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


module.exports.isAdmin = (req , res , next)=>{
  if(!req.user){
    return res.status(401).json({
      message: 'You must be logged in'
    })
  }

  if(req.user.role !== 'admin'){
    return res.status(403).json({
      message: 'Access denied'
    })
  }

  next()
}


