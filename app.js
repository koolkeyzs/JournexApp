const express = require('express');
const app = express();
const mongoose = require ('mongoose')
const path = require ('path');
const Ejsmate = require('ejs-mate')
const Journex = require ('./model/journex');
const catchAsync = require ('./utils/CatchAsync')
const ExpressError = require ('./utils/ExpressErrors')
const joi = require('joi')
const session = require('express-session')
const flash = require('connect-flash')
const {entrySchema, commentSchema} = require('./model/JOIschema')
const Comment = require('./model/comments')
const entryRoutes = require ('./routes/entry')
const commentRoutes = require('./routes/comment')

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


app.get('/' , (req , res) =>{
    res.render('home')

})


const sessionConfig = {
    secret : 'I have a Secret',
    resave: false,
    saveUninitialized : true,
    cookie:{
        httpOnly : true,
expires : Date.now() + 1000 *60 *60 *24 * 7,
maxAge: 1000 *60 *60 *24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())


app.use((req , res , next) =>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/entries' , entryRoutes)
app.use('/entries/:id/comments' , commentRoutes)


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