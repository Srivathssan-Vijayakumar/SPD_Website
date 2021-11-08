var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var session = require('express-session')
const passport = require('passport')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const methodoverride = require('method-override')
const crypto = require('crypto')
const BSON =  require('bson');
var Buffer = require('buffer/').Buffer

const Tests = require('./models/Tests')
const Answers = require('./models/Answers')

var app =express()

const uri = require('./config/database').uri
mongoose.connect(uri,{
  useUnifiedTopology:true,
  useNewUrlParser:true
})

let gfs;
let gfschunks;
let gfsfiles;
const db = mongoose.connection

db.on('error',()=>{
  console.log("Error in connecting")
})

db.once('open',()=>{
  gfs = Grid(db.db,mongoose.mongo);
  gfs.collection('uploads');
  gfsfiles=db.collection('uploads.files');
  gfschunks = db.collection('uploads.chunks');
  console.log('MongoDb Connected')
});

//Creating Storage Engine
const storage = new GridFsStorage.GridFsStorage({
  url:uri,
  file:(req,file)=>{
    return new Promise((resolve,reject)=>{
      crypto.randomBytes(16,(err,buf)=>{
        if(err){
          return reject(err);
        }
        const filename = buf.toString('hex')+path.extname(file.originalname);
        const fileinfo = {
          filename:filename,
          bucketName:'uploads'
        };
        resolve(fileinfo);
      });
    });
  }
});

const upload = multer({storage});

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));


app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());




app.use(session({
    secret:'keyboard cat',
    resave:true,
    saveUninitialized:true,
    //cookie:{secure: true}
}));


app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});



app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

app.get('*',function(req,res,next){
  res.locals.user=req.user||null;
  next();  
})
app.post('*',function(req,res,next){
  res.locals.user=req.user||null;
  next();  
})

var HomeRoute = require('./routes/home')
var StudentRoute = require('./routes/student')
var MentorRoute = require('./routes/mentor')
var AdminRoute = require('./routes/admin')

app.use('/student',StudentRoute)
app.use('/mentor',MentorRoute)
app.use('/admin',AdminRoute)
app.use('/',HomeRoute)


//App Routes 

//Uploading Test Files to DB
app.post('/test-upload/:id',upload.single('file'),(req,res)=>{
    if(res.locals.user){
      const Title = req.body.title
      const TestLink = req.body.link.toLowerCase()
      const Date = req.body.date
      const Time =  req.body.time
      const classroom = req.params.id
      const fileid = req.file.id
      const mentor = res.locals.user.Name
      const filename = req.file.originalname
      // console.log(Title,TestLink,Mentor,Date,Time)
      const test = new Tests({
          Title : Title,
          Mentor:mentor,
          TestLink:TestLink,
          Date:Date,
          Time:Time,
          Classroom:classroom,
          FileId:fileid,
          FileName:filename
      });
      test.save().then(()=>{
          req.flash('success','Test Scheduled')
          res.redirect(`/mentor/classroom/`)
      }).catch((err)=>{
          console.log(err.toString())
      })   
    }
});

//Uploading Answer Scripts to DB
app.post('/answer-upload/:id',upload.single('file'),(req,res)=>{
  if(res.locals.user && req.file ){
    const testid = req.params.id
    const answerfilename = req.file.originalname
    const answerfileid = req.file.id
    const studentrollnumber = res.locals.user.Rollno
    const answer = new Answers({
      TestId : testid,
      AnswerFileName:answerfilename,
      AnswerFileId:answerfileid,
      StudentRollNumber:studentrollnumber
    });
    answer.save().then(()=>{
      req.flash('success','Uploaded Successfully!!!')
      res.redirect(`/student/classroom/`)
    }).catch((err)=>{
      console.log(err.toString())
    })
  }else{
    req.flash('danger','Please Log In To continue.')
    res.redirect("/")
  }
})

//getting all files
app.get('/files', (req, res) => {
  gfsfiles.find().toArray((err,files)=>{
    gfschunks.find({files_id:files[0]._id}).sort({n:1}).toArray((err,chunks)=>{
      var base64data = Buffer.from(chunks[0].data.toString(), 'binary').toString('base64');
      var originaldata = Buffer.from(base64data, 'base64');
    })
  })
});

//Getting a specific file
app.get('/files/:id', (req, res) => {
  gfschunks.find({files_id:new mongoose.Types.ObjectId(req.params.id)}).sort({n:1}).toArray((err,file)=>{
    if(file && file.length>0){
      var base64data = Buffer.from(file[0].data.toString(), 'binary').toString('base64');
      var originaldata = Buffer.from(base64data, 'base64');
      res.status(200).json({
        'content':originaldata.toString()
      })
    }else{
      console.log(file)
      res.status(404).send({'err':'No Such File Exists!!'})
    }
    
  })
});




var PORT =3000
app.listen(PORT,function(){
    console.log('Listening on port number : '+PORT)
})

