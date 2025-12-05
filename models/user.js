// src=https://www.npmjs.com/package/passport-local-mongoose
// You're free to define your User how you like. 
// Passport-Local Mongoose will add a username, hash and
// salt field to store the username, the hashed password 
// and the salt value.

/*

configuring strategy=
passport.initialize()=
a midware that initialize passport

passport.session()
a web application needs the ability to identify users as they browse from page to page
this series of req and res ,each associated with same user, is known as a session

passport.use(new LocalStrategy( User.authenticate()))

*/


const { boolean } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

// local-mongoose khud se username aur password(salted wala)  add kr dega to schema 
const userSchema=new Schema({
    email:{
        type:String,
        required:true
    },
    
    bio:{
        type:String,
        required:true
    },
    year:{
        type:Number,
        required:true,
    },
    admin:{
        type:Boolean,
        default:false,
    }
})

// plugin ====salting,hashing,username dena ye sb kr deta
userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);