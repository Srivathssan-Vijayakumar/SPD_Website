var express = require('express')
var router = express.Router()
var Data= require('../config/data')
const passport = require('passport')

router.get("/",function(req,res){
    res.render("login",{
        title:"Log In"
    })
})

router.post("/",function(req,res,next){
    var username= req.body.username
    var password = req.body.password
    var type= req.body.flexRadioDefault
    var students = Data.Students
    var mentors = Data.Mentors
    if(username==""){
        req.flash('danger','Username is Empty')
        res.render("login",{
            title:"Log In"
        })
    }
    else if(password==""){
        req.flash('danger','Password is Empty')
        res.render("login",{
            title:"Log In"
        })
    }
    else{
        if(type==="Admin"){
            if(username==="Vathssan" && password==="admin"){
                req.flash('success',"Logged In Successfully")
                res.locals.user={admin:1};
                res.redirect("/admin")  
            }
            else{
                req.flash('danger','Incorrect Username or Password')
                res.redirect("/")
            }
        }
        else if(type==="Mentor"){
            passport.authenticate('mentor-signup',{
                successRedirect:'/mentor',
                failureRedirect:'/',
                failureFlash:true
            })(req,res,next);
        }
        else{
            passport.authenticate('student-signup',{
                successRedirect:'/student',
                failureRedirect:'/',
                failureFlash:true
            })(req,res,next);
        }
    }
});
router.get("/logout",(req,res)=>{
    req.logout();
    req.flash('success','You Have Logged Out!');
    res.redirect('/');
})

module.exports=router