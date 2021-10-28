var express = require('express')
var router = express.Router()
var Data = require('../config/data')
var Students=Data.Students;
var Mentors = Data.Mentors;
var Webinars=Data.Webinars;
var Tests = Data.Tests;
var Grades = require('../models/Grades');
router.get("/",(req,res)=>{
    if(res.locals.user){
        res.render("mentor",{
            title:"Mentor-Page",
            username:res.locals.user.Username
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
        Mentors.find().then((mentors)=>{
            res.render("schedule_test",{
                title:"Scheduling Test Section",
                username:res.locals.user.Username,
                mentors:mentors
            });
        }).catch((err)=>{
            console.log(err.toString())
        });
    }else{
        req.flash('danger','Please Log In To Continue');
        res.render("login",{
            title:"Log In"
        });
    }
})
router.post('/schedule-test',(req,res)=>{
    const Title = req.body.title
    const TestLink = req.body.link.toLowerCase()
    const Mentor = req.body.Mentor
    const Date = req.body.date
    const Time =  req.body.time
    // console.log(Title,TestLink,Mentor,Date,Time)
    const test = new Tests({
        Title : Title,
        TestLink:TestLink,
        Mentor:Mentor,
        Date:Date,
        Time:Time
    })

    test.save().then(()=>{
        req.flash('success','Test Scheduled')
        res.redirect('/mentor')
    }).catch((err)=>{
        console.log(err.toString())
    })
    
})
router.get('/schedule-webinar',(req,res)=>{
    if(res.locals.user){
        Mentors.find().then((mentors)=>{
            res.render("schedule_webinar",{
                title:"Scheduling Webinar Section",
                username:res.locals.user.Username,
                mentors:mentors
            })
        })
    }else{
        req.flash('danger','Please Log In To Continue');
        res.render("login",{
            title:"Log In"
        });
    }
})

router.post('/schedule-webinar',(req,res)=>{
    const Title = req.body.title
    const WebinarLink = req.body.link.toLowerCase()
    const Mentor = req.body.mentor
    const Date = req.body.date
    const Time =  req.body.time
    const webinar = new Webinars({
        Title : Title,
        WebinarLink:WebinarLink,
        Mentor:Mentor,
        Date:Date,
        Time:Time
    });
    Mentors.find({Name:Mentor}).then((mentors)=>{
        const m =mentors[0]
        m.NumOfWebinars = m.NumOfWebinars+1
        m.save().then(()=>{
            Students.find({Mentor:Mentor}).then((students)=>{
                students.forEach((student)=>{
                    student.NumOfWebinars+=1
                    student.save().then(()=>{  
                    }).catch((err)=>{
                        console.log(err.toString())
                    })
                })
                webinar.save().then(()=>{
                    req.flash('success','Webinar Scheduled')
                    res.redirect('/mentor')
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
router.get('/attendance',(req,res)=>{
    Students.find().then((students)=>{
        Webinars.find().then((webinars)=>{
            if(res.locals.user){
                res.render("mark_attendance",{
                    title:"Marking Attendance Section",
                    username:res.locals.user.Username,
                    students:students,
                    mentor_name:res.locals.user.Name,
                    webinars:webinars
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
})

router.post('/attendance',(req,res)=>{
    const rollno = req.body.rollno
    Students.find({Rollno:rollno}).then((students)=>{
        var student = students[0]
        if(student.NumOfWebinars>1){
            var attendance = student.Attendance *(student.NumOfWebinars-1)
            attendance = (attendance+100.0)/student.NumOfWebinars
            student.Attendance=attendance
            student.save().then(()=>{
                req.flash('success','Attendance Marked!!')
                res.redirect('/attendance')
            }).catch((err)=>{
                console.log(err.toString())
            })
        }else if(student.NumOfWebinars==1){
            student.Attendance=100.0
            student.save().then(()=>{
                req.flash('success','Attendance Marked!!')
                res.redirect('/attendance')
            }).catch((err)=>{
                console.log(err.toString())
            })
        }
        else{
            req.flash('danger','There are no Webinars to mark Attendance')
            res.redirect("/mentor")
        }
    })
});

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