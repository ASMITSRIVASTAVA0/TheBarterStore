const express=require("express");
const router=express.Router({mergeParams:true});


const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");

const Message=require("../models/msg.js");

const {isLoggedIn}=require("../middleware.js");

// router.get("/:id",async(req,res)=>{
router.post("/:id",async(req,res)=>{
    let {id}=req.params;
    // let message=await Message.findById(id);
    let message=await Message.findById(id)
    .populate("from")
    .populate("to");
    message.replied=true;

    let repliedMsg=await message.save();
    console.log(repliedMsg);

    let adminMsg=req.body.message;

    let from=message.to;
    let to=message.from;

    let newMessage=new Message();
    newMessage.from=from._id;
    newMessage.to=to._id;
    newMessage.message=adminMsg;
    newMessage.replied=true;
    newMessage.fromadmin=true;

    let result=await newMessage.save();
    console.log(result);
    
    // console.log("newmssage="+newMessage);


    // res.send(adminMsg+" "+from+" "+to);
    req.flash("success","Replied Successfully");
    res.redirect("/listings/reports/inbox");
    // res.send(message);
})
router.delete("/:id",async(req,res)=>{
    let {id}=req.params;
    // let message=await Message.findById(id)
    // .populate("from")
    // .populate("to");
    let deleteMsg=await Message.findByIdAndDelete(id);
    
    console.log("delmsg="+deleteMsg);

    // res.send("delete" +message);
    // res.send("delete");
    res.redirect("/listings/reports/inbox");
})

module.exports=router;