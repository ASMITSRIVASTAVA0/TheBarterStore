// chuki require keyword use to sb kuc send hoga
// {....} krke particular key value (obj) destructure kr lete 


const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const Feedback=require("./models/feedback.js");

// for validation
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema,feedbackSchema}=require("./schema.js");//Joi k schema

module.exports.isLoggedIn=(req,res,next)=>{
    // console.log("jaha redirect hone wala tha===="+req.path);
    console.log(req.originalUrl);//complete url taki jaha tha vahi se aage bde
    if(!req.isAuthenticated())
    //method defined inside passport
    // ye method tb jb user username,password dalega
    {
        // save redirect url taki jb saveRedirect ulr ke call lge to 
        // url fetch kr ske 
        // at first logged in nhi hoga jb login ho tb url save kro
        // ek session me ek baar login,to ek baar hi redirecturl save kri jayegi
        // console.log(req.session);
        req.session.redirectUrl=req.originalUrl;
        // req.session sbke paas usme ek key-value aur add 
        req.flash("error","You must be logged in first");
        return res.redirect("/login");
    }
    
    next();
}

module.exports.isAdmin=async(req,res,next)=>{
    // console.log("currsure"+req.body.currUser);
    // console.log(req.body.password);
    let key=req.body.key;
    // agar key enter n ki to koi baat nhi
    if(!key)
    {
        return next();
    }
    if(key==="adminkey")
    {
        req.flash("success","Welcome to Admin");
        console.log(key);
        return next();
    }
    req.flash("error","You are not the Admin!");
    res.redirect("/login");
}

// session se locals me url save kri
module.exports.saveRedirectUrl=(req,res,next)=>{
    console.log("save midware="+req.session.redirectUrl);
    if(req.session.redirectUrl)
    // ye rediectUrl ki isfo upar wale isLoggedIn() se mili
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}



module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if( ! (   listing.owner._id.equals(res.locals.currUser._id)    || res.locals.currUser.admin  )  )
    {
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(  !    (review.author.equals(res.locals.currUser._id) ||   res.locals.currUser.admin  )  )
    {
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.validateListing=(req,res,next)=>{
    // .validate joi me defined as listingSchema joi k obj to use kr skte
    let {error}=listingSchema.validate(req.body);
    let imgurl=req.body.listing.image.url;
    console.log("inside middleware==="+imgurl);
    // req.body me listing obj h
    // listing obj should follow joi schema/listingSchema 
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else
    {
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    if(!req.body.review.rating)
    req.body.review.rating=5;

    let {error}=reviewSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

module.exports.validateFeedback=(req,res,next)=>{
    if(!req.body.feedback.rating)
    req.body.feedback.rating=5;

    let {error}=feedbackSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else
    {
        next();
    }
}

module.exports.checkFileType=()=>{
    
}