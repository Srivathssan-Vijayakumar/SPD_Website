const mongoose =  require('mongoose')
const WebinarSchema = mongoose.Schema({
    Title:{
        type:String,
        required:true,
        unique:true,
    },
    Mentor:{
        type:String,
        required:true
    },
    Date:{
        type:String,
        required:true,
    },
    Time:{
        type:String,
        required:true
    },
    WebinarLink:{
        type:String,
        required:true
    },
    IsMarked:{
        type:Boolean,
        default:false,
    },
    Classroom:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
});

const Webinars = module.exports= mongoose.model('Webinars',WebinarSchema)