const mongoose = require ('mongoose')
const Schema = mongoose.Schema


const commentSchema = new Schema({

text: {
    type: String
},

author: 
        {
           type: Schema.Types.ObjectId,
        ref: 'User'
  
        },

        entry: {
        type: Schema.Types.ObjectId,
        ref: 'Journex'
    },

        parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },




         createdAt: {
        type: Date,
        default: Date.now
    },
})



module.exports = mongoose.model('Comment' , commentSchema)