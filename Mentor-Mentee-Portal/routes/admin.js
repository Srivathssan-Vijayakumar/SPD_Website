var express = require('express')
var router = express.Router()
var Data = require('../config/data');
var Mentors=Data.Mentors;
var Students=Data.Students;
var Webinars = Data.Webinars;
var Feedbacks = Data.Feedbacks;

router.get("/",(req,res)=>{
    if(!res.locals.user){
        res.render("admin",{
            title:"Admin Page"
        })
    }else{
        req.flash("danger","Please Log In As Admin");
        res.render("login",{
            title:"Log In"
        });
    }
});

router.get("/view-feedback",(req,res)=>{
 res.render("view_feedback",{
    title:"The View Feedback Section",
    mentors:Mentors
 })
});

router.get("/view-feedback/:name",(req,res)=>{
    var concerned_webinars=[]
    Webinars.forEach((webinar)=>{
        if(webinar.mentor==req.params.name){
            concerned_webinars.push(webinar);
        }
    })
    res.render("view_feedback_mentor",{
        title:"View Feedback Of Mentor",
        webinars:concerned_webinars,
        mentor_name:req.params.name
    })
});

router.get("/view-feedback/:name/:webinar",(req,res)=>{
    concerned_feedbacks=[];
    Feedbacks.forEach((feedback)=>{
        if(feedback.webinar==req.params.webinar){
            concerned_feedbacks.push(feedback);
        }
    });
    res.render("view_feedback_webinar",{
        title:"View Feedback Of Webinar",
        feedbacks:concerned_feedbacks,
        mentor:req.params.name,
        webinar:req.params.webinar
    });
});

router.get("/assign-mentors",(req,res)=>{
    res.render("assign_mentors",{
        title:"Assign Mentor Section",
        students:Students,
        mentors:Mentors
    })
});

router.get("/add-mentor",(req,res)=>{
    res.send("The Add Mentor Section");
});

router.get("/add-student",(req,res)=>{
    res.send("The Add Student Section");
});
module.exports=router