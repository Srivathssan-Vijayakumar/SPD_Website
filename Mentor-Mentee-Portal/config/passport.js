const passport = require('passport')
var localstrategy = require('passport-local').Strategy
var Data = require('./data')
var students = Data.Students
var mentors = Data.Mentors

function SessionConstructor(userId,userGroup,details){
    this.userId = userId;
    this.userGroup= userGroup;
    this.details=details;
}
module.exports = function(passport){
    passport.use('student-signup',new localstrategy(function(username,password,done){
        students.forEach((student)=>{
            if(student.username===username){
                if(student.password===password){
                    return done(null,student,{message:'Logged In Successfully!'})
                }
                else{
                    return done(null,false,{message:'Wrong Password'})
                }
            }
        })
    }))
    
    
    //mentor-signup strategy
    
    passport.use('mentor-signup',new localstrategy(function(username,password,done){
        mentors.forEach((mentor)=>{
            if(mentor.username==username){
                if(mentor.password==password){
                    return done(null,mentor,{message:'Logged In Successfully!'})
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
        let sessionConstructor = new SessionConstructor(user.id,userGroup,'')
        done(null,sessionConstructor)
    })
    
    passport.deserializeUser(function(sessionConstructor,done){
        if(sessionConstructor.userGroup==="student"){
            students.forEach((student)=>{
                if(student.id===sessionConstructor.userId){
                    done(null,student)
                }
            })
        }else{
            mentors.forEach((mentor)=>{
                if(mentor.id===sessionConstructor.userId){
                    done(null,mentor)
                }
            })
        }
    })
}