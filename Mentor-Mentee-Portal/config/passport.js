const passport = require('passport')
var localstrategy = require('passport-local').Strategy
var Data = require('./data')
var Students = Data.Students
var Mentors = Data.Mentors

function SessionConstructor(userId,userGroup,details){
    this.userId = userId;
    this.userGroup= userGroup;
    this.details=details;
}
module.exports = function(passport){
    passport.use('student-signup',new localstrategy(function(username,password,done){
        Students.find({Username:username}).then((student)=>{
            if(student[0].Username===username){
                if(student[0].Password===password){
                    return done(null,student[0],{message:'Logged In Successfully!'})
                }
                else{
                    return done(null,false,{message:'Wrong Password'})
                }
            }
        })
    }))
    
    
    //mentor-signup strategy
    
    passport.use('mentor-signup',new localstrategy(function(username,password,done){
        Mentors.find({Username:username}).then((mentor)=>{
            if(mentor[0].Username==username){
                if(mentor[0].Password==password){
                    return done(null,mentor[0],{message:'Logged In Successfully!'})
                }
                else{
                    return done(null,false,{message:'Wrong Password'})
                }
            }
        })
    }))

    // //serializing a req.session.passport.user session with the user id
    // passport.serializeUser(function(student,done){
    //     done(null,student.id)
    // })
    
    // //deserializing user details into req
    // passport.deserializeUser(function(id,done){
    //     students.forEach((student)=>{
    //         if(student.id===id){
    //             done(null,student)
    //         }
    //     })
    // })
    
    
    passport.serializeUser(function(user,done){
        var userGroup="student"
        var userPrototype= user.type
        if(userPrototype=== "student"){
            userGroup="student"
        }else{
            userGroup="mentor"
        }
        let sessionConstructor = new SessionConstructor(user._id,userGroup,'')
        done(null,sessionConstructor)
    })
    
    passport.deserializeUser(function(sessionConstructor,done){
        if(sessionConstructor.userGroup==="student"){
            Students.findById(sessionConstructor.userId).then((stud)=>{
                        done(null,stud)
            }).catch((err)=>{
                console.log(err.toString())
            })
        }else{
            Mentors.findById(sessionConstructor.userId).then((mentor)=>{
                    done(null,mentor)
            }).catch((err)=>{
                console.log(err.toString())
            })
        }
    })
}