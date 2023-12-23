const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    // res.render("/user/login.ejs");
    res.render("C:/Users/sriva/Desktop/java language/Major Project/views/user/signup.ejs");
}

module.exports.signup=async (req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        // chahte ki signup ke sath ke baad phir se login n krna pde seedhe login ho
        req.login(registeredUser,(err)=>{
                if(err){
                return next(err);
            }
            req.flash("success","Welcome to WanderLust!");
            res.redirect("/listings");
        })
        // req.flash("success","Welcome to WanderLust!");

        // res.redirect("/listings");
    }
    catch(err)
    {
        req.flash("error",err.message);
        res.redirect("/signup");
    }
    
}

module.exports.login=async (req,res)=>{
    // res.send("welcome");
    console.log("inside authen"),
    req.flash("success","Welcome Back to Wanderlust");
    // res.redirect("/listings");

    // ek authentication ho jata passport req.session ke extra variable ko delete kr deta so its undedined
    // to access redirecturl save it to req.locals thus passport cant delete it
    // agar seedhe login krege to isLoggedIn midware trigger n hua to rediect url undefined
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
    // res.redirect(res.locals.redirectUrl);
    // res.redirect(req.session.redirectUrl);
}

module.exports.renderLoginForm=(req,res)=>{
    // res.render("/user/login.ejs");
    res.render("C:/Users/sriva/Desktop/java language/Major Project/views/user/login.ejs");
}

module.exports.logout=(req,res,next)=>{
    // req.logout inbuild func by passport and take callback as a parameter
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are Logged Out!");
        res.redirect("/listings");
    });//agar logout time error aaya to err me store hoyega
}