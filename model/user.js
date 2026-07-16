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
    }

})

userSchema.plugin(passportLocalMongoose.default)


module.exports= mongoose.model('User', userSchema)