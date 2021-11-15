var express = require('express')
var router = express.Router()
var Data = require('../config/data')
var Students=Data.Students;
var Mentors = Data.Mentors;
var Webinars=Data.Webinars;
var Tests = Data.Tests;
var Grades = require('../models/Grades');
var Classrooms = require('../models/Classroom');
const Answers = require('../models/Answers');
// Mentor Home Page Routes
router.get("/",(req,res)=>{
    if(res.locals.user){
        res.render("new_mentor",{
            title:"Mentor-Page",
            username:res.locals.user.Username
        })
    }else{
        res.render("new_mentor",{
            title:"Mentor-Page",
            username:null
        })
    }
});

//Mentor Visualization Route
router.get('/get-students',(req,res)=>{
    if(res.locals.user){
        var labels1=[]
    var data1=[]
    var data2=[]
    Students.find({Mentor:res.locals.user.Name}).sort({Rollno:1}).then((students)=>{
            students.forEach((student)=>{
                labels1.push(student.Name)
                data1.push(student.TotalGrades)
                data2.push(student.Attendance)
            })
            res.json({
                'labels':labels1,
                'data1':data1,
                'data2':data2,
            })
    })
    }else{
        req.flash('danger','Please Log In To Continue');
        res.render("login",{
            title:"Log In"
        });
    }
})


//Mentor Classrooms Routes
router.get('/classroom',(req,res)=>{
    Classrooms.find({Mentor:res.locals.user.Username}).then((classrooms)=>{
        if(classrooms && classrooms.length>0){
            res.render('mentor_classroom',{
                classrooms:classrooms,
                title:"Classroom Page",
                mentor:res.locals.user.Username,
            });
        }
        else{
            res.render('mentor_classroom',{
                mentor:res.locals.user.Username,
                title:"Classroom Page",
                classrooms:[]
            });
        }
    }).catch((err)=>{
        console.log(err.toString())
    })
});

router.get('/add-classroom',(req,res)=>{
    res.render("mentor_add_classroom",{
        title:"Add Classroom Page",
        mentor:res.locals.user.Username
    });
})
router.post('/classroom',(req,res)=>{
    const Title = req.body.Title
    const Mentor = req.body.Mentor
    var students=[]
    Students.find({Mentor:Mentor}).then((studs)=>{
        studs.forEach((s)=>{
            students.push(s._id)
        });
        const classroom = new Classrooms({
            Title:Title,
            Mentor:Mentor,
            Students:students
        })
        classroom.save().then(()=>{
            req.flash('success','Classroom Added!!');
            res.redirect('/mentor/classroom')
        }).catch((err)=>{
            console.log(err.toString())
        })
    }).catch((err)=>{
        console.log(err.toString())
    })
});

//Classroom Tests Route
router.get('/classroom/:id/test',(req,res)=>{
    Tests.find({Classroom:req.params.id}).then((tests)=>{
        res.render('mentor_classroom_tests',{
            tests:tests,
            title:"Classroom Test Page",
            classroom:req.params.id,
            mentor:res.locals.user.Username
        });
    }).catch((err)=>{
        console.log(err.toString())
    })
});

router.get('/schedule-test/:id',(req,res)=>{   
    if(res.locals.user){
        res.render('new_schedule_test',{
            title:"Classroom Add Test Page",
            classroom:req.params.id
        });
    }else{
        req.flash('danger','Please Log In To Continue');
        res.render("login",{
            title:"Log In"
        });
    }
})

//classroom webinars route
router.get('/classroom/:id/webinars',(req,res)=>{
    Webinars.find({Classroom:req.params.id}).then((webinars)=>{
        res.render('mentor_classroom_webinars',{
            webinars:webinars,
            title:"Classroom Webinar Page",
            classroom:req.params.id
        });
    }).catch((err)=>{
        console.log(err.toString())
    })
});


router.get('/schedule-webinar/:id',(req,res)=>{
    if(res.locals.user){
        res.render('new_schedule_webinar',{
            title:"Classroom Add Webinar Page",
            classroom:req.params.id
        })
    }else{
        req.flash('danger','Please Log In To Continue');
        res.render("login",{
            title:"Log In"
        });
    }
})

router.post('/schedule-webinar/:id',(req,res)=>{
    if(res.locals.user){
        const Title = req.body.title
        const WebinarLink = req.body.link.toLowerCase()
        const Date = req.body.date
        const Time =  req.body.time
        const classroom = req.params.id
        const mentor = res.locals.user.Name
        const webinar = new Webinars({
            Title : Title,
            Mentor:mentor,
            WebinarLink:WebinarLink,
            Date:Date,
            Time:Time,
            Classroom:classroom
        });
        webinar.save().then(()=>{
            req.flash('success','Webinar Added Successfully!!')
            res.redirect(`/mentor/classroom/${classroom}/webinars`)
        }).catch((err)=>{
            console.log(err.toString())
        })
    }else{
        req.flash('danger','Please Log In To Continue');
        res.render("login",{
            title:"Log In"
        });
    }
})

//Marking Attendance For Webinars Route
router.get('/attendance/:id',(req,res)=>{
    const webinarid = req.params.id
    if(res.locals.user){
        Students.find({Mentor:res.locals.user.Name}).then((students)=>{
            res.render('new_mark_attendance',{
                title:'Marking Attendance Page',
                webinar:webinarid,
                students:students,
            });
        }).catch((err)=>{
            console.log(err.toString())
        })    
    }else{
        req.flash('danger','Please Log In To Continue');
        res.render("login",{
            title:"Log In"
        });
    }
})

router.post('/attendance/:id',(req,res)=>{
    const webinarid = req.params.id
    var attendance = JSON.parse(req.body.attendance)
    var noattendance =  JSON.parse(req.body.noattendance)
        if(res.locals.user){
            Webinars.findById(webinarid).then((webinar)=>{
                webinar.IsMarked=true
                webinar.save().then(()=>{
                    Webinars.find({Mentor:webinar.Mentor,IsMarked:true}).then((webinars)=>{
                        const numofweb = webinars.length
                        attendance.forEach((rollnum)=>{
                            Students.findOne({Rollno:rollnum}).then((student)=>{
                                student.Attendance = (student.Attendance*(numofweb-1)+100)/numofweb
                                student.save().then(()=>{}).catch((err)=>{
                                    console.log(err.toString())
                                })
                            })
                        })
                        noattendance.forEach((rollnum)=>{
                            Students.findOne({Rollno:rollnum}).then((student)=>{
                                student.Attendance = (student.Attendance*(numofweb-1)+0)/numofweb
                                student.save().then(()=>{

                                }).catch((err)=>{
                                    console.log(err.toString())
                                })
                            })
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
        }
        else{
            req.flash('danger','LogIn To Continue')
            res.redirect("/")
        }
});
//Grade test routes
router.get('/grade-test/:id',(req,res)=>{
    if(res.locals.user){
        Answers.find({TestId:req.params.id}).then((answers)=>{
            res.render('new_grade_students',{
                answers:answers,
                testid:req.params.id,
                title:"Grade Students Section"
            })
        })
    }else{
        req.flash('danger','LogIn To Continue')
        res.redirect("/")
    }
})

router.post('/grade-test/:id',(req,res)=>{
    if(res.locals.user){
        const grades = JSON.parse(req.body.grades)
        Tests.findById(req.params.id).then((test)=>{
            test.IsGraded=true;
            test.save().then(()=>{
                grades.forEach((grade)=>{
                    Answers.findOne({StudentRollNumber:grade.Student,TestId:req.params.id}).then((answer)=>{
                        answer.Grade = parseFloat(grade.Grade).toFixed(2)
                        answer.save().then(()=>{
                            Students.findOne({Rollno:grade.Student}).then((student)=>{
                                student.TotalGrades = parseFloat(student.TotalGrades) + parseFloat(grade.Grade)
                                student.save().then(()=>{
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
                })
            }).catch((err)=>{
                console.log(err.toString())
            })
        }).catch((err)=>{
            console.log(err.toString())
        })
    }else{
        req.flash('danger','LogIn To Continue')
        res.redirect("/")
    }
})

//Dashboard Area
router.get('/dashboard',(req,res)=>{
    Students.find({Mentor:res.locals.user.Name}).sort({TotalGrades:-1,Rollno:1}).then((students)=>{
        Students.find({Mentor:res.locals.user.Name}).sort({Attendance:-1,Rollno:1}).then((attendanceList)=>{
            if(res.locals.user){
                res.render("mentor_dashboard",{
                    title:"Mentor",
                    attendanceList:attendanceList,
                    gradesList:students,
                    mentor:res.locals.user.Username,
                })
            }else{
                req.flash('danger','LogIn To Continue')
                res.redirect("/")
            }
        })
    }).catch((err)=>{
        console.log(err.toString())
    })
    
})






//OLD Routes

router.get('/grade-students',(req,res)=>{
    Students.find().then((students)=>{
        Tests.find().then((tests)=>{
            if(res.locals.user){
                res.render("grade_students",{
                    title:"Grading Students Section",
                    username:res.locals.user.Username,
                    students:students,
                    mentor_name:res.locals.user.Name,
                    tests:tests
                })
            }else{
                req.flash('danger','Please Log In To Continue');
                res.render("login",{
                    title:"Log In"
                });
            }
        }).catch((err)=>{
            console.log(err.toString())
        })
    }).catch((err)=>{
        console.log(err.toString())
    })
});

router.post('/grade-students',(req,res)=>{
    const mentor = req.body.username
    const student = req.body.student
    const grademarks = req.body.grade
    const test = req.body.title
    const grade = new Grades({
        Student:student,
        Test:test,
        Mentor:mentor,
        Grade:grademarks
    })

    grade.save().then(()=>{
        req.flash('success','Test Graded Successfully!!')
        Students.find().then((students)=>{
            Tests.find().then((tests)=>{
                if(res.locals.user){
                    res.render("grade_students",{
                        title:"Grading Students Section",
                        username:res.locals.user.Username,
                        students:students,
                        mentor_name:res.locals.user.Name,
                        tests:tests
                    })
                }else{
                    req.flash('danger','Please Log In To Continue');
                    res.render("login",{
                        title:"Log In"
                    });
                }
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

router.get('/graded-test/:id',(req,res)=>{
    Tests.findById(req.params.id).then((test)=>{
        test.IsGraded=true
        test.save().then(()=>{
                req.flash('success','Test Graded Successfully!!')
                Students.find().then((students)=>{
                    Tests.find().then((tests)=>{
                        if(res.locals.user){
                            res.render("grade_students",{
                                title:"Grading Students Section",
                                username:res.locals.user.Username,
                                students:students,
                                mentor_name:res.locals.user.Name,
                                tests:tests
                            })
                        }else{
                            req.flash('danger','Please Log In To Continue');
                            res.render("login",{
                                title:"Log In"
                            });
                        }
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

router.get('/view-attendance',(req,res)=>{
    Students.find().then((students)=>{
        if(res.locals.user){
            res.render("view_attendance",{
                title:"Attendace Details Section",
                username:res.locals.user.Username,
                students:students,
                mentor_name:res.locals.user.Name
            })
        }else{
            req.flash('danger','Please Log In To Continue');
            res.render("login",{
                title:"Log In"
            });
        }
    }).catch((err)=>{
        console.log(err.toString())
    })
    
})

module.exports=router