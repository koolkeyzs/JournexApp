if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}


const sanitizeV5 = require('./utils/mongoSanitizeV5.js');
const express = require('express');
const app = express();
app.set('query parser', 'extended');
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
const dashboardRoutes = require('./routes/dashboard')
const userRoutes = require('./routes/user')
const passport = require('passport')
const passportLocal = require('passport-local')
const User = require('./model/user')
const helmet = require('helmet')
const cors = require('cors')




const allowedOrigins = [
  "http://localhost:5173",
  " http://192.168.69.238:5173/", // update if your IP changes
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman) or from allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
      origin: true, // allows ALL origins
    
}));



app.engine('ejs' ,  Ejsmate)

mongoose.connect('mongodb://localhost:27017/Journex')
const db = mongoose.connection;

db.on('error' , console.error.bind(console , 'Connection-Error'))
db.once ('open'  ,()=>{
    console.log('Database Connected')
})

app.use(express.json())


const methodOverride = require('method-override')
app.use(methodOverride ('_method'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(sanitizeV5({ replaceWith: '_' }));
app.set ('views' , path.join(__dirname, 'views'));
app.set ('view engine', 'ejs');
app.use(express.urlencoded({extended:true}))








const sessionConfig = {
    name: 'session',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,       // explicit false since you're on http:// locally
        sameSite: 'lax',     // explicit, don't rely on browser default
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days — recalculated correctly per session
    }
}


app.use(session(sessionConfig))
app.use(flash())
app.use(helmet({contentSecurityPolicy: false}))



app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



app.use((req , res , next) =>{
    console.log(req.query)
    res.locals.currentUser = req.user
    // res.locals.success = req.flash('success')
    // res.locals.error = req.flash('error')
    next()
})




app.get('/' , (req , res) =>{
    res.render('home')

})


app.use('/entries' , entryRoutes)
app.use('/entries/:id/comments' , commentRoutes)
app.use('/' , userRoutes)
app.use('/dashboard' , dashboardRoutes)


app.use((err, req, res, next) => {
    if(err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Image too large! Maximum 2MB per image' })
    }
    if(err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ message: 'Maximum of 4 images per entry!' })
    }
    next(err)
})

app.use((err, req, res, next) => {
    if(err.name === 'AuthenticationError') {
        return res.status(401).json({ message: 'Incorrect username or password!' })
    }
    next(err)
})



app.all('/{*path}', (req, res, next) =>{
    next (new ExpressError('Page Not Found' , 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err
    if(!err.message) err.message = 'Something went wrong!'
    res.status(status).json({ message: err.message }) 
})



app.listen(3000  , '0.0.0.0',()=>{
 console.log('APP IS LISTENING AT PORT 3000')
})