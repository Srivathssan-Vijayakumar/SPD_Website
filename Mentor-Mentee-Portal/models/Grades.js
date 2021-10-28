var mongoose = require('mongoose')

const GradeSchema = mongoose.Schema({
    Grade:{
        type:Number,
        required:true
    },
    Test:{
        type:String,
        required:true,
    },
    Mentor:{
        type:String,
        required:true
    },
    Student:{
        type:String,
        required:true
    }
})

var Grades = module.exports = mongoose.model('Grades',GradeSchema)