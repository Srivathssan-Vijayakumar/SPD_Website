var express = require('express')
var router = express.Router()
var Data = require('../config/data')
const Grades = require('../models/Grades')
var Tests = Data.Tests
var Webinars =  Data.Webinars
var Feedbacks = Data.Feedbacks
var Mentors = Data.Mentors
var Students = require('../models/Students')
const Classrooms =  require('../models/Classroom')
const Answers = require('../models/Answers')

//General Route
router.get("/",(req,res)=>{
    if(res.locals.user){
        res.render("new_student",{
            title:"Mentor-Student Portal",
            username:res.locals.user.Username
        })
    }else{
        res.render("new_student",{
            title:"Mentor-Student Portal",
            username:null
        })
    }
})

//Student Classroom Route
router.get("/classroom",(req,res)=>{
    if(res.locals.user){
        Classrooms.find({Mentor:res.locals.user.Mentor}).then((classrooms)=>{
            res.render('new_student_classroom',{
                title:"Student Classroom Page",
                classrooms:classrooms,
            })
        }).catch((err)=>{
            console.log(err.toString())
        })
    }else{
        req.flash('danger','Please Log In to continue')
        res.redirect('/')
    }
})

//Student Test Route
router.get("/classroom/:id/test",(req,res)=>{
    var answerfortestIds = []
    if(res.locals.user){
        Tests.find({Classroom:req.params.id}).then((tests)=>{
            Answers.find({StudentRollNumber:res.locals.user.Rollno}).then((answers)=>{
                if(answers && answers.length>0){
                    answers.forEach((answer)=>{
                        answerfortestIds.push(answer.TestId.toString())
                    })
                    res.render("new_student_classroom_tests",{
                        title:"Student Test Page",
                        tests:tests,
                        answers:answers,
                        classroom:req.params.id,
                        answertestids : answerfortestIds,
                    })
                }else{
                    res.render("new_student_classroom_tests",{
                        title:"Student Test Page",
                        tests:tests,
                        answers:[],
                        answertestids:[],
                        classroom:req.params.id
                    })
                }
            })
        });
    }else{
        req.flash('danger','Please Log In to continue')
        res.redirect('/')
    }
})

//Student Webinar Route
router.get("/classroom/:id/webinars",(req,res)=>{
    if(res.locals.user){
        Webinars.find({Classroom:req.params.id}).then((webinars)=>{
            res.render("new_student_classroom_webinars",{
                title:"Student Webinar Page",
                webinars:webinars,
                classroom:req.params.id
            })
        });
    }else{
        req.flash('danger','Please Log In to continue')
        res.redirect('/')
    }
})


//Student Profile Route
router.get("/profile",(req,res)=>{
        if(res.locals.user){
            res.render("new_student_profile",{
                title:"Student Profile Page",
                student:res.locals.user
            })
        }else{
            req.flash('danger','Please Log In To Continue.');
            res.redirect('/')
        }
})

router.get("/edit-profile/:id",(req,res)=>{
    if(res.locals.user){
        Students.findOne({Rollno : req.params.id}).then((student)=>{
            res.render("new_student_edit_profile",{
                title:"Edit profile Page",
                student:student,
            })
        }).catch((err)=>{
            console.log(err.toString())
        })
    }else{
        req.flash('danger','Please Log In To Continue.');
        res.redirect('/')   
    }
})

router.post("/edit-profile/:id",(req,res)=>{
    const username = req.body.username
    const name =  req.body.name
    const email =req.body.email
    const password = req.body.password
    const phoneno = req.body.phoneno
    if(res.locals.user){
        Students.findOne({Rollno:req.params.id}).then((student)=>{
            student.Username = username
            student.Name = name
            student.Password = password
            student.Email =email
            student.PhoneNo = phoneno
            student.save().then(()=>{
                req.flash('success','Profile Edited')
                res.redirect("/student/profile");
            }).catch((err)=>{
                console.log(err.toString())
            })
        }).catch((err)=>{
            console.log(err.toString())
        })
    }
    else{
        req.flash('danger','Please Log In To Continue.');
        res.redirect('/')    
    }
})

//Student Fedback Route
router.get("/feedback",(req,res)=>{
    if(res.locals.user){
        Mentors.findOne({Name:res.locals.user.Mentor}).then((mentor)=>{
            Webinars.find().then((webinars)=>{
                res.render("new_student_feedback",{
                    title:"Student Feedback Page",
                    student:res.locals.user,
                    mentor:mentor,
                    webinars:webinars
                })
            }).catch((err)=>{
                console.log(err.toString())
            })
        }).catch((err)=>{
            console.log(err.toString())
        })
    }else{
        req.flash('danger','Please Log In To Continue.');
        res.render("login",{
            title:"Log In"
        });
    }
})
router.post("/feedback",(req,res)=>{
    var Name = req.body.Student;
    var mentor = req.body.mentor;
    var webinar = req.body.webinar;
    var feedback = req.body.feedback;
    var rating = req.body.rating;
    if(res.locals.user){
        if(Name && mentor && webinar && feedback && rating){
            const Feedback = new Feedbacks({
                Student:Name,
                Mentor:mentor,
                Webinar:webinar,
                Feedback:feedback,
                Rating:rating
            })
            Feedback.save().then(()=>{
                Mentors.findOne({Name:mentor}).then((mentor)=>{
                    mentor.TotalRating+=rating
                    mentor.save().then(()=>{
                        req.flash('success','Feedback Submitted')
                        res.redirect("/student")      
                    }).catch((err)=>{
                        console.log(err.toString())
                    })
                })
            }).catch((err)=>{
                console.log(err.toString())
            })
        }else{
            if(!Name){
                req.flash('danger','Student Name Field Required.');
                res.render("feedback_form",{
                    title:"FeedBack-Form",
                    username:res.locals.Username
                });
            }
            else if(!mentor){
                req.flash('danger','Mentor Name Field Required.');
                res.render("feedback_form",{
                    title:"FeedBack-Form",
                    username:res.locals.Username
                });
            }
            else if(!webinar){
                req.flash('danger','Webinar Name Field Required.');
                res.render("feedback_form",{
                    title:"FeedBack-Form",
                    username:res.locals.Username
                });
            }
            else if(!feedback){
                req.flash('danger','Feedback Field Required.');
                res.render("feedback_form",{
                    title:"FeedBack-Form",
                    username:res.locals.Username
                });
            }
            else{
                req.flash('danger','Select a Rating.');
                res.render("feedback_form",{
                    title:"FeedBack-Form",
                    username:res.locals.Username
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

router.get('/view-grades',(req,res)=>{
    if(res.locals.user){
        var req_grades=[]
        Grades.find().then((grades)=>{
            grades.forEach((grade)=>{
                if(grade.Student === res.locals.user.Username){
                    req_grades.push({
                        'Test':grade.Test,
                        'Grade':grade.Grade
                    });
                }
            })
            res.render("view_grades",{
                title:"View Grades Section",
                username:res.locals.user.Username,
                grades:req_grades,
                mentor:res.locals.user.Mentor,
            })
        }).catch((err)=>{
            console.log(err.toString())
        })
    }else{
        req.flash('danger','Please Log In to Continue!')
        res.redirect("/")
    }
})

module.exports=router