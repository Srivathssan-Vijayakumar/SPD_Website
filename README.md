# SPD_Website

#outline of the project
    This project "Classmate" is meant to clone the working of Google classroom.
    The project attempts to help students and teachers connect virtually and purse their learning
    This website allows students to attend tests , webinars that are scheduled by their respective teachers and allows those teachers to grade their answer sheets and mark attendance for them


#Description of files

    1.Config Folder :
        1.1 database.js -- the one that stores the mongodb database uri \
        1.2 passport.js -- the file that authenticates the users logging in
    2.Model -Question And Answers : Contains sample test and answer scripts
    3.models -- Contains all the database schemas
    4.public -- contains the css ,js and all image files
    5.views -- contains the web pages
        5.1 Admin Specific Pages :
            5.1.1 new_admin -- Admin Home Page
            5.1.2 new_add_student -- Page that lets you add students
            5.1.3 new_add_mentor -- Page that lets you add mentors
            5.1.4 new_view_feedback -- Page that lets you view feedbacks given by students
            5.1.5 admin_dashboard -- Page that shows various dashboards for admin
        5.2 Mentor Specfici Pages :
            5.2.1 new_mentor -- Mentor Home Page
            5.2.2 mentor_classroom -- Shows all the classrooms added by that mentor
            5.2.3 mentor_classroom_tests -- Shows all the tests added by that mentor
            5.2.4 mentor_classroom_webinars -- Shows all the webinars added by that mentor
            5.2.5 new_schedule_tests --  Lets you add test
            5.2.6 new_schedule_webinar -- Lets you add webinar
            5.2.7 mentor_dashboard -- Shows various dasboards for the mentor
        5.3 Student Specific Pages :
            5.3.1 student_classroom -- Student Home page ; shows various classrooms added by his corresponding mentor
            5.3.2 student_classroom_tests -- shows various tests added by that mentor
            5.3.3 student_classroom_webinars -- shows various webinars added by that mentor
            5.3.4 new_student_feedback -- Shows the feedback form to enter feedback
            5.3.5 new_student_profile -- Shows the student profile
            5.3.6 new_student_edit_profile -- Allows students to edit their profile contents
    6.app.js -- the main server file



#Software Tool Requirement 
   In order to run this project , node v8.0 or higher needs to installed in your local machines
   Download the entire repo and delete the node_modules folder and use command "npm install" to install all dependenices that suits your node version
   FInally use the command "npm run dev" to run the project
   
   
   
