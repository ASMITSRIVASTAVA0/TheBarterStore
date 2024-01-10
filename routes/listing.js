// structuring routes
// app.use("/listings",listings);
// /listings yaha se aaya aur baki /route(s) me milaga



const express=require("express");
const router=express.Router();

// route me jojo use hua use require
const wrapAsync =require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");//Joi k schema
const Listing=require("../models/listing.js");
const Report=require("../models/report.js");
const Message=require("../models/msg.js");

// to use loggedin middleware
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
// const {isOwner}=require("../middleware.js

const listingController=require("../controllers/listings.js");

const sendMail=require("../controllers/sendmail.js");

// to upload img file
const multer=require("multer");

// upload ke pehle require
const {storage}=require("../cloudConfig.js");
// const upload=multer({dest:"uploads/"});
const upload=multer({storage});
//khud se upload naam ke folder me save krega


// new and create route
// get req bhejege form ko
// form se post req create route pr jayega
// /listing pr jisme nayi listing bna rhe hoge

router.get("/owner/:id",
    isLoggedIn,
    // upload.single("listing[image]"),
    wrapAsync(listingController.renderOwner)
)

// user wala
router.get("/inbox",
    isLoggedIn,
    async(req,res)=>{
    let user=req.user;
    console.log(user);
    let allMessage=await Message.find({to:user._id})
    .populate("from")
    .populate("to")
    .populate("product");
    console.log(allMessage);
    
    // res.render("../views/reports/inbox.ejs",{allMessage});
    res.render("../views/listings/userbox.ejs",{allMessage});
})







router.get("/new",
    isLoggedIn,
    wrapAsync( listingController.renderNewForm)
)

// jin routes k path same pr req diff unko ek sath
router.route("/")
.get(wrapAsync(listingController.index))
.post(
isLoggedIn,
//agar hopscotch is req bheji tb bhi logged in ho
// update aur new route me data add hota to schema ke acc hona chahiye
// validateListing,
upload.single("listing[image]"),//pehle isko call phir aage
// validateListing joi k func
// jb is route me post req ayegi to sath (req,res,next) bhi ayega
// validateListing me parameter ko value mili phir ye func joi k /schema.js se compare krega
wrapAsync(listingController.createListing)
);
// .post(
//     upload.single("listing[image]"),//ek single file ko upload(folder me) kr rhe joki listing[image] se ayegi
//     (req,res)=>{
//     // multer ko use krne se req.body ki tarah req.file jisme file se related data save 
//     // res.send(req.body);
//     res.send(req.file);
//     // pehle output={} kyki abhi urlencoded data ko hi pd payega
//     // go to npmjs.com then multer
// })




// router.route("/category/:currCategory")
// .get(
//     // // res.send("category");
//     // const {currCategory:category}=req.params;
//     // // res.send(category);
//     // console.log(category);
//     // let allListings=await Listing.find({category:category});
//     // res.render("./category/category.ejs",{allListings});

//     wrapAsync(listingController.categoryListing)

// );



router.route("/:id")
.get(wrapAsync( listingController.showListing))
.delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
)
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
)




// index route
// get req accept /listing pr
// sbko wrapAsync me dalo
// router.
// create router (new)upar isliye kyuki show route new ko id samhega



// important


// create route
/*
app.post("/listings",async (req,res,next)=>{
    // agar price me kisi se string bhegi to err so place all in try catch
    // .save me err a skta agar glt data save krna chaha
    try{
        // yaha db me changes
        // extract info
        // way 1
        // let {title,description, image, price, country, location }=req.body;

        // new.ejs ke form me name ko hi listing obj ke key value de

        // let listing=req.body.listing;
        // console.log(listing);
        const newListing=new Listing(req.body.listing);
        console.log(newListing);
        // save is a async func so use await
        await newListing.save();
        res.redirect("/listings");
        // app.post k kaam sirf db update krna uske baad redirect ho main page me
    }
    catch(err)
    {
        next(err);
    }

})*/

// create route 
// validate ko as middleware pass kiya
// add new listing ke form ne iske post req bheji
// router.post("/",
//     isLoggedIn,//agar hopscotch is req bheji tb bhi logged in ho
//     // update aur new route me data add hota to schema ke acc hona chahiye
//     validateListing,//pehle isko call phir aage
//     // validateListing joi k func
//     // jb is route me post req ayegi to sath (req,res,next) bhi ayega
//     // validateListing me parameter ko value mili phir ye func joi k /schema.js se compare krega
//     wrapAsync(listingController.createListing)
// )


// show route 
// yaha har id ke liye get req ayegi 
// is route ko call tb jb root url /listings se tk list ko click

// router.get("/:id",wrapAsync( listingController.showListing))

// update and edit route
// get req ayegi /listings/:id/edit me phir edit.ejs se form 
// jise submit krke put req jaygei /listings/:id me

// edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm )
)




router.get("/:id/buy",
    isLoggedIn,
    wrapAsync(async(req,res,next)=>{
    // res.send("buy");
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("../views/listings/buy.ejs",{listing});
    // res.render("../views/listings/buy.ejs",listing);
    // res.render("..views/listings/buy.ejs",{id});
}))
router.post("/:id/buy",
    // sendMail
    async(req,res)=>{
    let {id}=req.params;
    let product=await Listing.findById(id);
    let address=req.body.info.address;
    let contact=req.body.info.contact;
    let message=req.body.info.message;
    let from=req.user;
    let to=product.owner;

    const newMessage=await Message({});
    newMessage.from=from;
    newMessage.to=to;
    newMessage.message=message;
    newMessage.product=product;
    newMessage.address=address;
    newMessage.contact=contact;
    newMessage.replied=false;

    console.log(newMessage);
    let result=await newMessage.save();


    // res.send(result);
    req.flash("success","Owner of The Product will contact you soon,Thankyou!");
    res.redirect(`/listings/${id}`);
}
)



router.get("/:id/reports",async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("../views/listings/report.ejs",{listing});
})
router.post("/:id/reports",async(req,res,next)=>{
    // res.send("repost");
    let {id}=req.params;
    let listing=await Listing.findById(id);
    let user=req.user;
    let report=req.body.report;
    console.log("user========"+user);
    console.log(report);
    let from=user._id;
    let to=listing.owner._id;
    let product=listing._id;
    let message=report.message;
    


    // let Report=new Report()
    console.log("from========"+from);
    console.log("to======"+to);
    console.log("message======="+message);
    console.log("product===="+product);

    const newReport=new Report();
    newReport.from=from;
    newReport.to=to;
    newReport.product=product;
    newReport.message=message;
    console.log(Report);

    let result=await newReport.save();
    console.log(result);

    req.flash("success","Reported Successfully, We will Take Required Action Soon!")
    res.redirect(`/listings/${id}`);
    // res.render("../views/reports/index.ejs",{user,report,listing});
    // res.send("user===="+user+" LISTING=="+listing+" REPORT===="+report+" reqbody======"+req.body);
})

// router.put("/:id/buy/confirm",async(req,res)=>{
//         res.send("asmit");
//     }
// )

// update route 
// jb edit.ejs form se is route pr put req ayegi
// ye put req aur upar wali get req ek hi route me to yaha se redirect bhi krna pdega
// router.put("/:id",
//     isLoggedIn,
//     isOwner,
//     validateListing,
//     wrapAsync(listingController.updateListing)
// )

// delete route
// req ayegi /listings/:id pr
// router.delete("/:id",
//     isLoggedIn,
//     isOwner,
//     wrapAsync(listingController.destroyListing)
// )


// router obj ke andar ke method defined kiya jaha phir app.js me exports
module.exports=router;

