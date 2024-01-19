// exports jrur krna
const express=require("express");
const router=express.Router({mergeParams:true});

const Report=require("../models/report.js");
const Listing=require("../models/listing.js");
const Message=require("../models/msg.js");
const User=require("../models/user.js");
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
router.get("/inbox",async(req,res)=>{
    let user=req.user;
    let allMessage=await Message.find({to:user._id})
    .populate("from")
    .populate("to")
    .populate("product");
    
    res.render("../views/reports/inbox.ejs",{allMessage});
})
router.delete("/product/delete/:id",async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndDelete(id);
    console.log(listing);
    console.log(id);
    let report =await Report.find({product:id});
    report.resolved=true;
    let resolvedResport=await report.save();
    // let allReports=await Report.find({product:id}).deleteMany();
    // let allReports=await Report.findById({product:id});
    // for(Report of allReports)
    // {
        // Report.resolved=true;
    // }
    
    req.flash("success","Product Deleted Successfully");
    res.redirect("/listings/reports");
    // res.send(listing);
})
router.post("/inbox",async(req,res)=>{
    let message=req.body.message;
    // let user=req.currUser;
    let user=req.user;
    // ye id database se nikali
    let admin=await User.findById("6596bf9dc2cee3a7893ed3dc");

    let newMessage=new Message();
    newMessage.message=message;
    newMessage.from=user;
    // finding admin through id
    newMessage.to=admin;
    // newMessage.product= kux nhi 

    let result= await newMessage.save();
    
    console.log(result);
    // res.send(result);
    req.flash("success","Message Send Successfully, Admin will Contact you soon!");
    res.redirect("/listings");
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
    console.log(listing);
    let report=await Report.findById(id);
    report.resolved=true;
    let result=await report.save();
    console.log(result);

    // console.log(listing);
    // console.log(report);
    res.redirect("/listings/reports");
    // res.send("delete");
})
// router.post("/:toid",async(req,res)=>{
//     let {toid}=req.params;
//     let blockUser=new blockuser()
// })





module.exports=router;