// npm init -y
// npm i express
// npm i ejs
// npm i mongoose
// npm i method-override
// npm i ejs-mate

// npm install cookie-parser

// npm install express-session
// npm i connect-flash

// npm i joi  (to validate schema from server side(hopscotch))

// website====passportjs.org
// npm i passport
// npm i passport-local
// npm i passport-local-mongoose   =====taki moongoose sath sahi chle

// npm i multer===taki form se file upload kr ske
// npm i dotenv
// npm i cloudinary
// npm i multer-storage-cloudinary

// npm i @mapbox/mapbox-sdk

// npm i connect-mongo===express-session local storage ke liye jb online dalege to 

// npm i nodemailer


// jb database ko initialize terminal me cd/"Desktop"/..../init me index.js command dena


// har koi ye file ko n dekhe
var atlasdb_url;
if(process.env.NODE_ENV!="production")
{
    // dotenv file ko tabhi es file me require jb ye project production level pr nhi
    require("dotenv").config();
    atlasdb_url=process.env.ATLASDB_URL;
    console.log(process.env.ATLASDB_URL);
    // console.log(process.env);
    console.log(process.env.MAP_TOKEN);
    console.log(process.env.SECRET);
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");

// error handling
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");

const session=require("express-session");
// flash session ke baad use
const flash=require("connect-flash");
// session ke baad connect mongo
const MongoStore=require("connect-mongo");


// authentication
const passport=require("passport");
const LocalStrategy=require("passport-local");


const User=require("./models/user.js");

const middleware=require("./middleware.js");

// reviews
const Review=require("./models/review.js");



// structing route using express
// /listing route me jaha bhi call vaha listings use so app.use("/listings",listingRouter);
// route ko struct krne ke baad sirf ek line likh ke get,post,delete,... route chl rhe
// app.use("/listings",listings);
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");//ye model h
const userRouter=require("./routes/user.js");
const categoryRouter=require("./routes/category.js");
const filterRouter=require("./routes/filter.js");
const reportRouter=require("./routes/report.js");
const msgRouter=require("./routes/msg.js");
// ejs-mate k setup
// ejs-mate se template(boilerplate bna skte hr ejs file k) milte
const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);

// method override
// to send req other than get and post from forms
const methodOverride=require("method-override");
app.use(methodOverride("_method"));

// setup for ejs
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// to use delete patch ,etc req
// to read get req data
app.use(express.urlencoded({extended:true}));

// from chatgpt
const bodyParser=require("body-parser");
app.use(bodyParser.json());

// listing.js ke andar schema btaya aur listing collection bna ke export
// listings.js me sirf Listing k schema define h
// /init/index.js ko require nhi as dono separetely mongodb se connected h
// data initialize k kaam sirf index.js k joki separately kiya j skta
const Listing=require("./models/listing.js");


// setup to serve static files
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.static(path.join(__dirname,"/includes")));
//ab /public/css/style nhi ,bs /css/style as pubic and app.js is joined
// ab style.css sirf boiler plate me link krege to sbme link hoyegi


// joi k schema moongoose k schema nhi hota
// ye server side(hopscotch) validation k schema hota
// form se cliet side validation ki by not allowing user to leave required fields
// pr agar hopscotch se glt info aai to uske liye joi
const {listingSchema,reviewSchema}=require("./schema.js");
const { stringify } = require("querystring");
// const {listingSchema}=require("./schema.js");

// make h func to perform work of Joi check req.body when data se send from hopscotch/postman
// const validateListing=(req,res,next)=>{
//     let result=listingSchema.validate(req.body);
//     // samajh lo listingSchema Joi k obj (=====listingSchema=Joi.object({=====)
//     // validate Joi k func joki req body ko validate krega
//     console.log(result);
//     if(result.error)
//     {
//         let errMsg=error.details.map((el)=>el.message).join(",");
//         // throw new ExpressError(400,result.error);
//         throw new ExpressError(400,errMsg);
//     }
//     else
//     next();
// // chuki next ko call to ye upar likho
// }
// const validateReview=(req,res,next)=>{
//     let {error}=reviewSchema.validate(req.body);

//     if(error)
//     {
//         let errMsg=error.details.map((el)=el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }
//     else
//     next();
// }

// terminal me mongosh start rkhna


// connect kro db se
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

// let atlasdb_url=process.env.ATLASDB_URL;
// atlasdb_url=atlasdb_url.toString();
// let atlasdb_url=process.env.ATLASDB_URL;
// console.log(atlasdb_url);
// atlasdb_url=atlasdb_url.toString();

// console.log(altasdb_url);nod

main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    // await mongoose.connect(MONGO_URL);
    
    // await mongoose.connect(atlasdb_url);
    // await mongoose.connect(stringify(atlasdb_url));
    // console.log(atlasdb_url);
    // await mongoose.connect(atlasdb_url);
    
    // await mongoose.connect(process.env.ATLASDB_URL);
    await mongoose.connect("mongodb+srv://ASMIT2:Ke6LsoqrpvJI4KJb@cluster1.yddquej.mongodb.net/?retryWrites=true&w=majority");
    
}

// render krane ke liye package.json me "engines":{"node":"20.9.0"}
const store=MongoStore.create({
    // mongoUrl:process.env.ATLASDB_URL,
    // mongoUrl:atlasdb_url,
    mongoUrl:"mongodb+srv://ASMIT2:Ke6LsoqrpvJI4KJb@cluster1.yddquej.mongodb.net/?retryWrites=true&w=majority",
    crypto:{
        // secret:"mysupersecretcode",
        secret:process.env.SECRET
    },
    // time after which session get stop
    touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("Error in Mongo Session Store",err);
})

// req ke pehle session
const sessionOptions={
    store,
    // secret:"mysupersecretcode",
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    // cookie k kaam session track krna
    // by default cookie ki koi expiary date nhi hoti to jb brower bnd kiya to cookie khud delete
    // to expiary date de do,like after login 1 time no need to login again btw 7 days(expiary date)
    cookie:{
        // time in minisecond
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true//ye security purpose se
    }
}
// app.get("/",(req,res)=>{
//     res.send("hi, i am root path");
// })



// route ke pehle session aur flash ko use
// pehle flash phir routes
app.use(session(sessionOptions));
// to check session working or not go to inspect then application if connect.sid is there then ok
// session ke baad flash
app.use(flash());




// passport authentication use krne ke liye session required
// ek session user ke login credentials common rhege taki har page me login n maange
// step1
app.use(passport.initialize());
//taki har req ke liye passport initialize ho
// passport.session ko as midware use krte
// step2
app.use(passport.session());//ek session me ek baar login
// User model h
// use static authenticate method of model in localstrategy
// authenticate() generate a function that is used in passport's localstrategy
// step3
passport.use(new LocalStrategy(User.authenticate));

// ye khud se search kiya tha
// step4
passport.use(User.createStrategy());//jo User require kiya h usi me te lgaya
// step5
passport.serializeUser(User.serializeUser());//user info ko save krna ek session me
// serializeUser() generate a function that is used by passport to serialize users into session
// deserializeUser() generate a function that is used by passport to deserialize users into session
// step6
passport.deserializeUser(User.deserializeUser());//session khatam hone ke baad 



// route ke pehle midware
// app.use((req,res,next)=>{
//     // console.log(req.flash("success"));
//     res.locals.success=req.flash("success");
//     next();
// })
app.use((req,res,next)=>{
    // console.log("sucess====="+req.flash("success"));
    // abhi flash ki key "success" aur "error" value define nhi kri
    // abhi locals me andar success key bnayi jiski value req.flash se ayegi
    res.locals.success=req.flash("success");
    // res.locals.delete=req.flash("delete");
    // res.locals.errorMsg=req.flash("error");
    res.locals.error=req.flash("error");
    // req.user ko navbar.ejs me direct access n kr skte,so store it in locals
    res.locals.currUser=req.user;
    // console.log(res.locals);
    // locals me khud se success,error,currUser key bna ke value di
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"asmit"
//     });

//     // to save use register
//     let registeredUser=await User.register(fakeUser,"this is password");
//     res.send(registeredUser);
// })

// structuring routes
// route ke reqire hone ke pehle flash k use
// app.use("https://major-project-master.onrder.com/listings",listingRouter);
// app.use("/listings/category",async (req,res,next)=>{
//     res.send("asmit");
// })
app.use("/",userRouter);
app.use("/listings/reports/msg",msgRouter
    // async(req,res)=>{
    // res.send("reply");

)

// app.get("/listings/filter",async(req,res)=>{
//     res.send("working well");
// })
// app.use("/listings/filter",filterRouter);

app.use("/listings/reports",reportRouter
// async(req,res)=>{
    // res.send("report");}
)

app.use("/listings/feedback",categoryRouter);
app.use("/listings",listingRouter);


app.use("/listings/:id/reviews",reviewRouter);//parent route


// structuring review route



// page not found always at last






// for all non defined routes
app.all("*",(req,res,next)=>{
    // Custom error class ExpressError joki child h error class ki uski value assgin
    // next se app.use((err,req,res,next)) route ko call jisse error.ejs render
    // next(new ExpressError(404,"Page not Found"));


    // req.flash("error","Page not Found!");
    // res.send("page not found");
    // res.render("views/listings/index.ejs");
    // req.flash("error","Page not Found");
    res.redirect("/listings");
    // res.render("./views/listings/index.ejs");
    // res.redirect("./public/views/listings/index.ejs");
})

// middleware ko last likha kro sare routes se
app.use((err,req,res,next)=>{
    // ye error express err k jsme next(new Express....)
    let {statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.render("error.ejs",{err});
    // res.status(statusCode).send(message);
    // res.send("something went wrong!");
})


// hashcode ko test
// https://academo.org/demos/SHA-256-hash-generator/

app.listen(8080,()=>{
    console.log("server listening to port 8080");
})



/*

stateful protocol=
require server to save the status and session information
eg.ftp(file transfer protocol)

stateless protocol=
doesnot requiree server to retain server infomation or
eg.http

Express Sessions=
An attempt to make our session stateful


*/

/*

connect-flash=
The flash is a special area of session used for storing messages.
Messages are written to the flash and cleare after begin

to use flash session must be installed

*/

/*

password=
library that helps in authentications


*/

/*

MVC=Model,view,controller
implement design pattern for listings

*/


/*
// pushing to git

step1=git init
agar chahte ki kuc file ko track n kre to gitignore
touch (.)gitignore


*/