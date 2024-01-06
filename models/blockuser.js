const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const User=require("./user.js");

const blockUserSchema=new Schema({
    blockuser:{
        type:Schema.Types.ObjectId,
        rel:"User",
    }
})

module.exports=mongoose.model("BlockUser",blockUserSchema);