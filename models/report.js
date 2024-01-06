const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const User=require("./user.js");
const Listing=require("./listing.js");

const reportSchema=new Schema({
    from:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    to:{
        type:Schema.Types.ObjectId,
        // ref:"Listing",
        ref:"User",

    },
    product:{
        type:Schema.Types.ObjectId,
        ref:"Listing",

    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    message:{
        type:String,
    },
    resolved:{
        type:Boolean,
        default:false,
    }

    
})


module.exports=mongoose.model("Report",reportSchema);