var mongoose = require('mongoose')
const AnswerSchema  = mongoose.Schema({
    TestId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    AnswerFileId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    AnswerFileName:{
        type:String,
        required:true,
    },
    StudentRollNumber:{
        type:String,
        required:true
    },
    Grade:{
        type:Number,
        default:-1.0,
    }
})

var Answers = module.exports = mongoose.model('answers',AnswerSchema)