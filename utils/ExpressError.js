// Error inbuild class
// ExpressError hamari class 


// expresserror class inherit kr rha error class ke
// error(parent class) me statuscode,mess defined hoge jinki by-default value kuc hogi
// agar sirf erro ko use krege to by-default (500 server error) dega
// isliye custom class bnai ExpressError joki error ki sari default value lega using super()
// pr statuscode aur message hmara set krega
class ExpressError extends Error{
    constructor(statusCode,message){
        super();
        this.statusCode=statusCode;
        this.message=message;
    }
}
module.exports=ExpressError;