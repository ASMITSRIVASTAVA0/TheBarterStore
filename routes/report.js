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

router.delete("/:id/:productid",async(req,res)=>{
    
    res.send("delete");
})

module.exports=router;