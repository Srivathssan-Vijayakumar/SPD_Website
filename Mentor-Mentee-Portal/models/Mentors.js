const mongoose = require('mongoose')

const MentorSchema = mongoose.Schema({
    Name:{
        type:String,
        required:true
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
    TotalRating:{
        type:Number,
        default:0.0,
    }
});

const Mentors = module.exports = mongoose.model('Mentors',MentorSchema);