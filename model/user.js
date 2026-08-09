const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')


const userSchema = new Schema({
    email :{
        type: String,
        required: true,
        unique: true
    },

    createdAt:{
        type : Date,
        default: Date.now
    
    },

  
     profilePic:  {
        url: String,
        filename: String
    }, 

    bio: {
        type: String
    },  

    role : {
        type : String,
        enum:['user' , 'admin'],
        default: 'user'
    }

})

userSchema.plugin(passportLocalMongoose.default)


module.exports= mongoose.model('User', userSchema)