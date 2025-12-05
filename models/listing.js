// iske andar listings k schmema

const mongoose=require("mongoose");
const Schema=mongoose.Schema;//taki har baar mongoose.schema n likhna pde

// to delete all reviews after deleting a list
const Review=require("./review.js");
const User=require("./user.js");

const listingSchema=new Schema({//Schema==mongoose.Schema
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    image:{
        // type:String,
        // // agar img url null undefined 
        // default:"https:/image/book....",
        // set:(v)=>
        //     v===""
        //     ?"https://img.freepik.com/free-photo/sunset-time-tropical-beach-sea-with-coconut-palm-tree_74190-1075.jpg?w=900&t=st=1701270371~exp=1701270971~hmac=3bfc8f4609d19c7cdd748c355b387c07d1fa9f6cec5cc51cba5d61a7fb996097"
        //     :v,
        
        // //jo img k url likha vahi dikhao
        url:String,
        filename:String,
        // default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Fvectors%2Fbook&psig=AOvVaw2Hsi-D0g2tVkpLPdF62tiJ&ust=1758521602911000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCOj0vs2Z6Y8DFQAAAAAdAAAAABAE",
        
    },
    price:Number,

    reviews:[
        {
            // objectid store hogi reviews ki
            type:Schema.Types.ObjectId,
            ref:"Review",
            // Review is file me defined nhi pr jb export kiya jayega tb defined ho jaygei av review.js bhi app.js me exported h
        }
    ],
    // har listing k ek owner hona chahiye joki registered user ho
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },


    year:{
        type:String,
        enum:["1year","2year","3year","4year"],
        required:true,
    },
    condition:{
        type:String,
        enum:["new","likenew","unused","acceptable"],
        required:true,
    }
})

// listingsSchema define hone ke pehle midware bnao
// mongoose midware
// un reviews ko delete jo post deleted listing me h
listingSchema.post("findOneAndDelete",async (listing)=>{
    // jo reveiw listingreview array k part h
    // agar listing aai tb hi delete isliye if me daalo
    if(listing)
    {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})



// model(collection) create with name ==Listing
const Listing=mongoose.model("Listing",listingSchema);




// jb ese require kiya jayega ye listing k schema aur model(collection) bna de export krega
module.exports=Listing;//model export