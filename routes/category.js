const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {isLoggedIn,validateFeedback}=require("../middleware.js");

const Feedback=require("../models/feedback.js");

router.get("/",
    isLoggedIn,
    async (req,res,next)=>{
        let allFeeds=await Feedback.find({})
        .populate("author");
        // res.send(allFeeds);
        // req.flash("success","Welcome to Feedback section");
        res.render("../views/feedbacks/index.ejs",{allFeeds});
})

router.post("/",
    isLoggedIn,
    validateFeedback,
    async(req,res,next)=>{

        let feedback=req.body.feedback;
        feedback.author=req.user;
        // res.send(feedback);
        let newFeedback=new Feedback(req.body.feedback);

        // newFeedback.author=req.locals.currUser;
        newFeedback.author=req.user._id;
        // res.send(newFeedback);
        let result=await newFeedback.save();
        // console.log(result);
        res.redirect("/listings/feedback");
    }
)
router.put("/",async(req,res)=>{
    let feedback=req.body.feedback;
    res.send(feedback);
    // res.render("../views/feedbacks/index.ejs");
    // res.redirect("../views/feedbacks/index.ejs");
})
router.put("/:id",async (req,res)=>{
    let {id}=req.params;
    // let feedback2=req.body.feedback;
    let feedback=await Feedback.findById(id);
//    return res.send(feedback2);
    // res.send(feedback);
    // delete existing feedback and save new ,but that will change feedback id
    // so har parameter ko manually update
    // if(req.body.feedback.comment)
    feedback.comment=req.body.feedback.comment;

    // agar rating update n ki to tum bhi n kro
    // feedback.rating=1;
    if(req.body.feedback.rating) 
    feedback.rating=req.body.feedback.rating;
    console.log("edited feedback="+feedback);
    // let preFeedback=await Feedback.findById(id);
    // console.log("in mongodb feedback="+preFeedback);

    // save nhi kraya isliye dikkat
    await feedback.save();
    req.flash("success","Feedback edited successfully");
    res.redirect("/listings/feedback");

})
router.delete("/:id",async(req,res)=>{
    let {id}=req.params;
    let result=await Feedback.findByIdAndDelete(id);
    console.log("eleted feedback="+result);
    req.flash("success","Feedback delete successfully");
    res.redirect("/listings/feedback");
})
router.get("/:id/edit",async (req,res,next)=>{
    let {id}=req.params;
    let feedback=await Feedback.findById(id);
    // res.send(feedback);
    res.render("../views/feedbacks/edit.ejs",{feedback});
})



router.get("/new",
    // validateFeedback,
    isLoggedIn,
    async(req,res)=>{
    // res.send("give feedback");
    res.render("../views/feedbacks/new.ejs");
})

module.exports=router;