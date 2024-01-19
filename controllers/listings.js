// is callbacks store kro
const Listing=require("../models/listing");
const User=require("../models/user.js");
const Report=require("../models/report.js");
const Message=require("../models/msg.js");

// const mbxTilesets = require('@mapbox/mapbox-sdk/services/tilesets');

// mapbox-geocoding===https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md#geocodingv6
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding");
// kai services me geocoding use kr rhe
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken});

module.exports.index= async (req,res)=>{
    // basically init/data.js ko allListings me dala
    const allListings=await Listing.find({});
    let msgCount=0;
    // const msgCount=0;
    if(req.user){
    const allMessage=await Message.find({to:req.user._id});
    msgCount=allMessage.length;
    }
    // else
    // {const msgCount=0;}
    console.log(msgCount);
    // res.send(allList);
    // chuki views join path h pr listing nhi to/listings/index.js
    res.render("./listings/index.ejs",{allListings,msgCount});//,{msgCount});
    // res.render
    // res.render("/listings/index.ejs",{allListings});

}

module.exports.renderNewForm=async (req,res)=>{
    // res.send("edit form");
    // req.isAuthenticated() is inbuild func given by passport
    console.log(req.user);
    
    res.render("./listings/new.ejs");
}

module.exports.showListing=async (req,res)=>{
    // wrapAsync me isliye daala kyuki agar agar id manually daali to error ayega
    let {id}=req.params;
    // const listing=await Listing.findById(id);

    const listing=await Listing.findById(id)
    // .populate("reviews")
    // samajh lo listing ke path me review h aur uske path me author ,to author ko bhi populate
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        }
    })
    .populate("owner");//samajh lo jis key ko populate krte uska data milta instead of id

    if(!listing)
    {
        req.flash("error","Product you requested for doesn't exist!");
        res.redirect("/listings");
    }
    // console.log(listing);
    // populate----review arr h obj id k use populate kene se listing body me review ki details dikhegi
    res.render("./listings/show.ejs",{listing});
}

module.exports.createListing=async (req,res,next)=>{
    /*
    // agar hoppscoth se is route pr post req bheji aur list me kuc n dala
    if(!req.body.listing)
    // 400====bad request
    throw new ExpressError(400,"Send valid data for listing");

    const newListing=new Listing(req.body.listing);
    // agar list bheji hoppscotch se pr required fields n bheji
    if(!newListing.title)
    throw new ExpressError(400,"Title is missings");
    if(!newListing.description)
    throw new ExpressError(400,"Description is missing");
    if(!newListing.location)
    throw new ExpressError(400,"location is missing");

    */

    // console.log(req.body.listing);
    // href="https://github.com/mapbox/mapbox-sdk-js/blob/main/docs/services.md#forwardgeocode-1"

    // geocoding ek cliet h joki forward and reverse(backword) coding krata
    let result=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1//delhi badi jagah to kai coordinate a skte to 1(limit) coordinate chahiye
    })
      .send()
        // .then(response => {
        //   const match = response.body;
        // });


    //   console.log(result);
    // console.log(result.body);
    // console.log(result.body.features);
    // console.log(result.body.features[0].geometry);
    // console.log(result.body.features[0].geometry.coordinates);//longitude pehle 
    //   res.send("done!");

    console.log(req.file);
    let url=req.file.path;
    let filename=req.file.filename;

    const newListing=new Listing(req.body.listing);
    // passport user me kai info store krta

    newListing.owner=req.user._id;
    newListing.image={url,filename};
    // if( ! newListing.image)
    // newListing.image.url="../public/views/pics/book.png";
    let imgurl=newListing.image.url;
    // let type=await checkFileType();
    newListing.geometry=result.body.features[0].geometry;

    let savedListing=await newListing.save();
    console.log(savedListing);
    // redirect ke pehle
    req.flash("success","New Product added!");

    res.redirect("/listings");
}

module.exports.renderEditForm=async (req,res)=>{
    // agar manually glt id daali to error islye wrapAsync
    let {id}=req.params;
    const listing=await Listing.findById(id);

    if(!listing)
    {
        req.flash("error","Product you requested for edit doesn't exist!");
        res.redirect("/listings");
    }

    // chahte ki preview img km quality ki ho,to cloudinary api ko change krke quality,etc ki facility deta
    // let originalImageUrl=listing.image.url;
    // originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250/e_blur:300");//300px,250px
    listing.image.url=listing.image.url.replace("/upload","/upload/h_300,w_250/e_blur:200");
    // console.log(originalImageUrl);
    console.log(listing.image.url);
    res.render("listings/edit.ejs",{listing});
}

module.exports.updateListing=async (req,res)=>{
    // if(!req.body.listing)
    // throw new ExpressError(400,"Send valid data for listing");
    // return res.redirect(`/listings/${id}`);
    // extract id for update 
    let {id}=req.params;
    // console.log(id);
    // listing body me js obj h jisme sare parameter h
    // deconstruct krke unko individual values me convert

    // koi hopscotch se kisi aur ki listing update nhi kr paye esliye
    // let listing=await Listing.findById(id);
    // if(!listing.owner._id.equals(res.locals.currUser._id))
    // {
    //     req.flash("error","You don't have permission to edit");
    //     return res.redirect(`/listings/${id}`);
    // }
    
    let newListing=await Listing.findById(id);

    // let result=geocodingClient.forwordGeocode({
    //     query:req.body.listing.location,
    //     limit:1,
    // })
    // .send()
    let result=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1//delhi badi jagah to kai coordinate a skte to 1(limit) coordinate chahiye
    })
      .send()

    newListing.geometry=result.body.features[0].geometry;

    // 
    newListing.title=req.body.listing.title;
    newListing.description=req.body.listing.description;
    newListing.price=req.body.listing.price;
    newListing.location=req.body.listing.location;
    newListing.year=req.body.listing.year;
    newListing.condition=req.body.listing.condition;

    console.log("update route me listing="+newListing);
    await newListing.save();
    
    // let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    // agar new photo dali tbhi 
    if(typeof req.file !="undefined")
    {
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image.url=url;
        listing.image.filename=filename;
        // fir se update
        await listing.save();
    }
    
    // res.redirect("/listings");
    // show wale page pr redirect kro
    // res.redirect(`listings/${id}`); glt as /listings n likha to /listings/listings/id me jayega
    req.flash("success","Product Details Updated!");
    res.redirect(`/listings/${id}`);

}
module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    // taki jo owner h vo hi delete kr paye
    
    // let listing=await Listing.findById(id);
    // if(!listing.owner._id.equals(res.locals.currUser._id))
    // {
    //     req.flash("error","You don't have permission to Delete!");
    //     return res.redirect("/listings");
    // }
    let  allReport=await Report.find({product:id}).deleteMany();
    // let report=await Report.findOneAndDelete({product:id});
    // let result=await report.delete();
    let allMessage=await Message.find({product:id}).deleteMany();
    console.log("alldeleted report:"+allReport);
    console.log("all message delete="+allMessage);
    let deletedList=await Listing.findByIdAndDelete(id);
    console.log(deletedList);

    req.flash("success","Product Deleted!");
    res.redirect("/listings");
}

module.exports.categoryListing=async (req,res)=>{
    // res.send("category");
    const {currCategory:category}=req.params;
    // res.send(category);
    console.log(category);
    let allListings=await Listing.find({category:category});

    req.flash("success","Filter Applied!");

    res.render("../views/category/category.ejs",{allListings});

}

module.exports.renderOwner=async (req,res)=>{
    // res.send("owner.email");
    // let {info:owner}=req.params;
    // res.send(owner.email);
    // res.render("../views/category/owner.ejs",{owner});
    // res.render("../views/category/.ejs",{allListings});
    let {id}=req.params;
    let owner=await User.findById(id);
    res.render("../views/category/owner.ejs",{owner});
}