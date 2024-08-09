import { Router } from "express";
import { addClass, addCourseStudent, addCourseTeacher, enrolledcourseSTD, enrolledcourseTeacer, getCourse, getcourseTeacher, stdEnrolledCoursesClasses, teacherEnrolledCoursesClasses, removeCourseStudent } from "../controllers/course.controller.js";
import { authSTD } from "../middlewares/stdAuth.middleware.js";
import { authTeacher } from "../middlewares/teacherAuth.middleware.js";


const router = Router()

// Course routes
router.route("/all").get(getCourse)
// get course by name
router.route("/:coursename").get(getcourseTeacher)
// create course
router.route("/:coursename/create/:id").post(authTeacher, addCourseTeacher)
// add student to course
router.route("/:coursename/:courseID/add/student/:id").post(authSTD, addCourseStudent)
// get enrolled courses
router.route("/student/:id/enrolled").get(authSTD, enrolledcourseSTD)
// get enrolled courses
router.route("/teacher/:id/enrolled").get(authTeacher, enrolledcourseTeacer)
// add class to course
router.route("/:courseId/teacher/:teacherId/add-class").post(authTeacher, addClass)
// get classes of student
router.route("/classes/student/:studentId").get(authSTD, stdEnrolledCoursesClasses)
// get classes of teacher
router.route("/classes/teacher/:teacherId").get(authTeacher, teacherEnrolledCoursesClasses)
// remove student from course
router.route("/:courseID/remove/student/:id").delete(authSTD, removeCourseStudent);

export default router;