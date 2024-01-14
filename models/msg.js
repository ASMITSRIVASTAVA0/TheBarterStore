const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const User=require("./user.js");

const msgSchema=new Schema({
    
    from:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    fromadmin:{
        type:Boolean,
        default:false,
    },
    to:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    message:{
        type:String,
        required:true,
    },
    product:{
        type:Schema.Types.ObjectId,
        ref:"Listing",
        // required:true,
    },
    address:{
        type:String,
        // required:true,
    },
    contact:{
        type:String,
        // required:true,
    },
    replied:{
        type:Boolean,
        default:false,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
})

module.exports=mongoose.model("Message",msgSchema);