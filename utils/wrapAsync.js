// function wrapAsync(fn){
// jo func as para ayega uske andar req,res,next defined hoga
// usi func ko phir execute kiya
module.exports=(fn)=>{
    return (req,res,next) => {
        // normal function execution if get error call next midware
        // so dont have to write try and catch on every funciton
        fn(req,res,next)
        .catch(next);
    }

}