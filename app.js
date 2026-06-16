const express = require('express');
const app = express();
const mongoose = require ('mongoose')
const path = require ('path');
const Ejsmate = require('ejs-mate')
const Journex = require ('./model/journex');
const catchAsync = require ('./utils/CatchAsync')
const ExpressError = require ('./utils/ExpressErrors')
const joi = require('joi')
const {entrySchema, commentSchema} = require('./model/JOIschema')
const Comment = require('./model/comments')

app.engine('ejs' ,  Ejsmate)

mongoose.connect('mongodb://localhost:27017/Journex')
const db = mongoose.connection;

db.on('error' , console.error.bind(console , 'Connection-Error'))
db.once ('open'  ,()=>{
    console.log('Database Connected')
})

const methodOverride = require('method-override')
app.use(methodOverride ('_method'))

app.use(express.static(path.join(__dirname, 'public')))
app.set ('views' , path.join(__dirname, 'views'));
app.set ('view engine', 'ejs');
app.use(express.urlencoded({extended:true}))



const validateEntry = (req , res , next)=>{
    const {error} = entrySchema.validate(req.body)
  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  }else{
    next()
  }
}
const validateComment = (req , res , next)=>{
    const {error} = commentSchema.validate(req.body)
  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  }else{
    next()
  }
}

app.get('/' , (req , res) =>{
    res.render('home')

})

app.get('/entries' , catchAsync(async (req , res) =>{
    const entries = await Journex.find({})
    res.render('entry' , {entries})
    
}))

app.get('/entries/new' , (req , res) =>{
 res.render ('new')
})


app.post ('/entries' ,validateEntry, catchAsync (async (req , res , next) =>{
    const entryData = req.body.entry
    entryData.isPublic = entryData.isPublic === 'on' // 👈 convert 'on' to true
    const entries = new Journex(entryData)
    await entries.save()
    res.redirect (`/entries/${entries._id}`)
    
}))

app.get('/entries/:id' , catchAsync( async(req , res) =>{
    const entries = await Journex.findById(req.params.id).populate('comment')
    res.render('show' , {entries})
} ))

app.get('/entries/:id/edit' , catchAsync(async (req , res) =>{
     const entries = await Journex.findById(req.params.id)
    res.render('edit' , {entries})

}))

app.put ('/entries/:id' , validateEntry, catchAsync(async (req , res) =>{
    const {id} = req.params
    const entryData = req.body.entry
    entryData.isPublic = entryData.isPublic === 'on' // 👈 convert 'on' to true
    const entries = await Journex.findByIdAndUpdate(id , {...entryData})
     res.redirect (`/entries/${entries._id}`)
}))

app.delete('/entries/:id' , catchAsync(async (req , res) =>{
    const {id} = req.params
    const entries = await Journex.findByIdAndDelete(id)
     res.redirect ('/entries');
}))


app.post('/entries/:id/comments' , validateComment, catchAsync (async(req,res)=>{
   const entries = await Journex.findById(req.params.id)
   const comment = new Comment(req.body.comment)
   entries.comment.push(comment)
await comment.save()
await entries.save()
res.redirect (`/entries/${entries._id}`);

}))


app.delete('/entries/:id/comments/:commentId' , catchAsync(async (req , res)=>{
    const {id , commentId} = req.params
    await Journex.findByIdAndUpdate(id , {$pull:{comment: commentId} })
 await Comment.findByIdAndDelete(commentId)
 res.redirect(`/entries/${id}`)
}))

app.all('/{*path}', (req, res, next) =>{
    next (new ExpressError('Page Not Found' , 404))
})

app.use((err , req , res , next) =>{
    const {status =500} = err
    if(!err.message) err.message = 'oops something went wrong'
    res.status(status).render('error' , {err})
  
})


app.listen(3000  ,()=>{
 console.log('APP IS LISTENING AT PORT 3000')
})