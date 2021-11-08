const mongoose = require('mongoose');
const ClassroomSchema = mongoose.Schema({
    Title:{
        type:String,
        required:true
    },
    Mentor:{
        type:String,
        required:true,
    },
    Tests:{
        type:[mongoose.Schema.Types.ObjectId],
        default:[]
    },
    Webinars:{
        type:[mongoose.Schema.Types.ObjectId],
        required:true,
        default:[]
    },
    Students:{
        type:[mongoose.Schema.Types.ObjectId],
        required:true,
    },
});
var Classroom = module.exports = mongoose.model('Classroom',ClassroomSchema)