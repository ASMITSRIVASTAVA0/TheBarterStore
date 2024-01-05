const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const User=require("./user.js");

const feedbackSchema=new Schema({
    comment:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    name:{
        type:String,
        required:true,
    }
})

module.exports=mongoose.model("Feedback",feedbackSchema);