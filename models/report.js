const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const User=require("./user.js");
const Listing=require("./listing.js");

const reportSchema=new Schema({
    from:{
        type:Schema.Types.ObjectId,
        href:"User",
    },
    to:{
        type:Schema.Types.ObjectId,
        href:"Listing",

    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    message:{
        type:String,
    },
    // image:{
    //     url:String,
    //     filename:String,
    // }
})

// const Report=mongoose.model("Report",reportSchema);
// module.exports=Report;
module.exports=mongoose.model("Report",reportSchema);