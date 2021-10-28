// var Students=[{
//     id:1,
//     type:'student',
//     Name:'Student-1',
//     username:'student1',
//     password:'username1',
//     email:'student1@gmail.com',
//     Mobile_Number:'+919898989898',
//     Mentor:'Mentor-1',
//     attendance:90.0,
//     NumOfWebinars:3,
//     image:"noimage"
// },
// {
//     id:2,
//     type:'student',
//     Name:'Student-2',
//     username:'student2',
//     password:'username2',
//     email:'student2@gmail.com',
//     Mobile_Number:'+919888988898',
//     Mentor:'Mentor-2',
//     attendance:89.0,
//     NumOfWebinars:3,
//     image:"noimage"
// },
// {
//     id:3,
//     type:'student',
//     Name:'Student-3',
//     username:'student3',
//     password:'username3',
//     email:'student3@gmail.com',
//     Mobile_Number:'+919866987798',
//     Mentor:'Mentor-3',
//     attendance:78.0,
//     NumOfWebinars:2,
//     image:"noimage"
// },
// {
//     id:4,
//     type:'student',
//     Name:'Student-4',
//     username:'student4',
//     password:'username4',
//     email:'student4@gmail.com',
//     Mobile_Number:'+919800988898',
//     Mentor:'',
//     attendance:0.0,
//     NumOfWebinars:0,
//     image:"noimage"
// },
// {
//     id:5,
//     type:'student',
//     Name:'Student-5',
//     username:'student5',
//     password:'username5',
//     email:'student5@gmail.com',
//     Mobile_Number:'+919877985598',
//     Mentor:'',
//     attendance:0.0,
//     NumOfWebinars:0,
//     image:"noimage"
// }]

// var Mentors=[{
//     id:1,
//     Name:'Mentor-1',
//     username:'mentor1',
//     password:'username1',
//     email:'mentor1@gmail.com',
//     NumOfWebinars:2,
//     NumOfStudents:1,
// },
// {
//     id:2,
//     Name:'Mentor-2',
//     username:'mentor2',
//     password:'username2',
//     email:'mentor2@gmail.com',
//     NumOfWebinars:1,
//     NumOfStudents:1,
// },
// {
//     id:3,
//     Name:'Mentor-3',
//     username:'mentor4',
//     password:'username1',
//     email:'mentor3@gmail.com',
//     NumOfWebinars:1,
//     NumOfStudents:1,
// }
// ]

// var Tests=[{
//     id:1,
//     title:"Test-1",
//     date:"30/07/2021",
//     time:"04:45:00",
//     testLink:"Test-Link",
//     mentor:"Mentor-1",
//     isGraded:"0"
// },
// {
//     id:2,
//     title:"Test-2",
//     date:"31/07/2021",
//     time:"05:45:00",
//     testLink:"Test-Link",
//     mentor:"Mentor-1",
//     isGraded:"0"
// },
// {
//     id:3,
//     title:"Test-3",
//     date:"01/08/2021",
//     time:"06:00:00",
//     testLink:"Test-Link",
//     mentor:"Mentor-2",
//     isGraded:"0"
// },
// {
//     id:4,
//     title:"Test-4",
//     date:"08/08/2021",
//     time:"03:00:00",
//     testLink:"Test-Link",
//     mentor:"Mentor-3",
//     isGraded:"0"
// }
// ]

// var Webinars=[{
//     id:1,
//     title:"Webinar-1",
//     date:"30/07/2021",
//     time:"04:45:00",
//     webinarLink:"Test-Link",
//     mentor:"Mentor-1"
// },
// {
//     id:2,
//     title:"Webinar-2",
//     date:"31/07/2021",
//     time:"05:45:00",
//     webinarLink:"Test-Link",
//     mentor:"Mentor-1"
// },
// {
//     id:3,
//     title:"Webinar-3",
//     date:"01/08/2021",
//     time:"06:00:00",
//     webinarLink:"Test-Link",
//     mentor:"Mentor-2"
// },
// {
//     id:4,
//     title:"Webinar-4",
//     date:"08/08/2021",
//     time:"03:00:00",
//     webinarLink:"Test-Link",
//     mentor:"Mentor-3"
// }
// ]

// var Feedbacks =[
//     {
//         student:"student1",
//         mentor:"Mentor-1",
//         webinar:"Webinar-1",
//         feedback:"It was mesmerizing and learned a lot of stuff.It helped me get a lot of stuffs.",
//         rating:"5"
//     },
//     {
//         student:"student1",
//         mentor:"Mentor-1",
//         webinar:"Webinar-2",
//         feedback:"It was good and decent.",
//         rating:"4"
//     },
//     {
//         student:"student2",
//         mentor:"Mentor-2",
//         webinar:"Webinar-3",
//         feedback:"The explanation given by the mentor was simply awesome.I loved it.",
//         rating:"5"
//     },
//     {
//         student:"student3",
//         mentor:"Mentor-3",
//         webinar:"Webinar-4",
//         feedback:"The explanation was very poor and the mentor was too fast in explaining the concepts.Could have been better.",
//         rating:"2"
//     }
// ]

const Students = require('../models/Students')
const Mentors = require('../models/Mentors')
const Tests = require('../models/Tests')
const Webinars = require('../models/Webinars')
const Feedbacks = require('../models/Feedback')
module.exports = {Students,Mentors,Tests,Webinars,Feedbacks}