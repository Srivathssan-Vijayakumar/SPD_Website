
const mongoose =  require('mongoose')

const TestSchema = mongoose.Schema({
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
    TestLink:{
        type:String,
        required:true
    },
    IsGraded:{
        type:Boolean,
        required:true,
        default:false
    },
    Classroom:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    FileId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    FileName:{
        type:String,
        required:true
    }
});

const Tests = module.exports= mongoose.model('Tests',TestSchema)