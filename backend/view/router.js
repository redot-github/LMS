const express = require('express')

const router = express.Router();

const Student = require('../controller/StudentControll')
const Course = require('../controller/CourseControll')
const Batch = require('../controller/BatchControll')
const Staff = require('../controller/StaffControll')
const Login = require('../controller/LoginController')
const Attendance = require('../controller/AttendanceController');
const Scheduler = require('../controller/SchedulerController')

router.post('/StudentDetails', Student.StudentDetails)
router.get('/StudentDisplay', Student.StudentDisplay)
router.put('/StudentUpdate/:id', Student.StudentUpdate)
router.delete('/StudentDelete/:id', Student.StudentDelete)
router.get('/StudentProfile', Student.StudentProfile)
router.get('/Get/:coursecode', Student.GetCourse)
router.get('/GetBatches', Student.GetCourses)
router.get('/GetCourseCount', Student.CountCyber);
router.get('/getCourseStudentCount', Student.getCourseStudentCount)

router.get('/GetTotalStudents', Student.getTotalStudents);
router.get('/GetTotalStaffs', Staff.getTotalStaffs);
router.get('/GetTotalCourses', Course.getTotalCourses);
router.get('/GetTotalBatches', Batch.getTotalBatches);

router.post('/CourseDetails', Course.CourseDetails)
router.get('/CourseDisplay', Course.CourseDisplay)
router.put('/CourseUpdate/:id', Course.CourseUpdate)
router.delete('/CourseDelete/:id', Course.CourseDelete)
router.get('/GetCourseData', Course.getCourseData)

router.post('/BatchDetails', Batch.BatchDetails)
router.get('/BatchDisplay', Batch.BatchDisplay)
router.delete('/BatchDelete/:id', Batch.BatchDelete)
router.put('/BatchUpdate/:id', Batch.BatchUpdate)
router.get('/GetBatch', Batch.GetBatch)
router.get('/GetCourse', Batch.Courses)

router.post('/StaffDetails', Staff.StaffDetails)
router.get('/StaffDisplay', Staff.StaffDisplay)
router.get('/StaffData/:id', Staff.GetStaff)
router.put('/StaffUpdate/:id', Staff.StaffUpdate)
router.delete('/StaffDelete/:id', Staff.StaffDelete)

//Admin
router.post('/Signup', Login.SignUp)
router.post('/loginadmin', Login.AdminLogin)
router.get('/GetUser', Login.Verify, Login.GetUser)
router.get('/GetUser', Login.GetUser)
router.get('/refresh', Login.Refresh, Login.Verify, Login.GetUser)
router.post('/Logout', Login.Verify, Login.Logout)

//Staff
router.post('/loginStaff', Login.StaffLogin)
router.get('/GetStaff', Login.StaffVerify, Login.StaffGetUser)
router.get('/StaffRefresh', Login.StaffRefresh, Login.StaffVerify, Login.StaffGetUser)
router.post('/StaffLogout', Login.StaffVerify, Login.StaffLogout)

//Student
router.post('/loginStudent', Student.StudentLogin)
router.get('/GetStudent', Student.StudentVerify, Student.StudentGetUser)
router.get('/StudentRefresh', Student.StudentRefresh, Student.StudentVerify, Student.StudentGetUser)
router.post('/StudentLogout', Student.StudentVerify, Student.StudentLogout)

// Attendance:
router.get('/getAttendance', Attendance.getAttendance);
router.post('/addAttendance', Attendance.addAttendance);
router.put('/updateAttendance/:id', Attendance.updateAttendance);
router.delete('/deleteAttendance/:id', Attendance.deleteAttendance);
router.get('/getCourseAndBatch/:Course/:Batch', Attendance.getStudentsByCourseAndBatch);

//Scheduler:
router.post('/addscheduler', Scheduler.addScheduler);
router.get('/getallscheduler', Scheduler.getAllSchedulers);
router.get('/getscheduler/:id', Scheduler.getSchedulerById);
router.put('/updatescheduler/:id', Scheduler.updateScheduler);
router.delete('/deletescheduler/:id', Scheduler.deleteScheduler);
router.get('/getStaffByCourse/:Course/:Batch/:BatchTime', Scheduler.getStaffsByCourseAndBatch);

module.exports = router;
