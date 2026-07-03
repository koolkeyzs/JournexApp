const Comment = require('../model/comments')
const Journex = require ('../model/journex');
const User = require ('../model/user');
const {cloudinary} = require('../cloudinary/index')


module.exports.registerRenderForm = (req , res ) =>{
    res.render('user/register')
}


module.exports.registerUser = async (req , res , next ) =>{
    try{
   const{email , username , password} = req.body
   const user = new User({email, username})
   const registeredUser = await User.register(user , password)
   req.login(registeredUser , err =>{
    if(err) return next(err)
        req.flash('success' , 'Welcome To JOURNEX')
   res.redirect('/dashboard')
   })
   
   }
   
   catch(e){
        console.log(e)
    req.flash('error' , e.message)
    res.redirect('/register')
   }
   
}


module.exports.loginRenderForm = (req , res) =>{
    res.render('user/login')
}


module.exports.loginUser = (req , res) =>{
    const redirectUrl = res.locals?.returnTo || '/dashboard'  // 👈 use optional chaining
    req.flash('success' , 'Welcome Back')
    delete req.session.returnTo
    res.redirect(redirectUrl)
  
}


module.exports.logOutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/dashboard');
    });
}

module.exports.profileRoute = async( req , res)=>{
    const user = await User.findById(req.user._id)
    res.render('profile' , {user})

}


module.exports.uploadProfilePic = async(req, res) => {
    const user = await User.findById(req.user._id)
    
    if(req.file) {
        user.profilePic = {
            url: req.file.path,
            filename: req.file.filename
        }
        await user.save()
    }

    req.flash('success', 'Profile picture updated!')
    res.redirect('/profile')
}

