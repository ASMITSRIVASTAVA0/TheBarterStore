// exports jrur krna
const express=require("express");
const router=express.Router({mergeParams:true});

const Report=require("../models/report.js");
const Listing=require("../models/listing.js");
// const app=require("express");
// const router=app.Router;

const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {isLoggedIn,validateFeedback}=require("../middleware.js");



router.get("/",async(req,res)=>{
    // res.send("reports");

    // const allReports=await Report.findById(id)
    const allReports=await Report.find({})
  
    .populate("from")
    .populate("to")
    .populate("product");

    console.log(allReports);
    // let allReports=await Report.find({});
    // allReports.populate("to");
    res.render("../views/reports/index.ejs",{allReports});
    // allReports.populate
    // let Report=await Report.findById("6597c2294c3ce8b9c8750d67");
    // Report.populate("from").populate("to").populate("product");
    // res.render("../views/reports/index.ejs",{Report});
})

router.post("/:id",async(req,res)=>{
    let {id}=req.params;
    let newreport=await Report.findById(id);
    newreport.resolved=true;
    newreport.createdAt=Date.now;
    
    let result=await newreport.save();
    console.log(result);
    // res.send("resolved");
    req.flash("success","Report Resolved Successfully");
    res.redirect("/listings/reports");
})

router.post("/:id/:productid",async(req,res)=>{
    let {id}=req.params;
    let {productid}=req.params;
    console.log(id);
    console.log(productid);



    let listing=await Listing.findByIdAndDelete(productid);
    let report=await Report.findById(id);
    report.resolved=true;
    let result=await report.save();
    console.log(result);

    console.log(listing);
    // console.log(report);
    res.redirect("/listings/reports");
    // res.send("delete");
})
// router.post("/:toid",async(req,res)=>{
//     let {toid}=req.params;
//     let blockUser=new blockuser()
// })





module.exports=router;