// exports jrur krna
const express=require("express");
const router=express.Router({mergeParams:true});

const Report=require("../models/report.js");
// const app=require("express");
// const router=app.Router;

const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {isLoggedIn,validateFeedback}=require("../middleware.js");


router.get("/",async(req,res)=>{
    // res.send("reports");
    let allReports=await Report.find({});
    res.render("../views/reports/index.ejs",{allReports});
})

module.exports=router;