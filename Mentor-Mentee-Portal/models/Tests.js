
const mongoose =  require('mongoose')

const TestSchema = mongoose.Schema({
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
    TestLink:{
        type:String,
        required:true
    },
    Mentor:{
        type:String,
        required:true
    },
    IsGraded:{
        type:Boolean,
        required:true,
        default:false
    },
});

const Tests = module.exports= mongoose.model('Tests',TestSchema)