var express = require('express')
var router = express.Router()
var Data = require('../config/data')

router.get("/",(req,res)=>{
    if(res.locals.user){
        res.render("student",{
            title:"Mentor-Student Portal",
            username:res.locals.user.username
        })
    }else{
        res.render("student",{
            title:"Mentor-Student Portal",
            username:null
        })
    }
    // if(res.locals.user){
    //     console.log(res.locals.user)
    //     res.send(`Welcome user ${res.locals.user.username}`);
    // }
    // else{
    //     console.log('No user found')
    //     res.send(`Welcome Guest`)
    // }
    
})

router.get("/tests-webinars",(req,res)=>{
    if(res.locals.user && res.locals.user.Mentor){
        res.render("student_tests",{
            title:"Scheduled Tests and Webinars",
            username:res.locals.user.username,
            tests:Data.Tests,
            webinars:Data.Webinars,
            mentor:res.locals.user.Mentor
        });
    }
    else if(res.locals.user){
        req.flash('danger','Sorry You are not Assigned With a Mentor Currently.');
        res.render("student",{
            title:"Mentor-Student Portal",
            username:res.locals.user.username
        })
    }else{
        req.flash('danger','Please Log In To See Scheduled Tests and Webinars.');
        res.render("login",{
            title:"Log In"
        });
    }
})

router.get("/profile",(req,res)=>{
    if(res.locals.user){
        res.render("student_profile",{
            title:"Profile Page",
            tests:Data.Tests,
            username:res.locals.user.username,
            user:res.locals.user
        })
    }else{
        req.flash('danger','Please Log In To Continue.');
        res.render("login",{
            title:"Log In"
        });
    }
})

router.get("/edit-profile",(req,res)=>{
    res.render("edit_student",{
        title:"Edit-Student-Profile",
        username:res.locals.username
    })
})

router.post("/edit-profile",(req,res)=>{
    req.flash('success','Profile Edited')
    res.redirect("/student/profile");
})

router.get("/feedback",(req,res)=>{
    if(res.locals.user){
        res.render("feedback_form",{
            title:"FeedBack-Form",
            username:res.locals.username
        });
    }else{
        req.flash('danger','Please Log In To Continue.');
        res.render("login",{
            title:"Log In"
        });
    }
})
router.post("/feedback",(req,res)=>{
    var studentName = req.body.username;
    var mentorName = req.body.mentor;
    var webinar = req.body.webinar;
    var feedback = req.body.feedback;
    var rating = req.body.rating;
    if(res.locals.user){
        if(studentName && mentorName && webinar && feedback && rating){
            console.log({
                'Student':studentName,
                'Mentor':mentorName,
                'Webinar':webinar,
                'Feedback':feedback,
                'Rating':rating
            });
            req.flash('success','Feedback Submitted')
            res.render("student",{
                title:"Mentor-Student Portal",
                username:res.locals.user.username
            });
        }else{
            if(!studentName){
                req.flash('danger','Student Name Field Required.');
                res.render("feedback_form",{
                    title:"FeedBack-Form",
                    username:res.locals.username
                });
            }
            else if(!mentorName){
                req.flash('danger','Mentor Name Field Required.');
                res.render("feedback_form",{
                    title:"FeedBack-Form",
                    username:res.locals.username
                });
            }
            else if(!webinar){
                req.flash('danger','Webinar Name Field Required.');
                res.render("feedback_form",{
                    title:"FeedBack-Form",
                    username:res.locals.username
                });
            }
            else if(!feedback){
                req.flash('danger','Feedback Field Required.');
                res.render("feedback_form",{
                    title:"FeedBack-Form",
                    username:res.locals.username
                });
            }
            else{
                req.flash('danger','Select a Rating.');
                res.render("feedback_form",{
                    title:"FeedBack-Form",
                    username:res.locals.username
                });
            }
        }
    }else{
        req.flash('danger','Please Log In to continue');
        res.render("login",{
            title:"Log In"
        })
    }
})

module.exports=router