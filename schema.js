const Joi=require("joi");//node_nodules se require kiya

// jis schema ko validate krna uska naam likho

// const listingSchema=Joi.object({

// samajh lo listingsSchema aur listing is /schema.js me defined nhi pr
// app.js me export hone ke baad defined ho jayege
// joi se sirf existing listingSchema ko hi update kiya
// taki hoppscotch se bhi galat info n aaye
module.exports.listingSchema=Joi.object({
    // listing joi ki obj ho aur required ho
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("",null)
    }).required()

})


module.exports.reviewSchema=Joi.object({
    // review joi k obj ho aur required ho
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        // rating:Joi.number().required(),
        comment:Joi.string().required()
    }).required()
})