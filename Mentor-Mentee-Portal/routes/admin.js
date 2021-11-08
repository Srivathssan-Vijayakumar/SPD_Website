var express = require('express')
var router = express.Router()
var Mentors=require('../models/Mentors')
var Students=require('../models/Students')
var Webinars = require('../models/Webinars')
var Feedbacks = require('../models/Feedback')


// Home Page Route
router.get("/",(req,res)=>{
    if(!res.locals.user){
        res.render("new_admin",{
            title:"Admin Page",
        })
    }else{
        req.flash("danger","Please Log In As Admin");
        res.render("login",{
            title:"Log In"
        });
    }
    // Students.find().sort({Rollno:1}).then((students)=>{
    //     Mentors.find().sort({Name:1}).then((mentors)=>{
    //         var labels1=["Already There"];
    //         var labels2=[];
    //         var data1=[];
    //         var data2=[];
    //         var data3=[];
    //         students.forEach((student)=>{
    //             labels1.push(student.Name.toString());
    //             data1.push(parseFloat(student.TotalGrades).toFixed(2));
    //             data2.push(parseFloat(student.Attendance).toFixed(2));
    //         });
    //         mentors.forEach((mentor)=>{
    //             labels2.push(mentor.Name);
    //             data3.push(mentor.TotalRating)
    //         });
    //         console.log(labels1)
    //         console.log(data1)
            
    //     }).catch((err)=>{
    //         console.log(err.toString())
    //     }).catch((err)=>{
    //         console.log(err.toString())
    //     })
    // })
});
router.get('/get-students',(req,res)=>{
    var labels1=[]
    var labels2=[]
    var data1=[]
    var data2=[]
    var data3=[]
    Students.find().sort({Rollno:1}).then((students)=>{
        Mentors.find().sort({Name:1}).then((mentors)=>{
            students.forEach((student)=>{
                labels1.push(student.Name)
                data1.push(student.TotalGrades)
                data2.push(student.Attendance)
            })
            mentors.forEach((mentor)=>{
                labels2.push(mentor.Name)
                data3.push(mentor.TotalRating)
            })
            res.json({
                'labels':labels1,
                'labels2':labels2,
                'data1':data1,
                'data2':data2,
                'data3':data3
            })
        })
        
    })
})
//Adding Mentors Route
router.get("/add-mentor",(req,res)=>{
    res.render("new_add_mentor",{
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
});

//Adding Students Route

router.get('/add-student',(req,res)=>{
    Mentors.find().then((mentors)=>{
        if(mentors.length >0){
            res.render("new_add_student",{
                title:"Add Student",
                mentors:mentors
            });
        }else{
            res.render("new_add_student",{
                title:"Add Student"
            });
        }
    }).catch((err)=>{
        console.log(err.toString())
    });
});

router.post("/add-student",(req,res)=>{
    const Name = req.body.Name
    const Username = req.body.Username
    const Email = req.body.Email
    const Rollno = req.body.Rollno
    const Password = req.body.Password
    const PhoneNo = req.body.PhoneNo
    const Mentor = req.body.Mentor

    const student = new Students({
        Name:Name,
        Username:Username,
        Email:Email,
        Rollno:Rollno,
        Password:Password,
        PhoneNo:PhoneNo,
        Mentor:Mentor
    });
    student.save().then(()=>{
        Mentors.findOne({Name:Mentor}).then((mentor)=>{
            mentor.NumOfStudents = mentor.NumOfStudents+1;
            mentor.save().then(()=>{
                req.flash('success','Student Added!');
                res.redirect('/admin');
            }).catch((err)=>{
                console.log(err.toString())
            })
        }).catch(err=>{
            console.log(err.toString())
        })
    }).catch((err)=>{
        console.log(err.toString())
    })
});

//Viewing Feedback Route
router.get("/view-feedback",(req,res)=>{
    Mentors.find().then((mentors)=>{
        res.render("new_view_feedback",{
            title:"The View Feedback Section",
            mentors:mentors
         })
    })
});

router.get("/view-feedback/:name",(req,res)=>{
    Webinars.find({Mentor:req.params.name}).then((webinars)=>{
        res.render("new_view_feedback_mentor",{
            title:"View Feedback Of Mentor",
            webinars:webinars,
            mentor:req.params.name
        })
    })
});

router.get("/view-feedback/:name/:webinar",(req,res)=>{
    // concerned_feedbacks=[];
    Feedbacks.find({Webinar:req.params.webinar}).then((feedbacks)=>{
        res.render("new_view_feedback_webinar",{
            title:"View Feedback Of Webinar",
            feedbacks:feedbacks,
            mentor:req.params.name,
            webinar:req.params.webinar
        });
    })
});


//Changing Mentors Route
router.get("/change-mentor",(req,res)=>{
    Students.find().then((students)=>{
        Mentors.find().then((mentors)=>{
            res.render("new_change_mentor",{
                title:"Change Mentor Section",
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

router.post('/change-mentor',(req,res)=>{
    const mentor = req.body.Mentor
    const rollnumber = req.body.rollnumber;
    const name = req.body.name;
    Students.findOne({Rollno:rollnumber}).then((student)=>{
        Mentors.findOne({Name:student.Mentor}).then((m)=>{
            m.NumOfStudents-=1;
            m.save().then(()=>{
                student.Mentor=mentor;
                student.save().then(()=>{
                    Mentors.findOne({Name:mentor}).then((m1)=>{
                        m1.NumOfStudents+=1;
                        m1.save().then(()=>{
                            req.flash('success',`${name}'s Mentor Changed Successfully!!`)
                            res.redirect("/admin/change-mentor")
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
        }).catch((err)=>{
            console.log(err.toString())
        })
    }).catch((err)=>{
        console.log(err.toString())
    })
})

//Dashboard Route
router.get("/dashboard",(req,res)=>{ 
    if(!res.locals.user){
        Students.find().sort({TotalGrades:-1,Rollno:1}).then((students)=>{
            Students.find().sort({Attendance:-1,Rollno:1}).then((attendanceList)=>{
                Mentors.find().sort({TotalRating:-1,Name:1}).then((mentors)=>{
                    res.render('admin_dashboard',{
                        title:'Admin Dashboard',
                        attendanceList:attendanceList,
                        gradesList:students,
                        ratingList:mentors
                    })
                })
            })
        })
    }else{
        req.flash("danger","Please Log In As Admin");
        res.render("login",{
            title:"Log In"
        });
    }
})
module.exports=router