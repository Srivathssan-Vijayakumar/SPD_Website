var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var session = require('express-session')
const passport = require('passport')


var app =express()

const uri = require('./config/database').uri
mongoose.connect(uri,{
  useUnifiedTopology:true,
  useNewUrlParser:true
})
const db = mongoose.connection
db.on('error',()=>{
  console.log("Error in connecting")
})

db.once('open',()=>{
  console.log('MongoDb Connected')
})

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

var PORT =3000
app.listen(PORT,function(){
    console.log('Listening on port number : '+PORT)
})

