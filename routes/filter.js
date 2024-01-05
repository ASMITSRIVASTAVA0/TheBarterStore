const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {isLoggedIn,validateFeedback}=require("../middleware.js");


// router.get("/",async(req,res)=>{
//     res.send("working");
// })
router.get("/",
    // isLoggedIn,
    async (req,res,next)=>{
        // let allFeeds=await Feedback.find({})
        // .populate("author");
        res.send("workng");
        // req.flash("success","Welcome to Feedback section");
        // res.render("../views/feedbacks/index.ejs",{allFeeds});
    }
)