if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/User')


const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig ={
    secret:'Needabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+ 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
    
}



app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))


mongoose.connect('mongodb://127.0.0.1:27017/Yelp')
.then(()=>{
    console.log("Connection Open")
})
.catch(err =>{
     console.log("Oh No error")
     console.log(err)
})

app.use(session(sessionConfig))
app.use(flash());


app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.del = req.flash('del');
    res.locals.error = req.flash('error')
    next();
 })




app.get('/fakeUser',async(req,res)=>{
    const user = new User({email:'vishcolt@gmail.com',username:'vishcolt',})
    const newUser = await User.register(user,'vk3723')  
    res.send(newUser)
})
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);
app.use('/',userRoutes);

app.get('/',(req,res)=>{
    res.render('home');
})


app.all('*',(req,res,next)=>{
    next (new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next)=>{
  const {statusCode=500}=err;
  if(!err.message) err.message="Oh No!, Something went wrong";
  res.status(statusCode).render('error',{err});
})

app.listen(3000,()=>{
    console.log("serving on port 3000");
})