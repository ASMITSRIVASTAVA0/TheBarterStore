const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");

const {saveRedirectUrl,isAdmin}=require("../middleware.js");

const userController=require("../controllers/users.js");


router.get("/admin",async(req,res)=>{
    // res.send("asmit");
    res.render("../views/user/admin.ejs");
})

router.route("/signup")
.get(userController.renderSignupForm)
.post(
    // upload.single("user[profilepic]"),
    wrapAsync(userController.signup)
)

router.route("/login")
.get(userController.renderLoginForm)
.post(
    isAdmin,
    // authentication ke pehle redirecturl extract krni
    saveRedirectUrl,//my function
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true,
        
    })
    ,userController.login
)



// router.get("/signup",userController.renderSignupForm);

// router.post("/signup",
//     wrapAsync(userController.signup)
// )

// router.get("/login",userController.renderLoginForm);


// router.post(
//     "/login",
//     // authentication ke pehle redirecturl extract krni
//     saveRedirectUrl,
//     passport.authenticate("local",{
//         failureRedirect:"/login",
//         failureFlash:true,
        
//     })
//     ,userController.login
// )


router.get("/logout",userController.logout);


module.exports=router;