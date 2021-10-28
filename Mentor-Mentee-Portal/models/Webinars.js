const mongoose =  require('mongoose')
const WebinarSchema = mongoose.Schema({
    Title:{
        type:String,
        required:true,
        unique:true,
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
    Mentor:{
        type:String,
        required:true
    },
});

const Webinars = module.exports= mongoose.model('Webinars',WebinarSchema)