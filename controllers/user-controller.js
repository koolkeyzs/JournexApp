const Comment = require('../model/comments')
const Journex = require ('../model/journex');
const User = require ('../model/user');
const {cloudinary} = require('../cloudinary/index')


// module.exports.registerRenderForm = (req , res ) =>{
//     res.render('user/register')
// }


module.exports.registerUser = async (req , res , next ) =>{
    try{
   const{email , username , password} = req.body
   const user = new User({email, username})
   const registeredUser = await User.register(user , password)
   req.login(registeredUser , err =>{
    if(err) return next(err)

      // after successful registration
res.json({ message: 'Welcome to Journex!' })
   })
   
   }
   
   catch(e){
        console.log(e)
res.status(400).json({ message:e.message})
    
   }
   
}



// module.exports.loginRenderForm = (req , res) =>{
//     res.render('user/login')
// }


module.exports.loginUser = (req , res) =>{
    const redirectUrl = res.locals?.returnTo || '/dashboard'  // 👈 use optional chaining
    req.flash('success' , 'Welcome Back')
    delete req.session.returnTo
    res.json({ message: 'Welcome Back!' })
  
}


module.exports.logOutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.json({ message: 'Goodbye!' })
     
    });
}

module.exports.profileRoute = async( req , res)=>{
    const user = await User.findById(req.user._id)
    res.json({user})

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

    res.json({message : 'Succesfully updated profile pic '})
}

module.exports.updateProfile = async (req, res) => {
    const { bio } = req.body
   await User.findByIdAndUpdate(req.user._id, { bio })
    res.json({ message: 'Profile updated!' })
}


module.exports.updateDetails = async (req, res) => {
    const { username, email } = req.body
    await User.findByIdAndUpdate(req.user._id, { username, email })
    res.json({ message: 'Details updated!' })
}

module.exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user._id)
    await user.changePassword(oldPassword, newPassword) // passport method!
    res.json({ message: 'Password changed!' })
}