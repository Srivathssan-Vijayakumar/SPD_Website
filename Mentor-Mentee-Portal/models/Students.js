const mongoose = require('mongoose')

const StudentSchema = mongoose.Schema({
    Rollno:{
        type:String,
        required:true,
        unique:true
    },
    type:{
        type:String,
        default:'student'
    },
    Name:{
        type:String,
        required:true,
    },
    Username:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    PhoneNo:{
        type:String,
        required:true
    },
    Mentor:{
        type:String,
        // required:true,
        default:"",
    },
    Attendance:{
        type:Number,
        required:true,
        default:0.0
    },
    Image:{
        type:String,
        required:true,
        default:'noimage'
    },
    TotalGrades:{
        type:Number,
        default:0.0
    }
});
const Students = module.exports = mongoose.model('Students',StudentSchema)