const db = require('../database/db');
const multer = require('multer');
const path = require('path');
const User = require('../models/users.m');
const Course_Student = require('../models/course_student.m');
const Course = require('../models/course.m');
const Exercise = require('../models/exercise.m');
const moment = require('moment');
const Course_Teacher = require('../models/course_teacher.m');
const Topic = require('../models/topic.m');
const fs = require('fs');
const Submission= require('../models/submission.m');
  // Đường dẫn đến thư mục "Submission"
  const submissionFolder = path.join(__dirname, '../Submission');

  // Kiểm tra và tạo thư mục nếu không tồn tại
  if (!fs.existsSync(submissionFolder)) {
      fs.mkdirSync(submissionFolder);
  }
// Thiết lập multer để lưu trữ file trong thư mục "Submission"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, 'Submission');
    },
    filename:async function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const stringWithUnderscore = file.originalname.replace(/\s+/g, '_');
        const submissionfile = uniqueSuffix + '-' + stringWithUnderscore;

        console.log('Uploaded file name:', submissionfile);
        const user_id=req.body.user_id;
        const SubmissionTime= req.body.date;
        const exercise_id= req.body.exercise_id;
        const Score=0;
        const data= new Submission({user_id,exercise_id,SubmissionTime,submissionfile,Score});
        const insert= await Submission.insert(data);

        console.log(user_id);
        cb(null, submissionfile);
    },
});

const upload = multer({ storage: storage });

class StudentController {
    async home(req,res) {
        // console.log('req.session.user_id', req.session.user_id);
        const userid = req.session.user_id;
        // const userid = req.query.user_id;
        // res.json(req.session);
        const user = await User.getCondition('user_id', userid);

        const userAccount = await User.getAccount(userid);
        const userEmail = userAccount[0].account_email;

        const course_student = await Course_Student.getCondition('user_id', userid);
        let courses = [];
        for (let i = 0; i < course_student.length; i++) {
            const course = await Course.getCondition('course_id', course_student[i].course_id);
            courses.push(course[0]);
        }

        let exercises = [];
        for (let i = 0; i < courses.length; i++) {
            const exerciseInOneCourse = await Exercise.getUpcommingEvents(courses[i].course_id);
            for (let j = 0; j < exerciseInOneCourse.length; j++) {
                exerciseInOneCourse[j].duetime = moment(exerciseInOneCourse[j].duetime).format('HH:mm - DD/MM/YYYY');
                exercises.push(exerciseInOneCourse[j]);
            }
        }

        const dataRender = { user: user[0], arrayCourse: courses, userEmail: userEmail, exercises: exercises };
        res.render('student/home', dataRender);
    }

    async course(req, res) {
        const userid = req.session.user_id;
        const user = await User.getCondition('user_id', userid);
        const id_course = req.query.course_id;
        const dataUserAccount = await db.getAllInforUser();

        let dataCourse = await Course.getCondition('course_id', id_course);
        dataCourse = dataCourse[0];

        let dataTopic = await Topic.getCondition('course_id', id_course);
        dataTopic.forEach(async (topic) => {
            const data = await Exercise.getCondition('topic_id', topic.topic_id);
            topic['exercise'] = data;
            //console.log(topic);
        });

        let finalscore = await db.getFinalScore(id_course, userid);
        finalscore = finalscore[0].finalscore;


        const listIDTeacher = await Course_Teacher.getCondition('course_id', id_course);
        const inforTeacher = dataUserAccount.filter(objA => listIDTeacher.some(objB => objB.user_id === objA.user_id));
        const listTeacher = [];
        for (const teacher of inforTeacher) {
            const obj = { user_name: teacher.user_name };
            listTeacher.push(obj);
        }

        let student = await db.countItem('course_Student', 'course_id', id_course);
        console.log(student);
        student = student[0].count;
        let teacher = await db.countItem('course_Teacher', 'course_id', id_course);
        teacher = teacher[0].count;
        
        const dataRender = {
            user: user[0],
            course_name: dataCourse.course_name,
            course_id: dataCourse.course_id,
            dataTopic: dataTopic,
            teacher: listTeacher,
            numberofteacher: teacher,
            numberofstudent: student,
            finalscore: finalscore

        };
        res.render('student/course', dataRender);
    }

    async submission(req, res) {
        res.render('student/submission');
    }
    upload(req,res)
    {
        upload.array('files')(req, res, function (err) {

            if (err) {
                // Xử lý lỗi khi upload file
                console.error(err);
                return res.status(500).json({ error: 'Error uploading files.' });
            }
            // Tiếp tục xử lý sau khi upload thành công
            res.json({ message: 'Files uploaded successfully.' });
        });
    }
}

module.exports = new StudentController();
