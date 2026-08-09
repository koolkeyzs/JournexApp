const mongoose = require ('mongoose')
const Schema = mongoose.Schema



const reportSchema = new Schema ({
  reporter : {
    type: Schema.Types.ObjectId,
    ref : 'User',
    required: true
  },

  entry: {
    type: Schema.Types.ObjectId,
    ref :'Journex',
    required: true
  },

  reason: {
    type: String,
    required: true,
    trim: true
  },

  status: {
    type: String,
    enum : ['pending' , 'reviewed' , 'resolved'],
    default : 'pending'
  },

 
  createdAt : {
    type : Date,
    default: Date.now
  }

});



module.exports= mongoose.model('Report' , reportSchema)