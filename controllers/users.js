const User=require("../models/user.js");
const path=require("path");

module.exports.renderSignupForm=(req,res)=>{
    const signupViewPath=path.join(__dirname,"../views/user/signup.ejs");
    res.render(signupViewPath);
}

module.exports.signup=async (req,res)=>{
    try{
        let {username,email,password,bio,year,key}=req.body;

        let admin=false;
        if(key===process.env.ADMIN-KEY)
        admin=true;



        const newUser=new User({email,username,bio,year,admin});
        const registeredUser=await User.register(newUser,password);
        // chahte ki signup ke sath ke baad phir se login n krna pde seedhe login ho
        req.login(registeredUser,(err)=>{
                if(err)
                return next(err);
                
            
            req.flash("success","Welcome to TheBarter Store!");
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

module.exports.login=async (req,res,next)=>{
        let username=req.body.username;
    let key=req.body.key;
    if(username==="ADMIN"&&(!key)){
        req.flash("error","Admin requires secret key");
        return res.redirect("/admin");
    }
    req.flash("success","Welcome Back to TheBarter Store");

    // ek authentication ho jata passport req.session ke extra variable ko delete kr deta so its undedined
    // to access redirecturl save it to req.locals thus passport cant delete it
    // agar seedhe login krege to isLoggedIn midware trigger n hua to rediect url undefined
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
}

module.exports.renderLoginForm=(req,res)=>{
    const loginViewPath=path.join(__dirname,"../views/user/login.ejs");
    res.render(loginViewPath);
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