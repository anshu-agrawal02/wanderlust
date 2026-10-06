if(process.env.NODE_env!= "production"){
    require("dotenv").config();
}

const express = require("express");
const app= express();
const mongoose = require("mongoose");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dburl = process.env.ATLASDB_URL;
const path = require("path")
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const {MongoStore} = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/users.js");

const listingsRouter = require("./Routes/listing.js")
const reviewsRouter = require("./Routes/reviews.js")
const userRouter = require("./Routes/user.js");

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

main().then(()=>{
    console.log("working db");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dburl);
}

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret : process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", ()=>{
    console.log("error in mongo session store",err);
})

const sessionOptions ={ 
    store,
    secret : process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expire : Date.now() * 5*24*60*60*1000,
        maxAge: 5*24*60*60*1000,
        httpOnly:true,
    }
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.deleted= req.flash("deleted");
    res.locals.curUser = req.user;
    next();
})

app.use("/listings",listingsRouter);


app.use("/listings/:id/reviews",reviewsRouter);

app.use("/",userRouter);

app.get("/", (req,res)=>{
    res.redirect("/listings");
})
app.use((req, res, next) => {
    console.log("404 REQUEST:", req.method, req.originalUrl);
    next();
});
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!!"));
});

app.use((err,req,res,next)=>{
    console.error(err);
    let{statusCode=500,message="Something Went Wrong!!"}= err;
    res.status(statusCode).render("listings/error.ejs",{message});
})

app.listen(8080, ()=>{
    console.log("app is listning");
})

