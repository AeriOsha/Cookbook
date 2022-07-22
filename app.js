if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express');
const session = require('express-session')
const path = require('path');
const flash = require('connect-flash')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { recioeSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const {MongoStore} = require("connect-mongo")
const mongoSanitize = require('express-mongo-sanitize')


const recipes = require('./routes/recipes')
const reviews = require('./routes/reviews')
const userRoutes = require('./routes/user')

const MongoDBStore = require("connect-mongo")(session)
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'
//'mongodb://localhost:27017/yelp-camp
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({
    replaceWith:''
}))

const secret = process.env.SECRET || 'thisshouldbeabettersecret'

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter:24 * 3600
})
store.on('error', function (e){
    console.log("Session store error", e)
})

const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized:true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next) =>{
    console.log(req.session)
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


app.use('/',userRoutes)
app.use('/recipes', recipes)
app.use('/recipes/:id/reviews', reviews)


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('Serving on port 3000')
})