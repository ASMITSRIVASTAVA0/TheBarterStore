// route ke common part ko hta de app.use me likh dete

const express=require("express");
// const router=express.Router();
const router=express.Router({mergeParams:true});
// par ke route====/listings/:id/review
// listing id ko access krne ke lie mergeParams

const wrapAsync=require("../utils/wrapAsync.js");
// const ExpressError=require("../models/review.js");
// const {listingSchema,reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");

const Listing=require("../models/listing.js");//Schema defined is liye me(model)

const reviewController=require("../controllers/reviews.js");

const {validateReview,isLoggedIn,isOwner,isReviewAuthor}=require("../middleware.js");
// const validateReview=(req,res,next)=>{
//     let {error}=reviewSchema.validate(req.body);
//     if(error)
//     {
//         let errMsg=error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }
//     else{
//         next();
//     }
// }


// review post route
router.post("/", 
    // error handling ke liye pass func as midware
    isLoggedIn,//jo logged ho vo hi post kr skta
    validateReview,
    // wrap bhi kro
    wrapAsync (reviewController.createReview )
)

// review delete route

// pull operator removes from an existing arr all instances of a value or values that match a specifie condition

// app.delete("/listings/:id/:reviewId",
//     wrapAsync(async (req,res)=>{
//         let {id,reviewId}=req.params;
//         console.log("delet route");
//         // res.send("delete");
//         // id se listing find ki phir us list ke andar reviews[] me jake reviewId pull(delete) ki
//         let res1=await Listing.findByIdAndUpdate(id, { $pull: {reviews:reviewId}});
//         let res2=await Review.findByIdAndDelete(reviewId);
//         console.log(res1);
//         console.log(res2);
//         res.redirect(`/listings/${id}`);
//     })
// )
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync (reviewController.destroyReview)
)

module.exports=router;