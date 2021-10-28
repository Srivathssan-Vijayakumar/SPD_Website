const mongoose =  require('mongoose')
const FeedbackSchema = mongoose.Schema({
    Student:{
        type:String,
        required:true,
        unique:true,
    },
    Mentor:{
        type:String,
        required:true,
    },
    Webinar:{
        type:String,
        required:true
    },
    Feedback:{
        type:String,
        required:true
    },
    Rating:{
        type:Number,
        required:true
    },
});

const Feedbacks = module.exports= mongoose.model('Feedback',FeedbackSchema)