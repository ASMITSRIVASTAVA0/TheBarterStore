// just nodemon index.js to reinitialize database

// yaha data.js se data ayega joki reinitalize hoga and save to database
// chuki .deleteMany isliye reinitialize hoga

// ise separately jake initialize krna to connection shuru se setup 

const mongoose=require("mongoose");
const initData=require("./data.js");
// let initData=require("./data.js");
//bahut bde data ko ek line likh ke yaha link kiya

// yaha schema define

// const Listing=require("./models/listing.js");
// ek project me kai models ho skte yaha ek model require kiya jisme uska schema defined h
const Listing=require("../models/listing.js");

// connection setup
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

// func definition
const initDB=async ()=>{
    // chuki reinitialize to purana data clear
    await Listing.deleteMany({});

    // initData object jisne data.js file require ki=====const initData=require("./data.js");
    // file me andar "module.exports = { data: sampleListings };"
    // to data dey ko access
    // .data h array of obj

    // har listing k owner manually add krne ki jagah existing obj(...obj) me ower property ad
    // map func return new arr,so store it in existing arr
    // let asmit52 be owner
    initData.data=initData.data.map((obj)=>({...obj,owner:'658b075e11fa18289f8fee00'}));
    await Listing.insertMany(initData.data);
    console.log("data was RE-initialized");
}
// func call
initDB();
