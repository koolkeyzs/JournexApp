const Comment = require('../model/comments')
const Journex = require ('../model/journex');
const Report = require ('../model/report');
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



module.exports.publicProfile = async (req, res) => {
    const { id } = req.params

    const user = await User.findById(id).select('username bio profilePic createdAt')

    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    const publicEntries = await Journex.find({
        author: id,
        isPublic: true
    

    }).sort({ createdAt: -1 })

   res.json({ user, publicEntries, currentUser: req.user })  
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
    console.log('body:', req.body) // check what's coming in
    console.log('user:', req.user) // check if user exists
    try {
        const { username, email } = req.body
        const user = await User.findByIdAndUpdate(req.user._id, { username, email }, { new: true })
        console.log('updated user:', user) // check if update worked
        
        req.login(user, (err) => {
            if(err) {
                return res.status(500).json({ message: 'Error updating session' })
            }
            res.json({ message: 'Details updated!' })
        })
    } catch(e) {
        console.log('error:', e)
        res.status(500).json({ message: e.message })
    }
}
module.exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user._id)
    await user.changePassword(oldPassword, newPassword) // passport method!
    res.json({ message: 'Password changed!' })
}

module.exports.myReports = async (req, res) => {
    const reports = await Report.find({ reporter: req.user._id })
        .populate('entry')
        .sort({ createdAt: -1 })

    res.json({ reports })
}