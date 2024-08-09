import {course} from "../models/course.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { Teacher } from "../models/teacher.model.js";
import {ApiError} from "../utils/ApiError.js"; 
import mongoose from "mongoose";

//import nodemailer
import nodemailer from "nodemailer";

// Get all courses
const getCourse = asyncHandler(async(req,res)=>{

    const courses = await course.find();

    return res
    .status(200)
    .json(new ApiResponse(200, courses, "All courses"))

})
// Get all courses for a teacher
const getcourseTeacher = asyncHandler(async(req,res)=>{

    const coursename = req.params.coursename;

    if(!coursename){
        throw new ApiError(400, "Choose a course")
    }

    // Find the course and populate the enrolledteacher field
    const courseTeachers = await course.find({ coursename }).populate('enrolledteacher');



    if (!courseTeachers || courseTeachers.length === 0) {
        throw new ApiError(400, "No teachers found for the specified course");
    }

    return res
    .status(200)
    .json( new ApiResponse(200, courseTeachers, "details fetched"))
    
})

// Add a course for a teacher
const addCourseTeacher = asyncHandler(async(req,res)=>{
    const loggedTeacher = req.teacher

    const teacherParams = req.params.id

    // check if teacher id is provided
    if(!teacherParams){
      throw new ApiError(400,"Invalid user")
    }

    console.log("running");
 
    if(loggedTeacher._id != teacherParams){
      throw new ApiError(400,"not authorized")
    }

    

    // check if all fields are provided
    const{coursename,description} = req.body

    if ([coursename,description].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    // check if course already exists
    const existingCourse = await course.findOne({
      coursename,
      enrolledteacher: loggedTeacher._id
  });

  if (existingCourse) {
      throw new ApiError(400, "A course with the same name already exists for this teacher");
  }

    // create a new course
    const newCourse = await course.create({
      coursename,
      description,
      enrolledteacher: loggedTeacher._id,
    })

    if(!newCourse){
      throw new ApiError(400, "couldnt create course")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {newCourse, loggedTeacher}, "new course created"))
    
})
// Send enrollment email
const sendEnrollmentEmail = async (email, firstName, courseName) => {
  try {
    // Create a nodemailer transporter
      const emailSender = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
              user: process.env.SMTP_EMAIL,
              pass: process.env.SMTP_PASS,
          }
      });
      // Email options
      const mailOptions = {
          from: "elearningsnu@gmail.com",
          to: email,
          subject: "Enrollment Confirmation",
          html: `
              <div style="text-align: center; font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                  <h2 style="color: #333;">Enrollment Confirmation</h2>
                  <div style="margin-top: 20px; background-color: #fff; border-radius: 5px; padding: 20px;">
                      <p style="margin-bottom: 20px;">Hi ${firstName},</p>
                      <p style="margin-bottom: 20px;">You have successfully enrolled in the course: ${courseName}.</p>
                      <p>Thank you for choosing us!</p>
                  </div>
                  <div style="margin-top: 20px; color: #777;">
                      <p>This is an automated message. Please do not reply.</p>
                  </div>
              </div>`
      };

      await emailSender.sendMail(mailOptions);
      console.log("Enrollment mail sent successfully");
  } catch (error) {
      console.error("Failed to send enrollment email", error);
      throw new ApiError(400, "Failed to send enrollment email");
  }
};
// Add a student to a course
const addCourseStudent = asyncHandler(async(req,res)=>{
 
  const loggedStudent = req.Student
  const studentParams = req.params.id
  const courseID = req.params.courseID

  if(!studentParams){
    throw new ApiError(400, "no params found")
  }

  if(loggedStudent._id != studentParams){
    throw new ApiError(400, "not authorized")
  }

  if(!courseID){
    throw new ApiError(400, "select a course")
  }
// check if course exists
 
  const selectedCourse = await course.findByIdAndUpdate(courseID, 
    {
      $push: {
        enrolledStudent:loggedStudent._id
      }
    }, {
      new: true
    })

  if(!selectedCourse){
    throw new ApiError(400, "failed to add student in course schema")
  }

  await sendEnrollmentEmail(loggedStudent.Email, loggedStudent.Firstname, selectedCourse.coursename);
// add student to course
  const teacherID = selectedCourse.enrolledteacher
// add course to student
  const teacher = await Teacher.findByIdAndUpdate(teacherID,
    {
      $push: {
        enrolledStudent:loggedStudent._id
      }
    }, {
      new: true
    })

  return res.status(200).json(new ApiResponse(200, {teacher, selectedCourse, loggedStudent}, "successfully enrolled in course"))
})
// Get all courses for a student
const enrolledcourseSTD = asyncHandler(async(req,res)=>{
  const stdID = req.params.id

  if(!stdID){
    throw new ApiError(400, "authorization failed")
  }

  if(stdID != req.Student._id){
    throw new ApiError(400, "params and logged student id doesnt match")
  }
  // find student and enrolled course
  const Student = await course.find({ enrolledStudent: stdID }).select( "-enrolledStudent -liveClasses -enrolledteacher")

  if (!Student) {
      throw new ApiError(404, "Student not found");
  }

  return res
  .status(200)
  .json( new ApiResponse(200,Student, "student and enrolled course"))

})

// Get all courses for a teacher
const enrolledcourseTeacer = asyncHandler(async(req,res)=>{
  const teacherID = req.params.id

  if(!teacherID){
    throw new ApiError(400, "authorization failed")
  }

  if(teacherID != req.teacher._id){
    throw new ApiError(400, "params and logged teacher id doesnt match")
  }
  // find teacher and enrolled course
  const teacher = await course.find({ enrolledteacher: teacherID }).select( "-enrolledStudent -liveClasses -enrolledteacher")

  if (!teacher) {
      throw new ApiError(404, "teacher not found");
  }

  return res
  .status(200)
  .json( new ApiResponse(200,teacher, "teacher and enrolled course"))
})
// Add a class to a course
const addClass = asyncHandler(async(req,res) => {
  const {title, timing, link, status } = req.body

  const loggedTeacher = req.teacher

  if ([title, timing, link, status].some((field) => field?.trim() === "")) {
  throw new ApiError(400, "All fields are required");
  }

  const parsedDate = new Date(timing);

  const {courseId, teacherId } = req.params

  const enrolledTeacher = await course.findOne({
  _id: courseId,
  enrolledteacher: teacherId
  })

  if(!enrolledTeacher){
  throw new ApiError(400, "not authorized")
  }
// add class to course
  const enrolledCourse = await course.findOneAndUpdate(
  { _id: courseId }, 
  { $push: { liveClasses: {title, timing, link, status } } },
  { new: true }  
  );

  if(!enrolledCourse){
  throw new ApiError(400, "error occured while adding the class")
  }

  return res
  .status(200)
  .json(new ApiResponse(200, {enrolledCourse, loggedTeacher}, "class added successfully"))
})

// Get all classes for a student
const stdEnrolledCoursesClasses = asyncHandler(async(req,res)=>{
  const Student = req.Student

  const classes = await course.aggregate([
    {
      $match: {
        enrolledStudent: Student._id
      }
    },
    {
      $unwind: "$liveClasses"
    },
    {
      $sort: {
        "liveClasses.timing": 1
      }
    },
    {
      $group: {
        _id: "classes",
        liveClasses: { 
          $push: {
            coursename: "$coursename",
            title: "$liveClasses.title",
            timing: "$liveClasses.timing",
            link: "$liveClasses.link",
            status: "$liveClasses.status"
          }
        }
      }
    }
  ]);

  if(!classes){
    throw new ApiError(400, "couldn't fetch the classes")
  }

  return res
  .status(200)
  .json(new ApiResponse(200, {Student, classes}, "fetched classes successfully"))
})
// Get all classes for a teacher
const teacherEnrolledCoursesClasses = asyncHandler(async(req,res)=>{
  const teacher = req.teacher

  const classes = await course.aggregate([
    {
      $match: {
        enrolledteacher: teacher._id
      }
    },
    {
      $unwind: "$liveClasses"
    },
    {
      $sort: {
        "liveClasses.timing": 1
      }
    },
    {
      $group: {
        _id: "classes",
        liveClasses: { 
          $push: {
            coursename: "$coursename",
            title: "$liveClasses.title",
            timing: "$liveClasses.timing",
            link: "$liveClasses.link",
            status: "$liveClasses.status"
          }
        }
      }
    }
  ]);

  if(!classes){
   throw new ApiError(400, "couldn't fetch the classes")
  }

  return res
  .status(200)
  .json(new ApiResponse(200, {teacher, classes}, "fetched classes successfully"))
})

const removeCourseStudent = asyncHandler(async(req,res)=>{
  const loggedStudent = req.Student;
  const studentIdToRemove = req.params.id;
  const courseId = req.params.courseID;

  if (!studentIdToRemove || !courseId) {
      throw new ApiError(400, "Invalid student or course ID");
  }

  // Find the course
  const courseToUpdate = await course.findById(courseId);

  if (!courseToUpdate) {
      throw new ApiError(404, "Course not found");
  }

  // Check if the logged student is enrolled in the course
  const isEnrolled = courseToUpdate.enrolledStudent.includes(studentIdToRemove);

  if (!isEnrolled) {
      throw new ApiError(400, "Student is not enrolled in this course");
  }

  // Remove the student from the enrolledStudent array
  courseToUpdate.enrolledStudent.pull(studentIdToRemove);

  // Save the updated course
  const updatedCourse = await courseToUpdate.save();

  // Optionally, you can also remove the course from the student's enrolledCourses array here

  return res.status(200).json(new ApiResponse(200, updatedCourse, "Student unenrolled successfully"));
});


export {getCourse, getcourseTeacher, addCourseTeacher, addCourseStudent, enrolledcourseSTD, enrolledcourseTeacer, addClass, stdEnrolledCoursesClasses, teacherEnrolledCoursesClasses, removeCourseStudent} 






