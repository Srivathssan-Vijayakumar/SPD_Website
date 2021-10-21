var express = require('express')
var router = express.Router()
var Data = require('../config/data')
var Students=Data.Students;
var Mentors = Data.Mentors;
var Webinars=Data.Webinars;
var Tests = Data.Tests;
router.get("/",(req,res)=>{
    if(res.locals.user){
        res.render("mentor",{
            title:"Mentor-Page",
            username:res.locals.user.username
        })
    }else{
        res.render("mentor",{
            title:"Mentor-Page",
            username:null
        })
    }
})

router.get('/schedule-test',(req,res)=>{
    if(res.locals.user){
        res.render("schedule_test",{
            title:"Scheduling Test Section",
            username:res.locals.user.username,
            mentors:Mentors
        })
    }else{
        req.flash('danger','Please Log In To Continue');
        res.render("login",{
            title:"Log In"
        });
    }
})
router.get('/schedule-webinar',(req,res)=>{
    if(res.locals.user){
        res.render("schedule_webinar",{
            title:"Scheduling Webinar Section",
            username:res.locals.user.username,
            mentors:Mentors
        })
    }else{
        req.flash('danger','Please Log In To Continue');
        res.render("login",{
            title:"Log In"
        });
    }
})
router.get('/attendance',(req,res)=>{
    if(res.locals.user){
        res.render("mark_attendance",{
            title:"Marking Attendance Section",
            username:res.locals.user.username,
            students:Students,
            mentor_name:res.locals.user.Name,
            webinars:Webinars
        })
    }else{
        req.flash('danger','Please Log In To Continue');
        res.render("login",{
            title:"Log In"
        });
    }
})
router.get('/grade-students',(req,res)=>{
    if(res.locals.user){
        res.render("grade_students",{
            title:"Grading Students Section",
            username:res.locals.user.username,
            students:Students,
            mentor_name:res.locals.user.Name,
            tests:Tests
        })
    }else{
        req.flash('danger','Please Log In To Continue');
        res.render("login",{
            title:"Log In"
        });
    }
})
router.get('/view-attendance',(req,res)=>{
    if(res.locals.user){
        res.render("view_attendance",{
            title:"Attendace Details Section",
            username:res.locals.user.username,
            students:Students,
            mentor_name:res.locals.user.Name
        })
    }else{
        req.flash('danger','Please Log In To Continue');
        res.render("login",{
            title:"Log In"
        });
    }
})
module.exports=router