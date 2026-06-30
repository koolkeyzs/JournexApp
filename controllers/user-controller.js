const Comment = require('../model/comments')
const Journex = require ('../model/journex');
const User = require ('../model/user');



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
   res.redirect('/entries')
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
    const redirectUrl = res.locals?.returnTo || '/entries'  // 👈 use optional chaining
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
        res.redirect('/entries');
    });
}