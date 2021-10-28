var express = require('express')
var router = express.Router()
var Mentors=require('../models/Mentors')
var Students=require('../models/Students')
var Webinars = require('../models/Webinars')
var Feedbacks = require('../models/Feedback')

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
    Mentors.find().then((mentors)=>{
        res.render("view_feedback",{
            title:"The View Feedback Section",
            mentors:mentors
         })
    })
});

router.get("/view-feedback/:name",(req,res)=>{
    // var concerned_webinars=[]
    Webinars.find({Mentor:req.params.name}).then((webinars)=>{
        res.render("view_feedback_mentor",{
            title:"View Feedback Of Mentor",
            webinars:webinars,
            mentor_name:req.params.name
        })
    })
    // Webinars.forEach((webinar)=>{
    //     if(webinar.mentor==req.params.name){
    //         concerned_webinars.push(webinar);
    //     }
    // })
});

router.get("/view-feedback/:name/:webinar",(req,res)=>{
    // concerned_feedbacks=[];
    Feedbacks.find({Webinar:req.params.webinar}).then((feedbacks)=>{
        res.render("view_feedback_webinar",{
            title:"View Feedback Of Webinar",
            feedbacks:feedbacks,
            mentor:req.params.name,
            webinar:req.params.webinar
        });
    })
});

router.get("/assign-mentors",(req,res)=>{
    Students.find().then((students)=>{
        Mentors.find().then((mentors)=>{
            res.render("assign_mentors",{
                title:"Assign Mentor Section",
                students:students,
                mentors:mentors
            })
        }).catch((err)=>{
            console.log(err.toString())
        })
    }).catch((err)=>{
        console.log(err.toString())
    }) 
});

router.get('/assigned-mentor/:student/:mentor',(req,res)=>{
    Students.find({Name:req.params.student}).then((students)=>{
        Mentors.find({Name:req.params.mentor}).then((mentors)=>{
            var student=students[0]
            var mentor = mentors[0]
            student.Mentor = req.params.mentor
            student.save().then(()=>{
                mentor.NumOfStudents = parseInt(mentor.NumOfStudents)+1
                mentor.save().then(()=>{
                    Students.find().then((students)=>{
                        Mentors.find().then((mentors)=>{
                            req.flash('success','Assigned Mentor Successfully!')
                            res.render("assign_mentors",{
                                title:"Assign Mentor Section",
                                students:students,
                                mentors:mentors
                            })
                        }).catch((err)=>{
                            console.log(err.toString())
                        })
                    }).catch((err)=>{
                        console.log(err.toString())
                    })
                }).catch((err)=>{
                    console.log(err.toString())
                })
            }).catch((err)=>{
                console.log(err.toString())
            })
        }).catch((err)=>{console.log(err.toString())})
    }).catch((err)=>{
        console.log(err.toString())
    })
})

router.get("/add-mentor",(req,res)=>{
    res.render("add_mentors",{
        title:"Add-Mentors"
    })
});

router.post("/add-mentor",(req,res)=>{
    const Name = req.body.Name
    const Username = req.body.Username
    const Password = req.body.Password
    const Email = req.body.Email

    const mentor = new Mentors({
        Name:Name,
        Username :Username,
        Password:Password,
        Email:Email
    });
    mentor.save().then(()=>{
        req.flash('success','Mentor Added');
        res.redirect('/admin');
    }).catch((err)=>{
        console.log(err.toString())
    })
})

router.get('/add-student',(req,res)=>{
    res.render("add_students",{
        title:"Add Student"
    });
});

router.post("/add-student",(req,res)=>{
    const Name = req.body.Name
    const Username = req.body.Username
    const Email = req.body.Email
    const Rollno = req.body.Rollno
    const Password = req.body.Password
    const PhoneNo = req.body.PhoneNo

    const student = new Students({
        Name:Name,
        Username:Username,
        Email:Email,
        Rollno:Rollno,
        Password:Password,
        PhoneNo:PhoneNo
    });
    student.save().then(()=>{
        req.flash('success','Student Added!');
        res.redirect('/admin');
    }).catch((err)=>{
        console.log(err.toString())
    })
});
module.exports=router