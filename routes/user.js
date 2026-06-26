const express = require('express');
const router = express.Router();
const passport = require('passport')
const catchAsync = require ('../utils/CatchAsync')
const { storeReturnTo } = require('../middleware');
const User = require ('../model/user');


router.get('/register' , (req , res ) =>{
    res.render('user/register')
})

router.post('/register' ,catchAsync ( async (req , res , next ) =>{
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
   
}))



router.get('/login' , (req , res) =>{
    res.render('user/login')
})

router.post('/login' , storeReturnTo, passport.authenticate('local', {failureFlash: true , failureRedirect: '/login'}), (req , res) =>{
    const redirectUrl = res.locals?.returnTo || '/entries'  // 👈 use optional chaining
    req.flash('success' , 'Welcome Back')
    delete req.session.returnTo
    res.redirect(redirectUrl)
  
})


    router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/entries');
    });
}); 


module.exports = router;