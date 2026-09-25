const User = require("../models/users.js");

module.exports.signupRender = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async(req,res)=> {
    try{
        let {email,username,password} = req.body;
    const newUser = new User({email,username});
    const registerdUser = await User.register(newUser,password);
    console.log(registerdUser);
    req.login(registerdUser,(err)=>{
        if(err){
            next(err);
        }
        req.flash("success", "welcome!!");
    res.redirect("/listings");
    })
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }

};

module.exports.loginRender = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
        req.flash("success", "welcome back!!");
        let redirectUrl = res.locals.redirectUrl || "/listings"
        res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out!!");
        res.redirect("/listings")
    })
};