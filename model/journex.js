const mongoose = require ('mongoose')
const Schema = mongoose.Schema
const Comment = require('./comments')



const journexSchema = new Schema ({
  
    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },


    author: 
        {
           type: Schema.Types.ObjectId,
        ref: 'User'
  
        },

    verse: {
        type: String
    },
    

    images: [
        {
        url: String,
        filename: String
    }
    ],
   
    tags: [
        {
            type: String
        }
    ],

    isPublic: {
        type: Boolean,
        default: false  // 👈 private by default!
    },

    comment: [
{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
}
    ],


    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // },


});



journexSchema.post('findOneAndDelete' , async function (doc){
      

    if (doc){
         await Comment.deleteMany({
        _id: {
            $in: doc.comment
        }

    })

    }
}) 





module.exports= mongoose.model('Journex' , journexSchema)