import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Teacher, Teacherdocs } from "../models/teacher.model.js";
import { student, studentdocs } from "../models/student.model.js";
import { admin } from "../models/admin.model.js";



// Admin signup function
const adminSignUp = asyncHandler(async(req,res)=>{
    const {username, password} = req.body

    // check if fields are empty
    if([username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedAdmin = await admin.findOne({ username})

    if(existedAdmin){
        throw new ApiError(400, "admin already exist")
    }

    // create new admin
    const newAdmin = await admin.create({
        username,
        password,
    })

    // check if admin is created
    if(!newAdmin){
        throw new ApiError(400, "failed to add admin")
    }

    return res 
    .status(200)
    .json(new ApiResponse(400,{}, "admin added successfully"))

})

// Generate access and refresh tokens
const generateAccessAndRefreshTokens = async (admindID) =>{ 
    try {
        // find admin by id
        const Admin = await admin.findById(admindID)
        // generate access and refresh tokens
        const Accesstoken = Admin.generateAccessToken()
        const Refreshtoken = Admin.generateRefreshToken()
        // save refresh token
        Admin.Refreshtoken = Refreshtoken
        await Admin.save({validateBeforeSave:false})
        // return tokens
        return{Accesstoken, Refreshtoken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}
// Admin login function
const adminLogin = asyncHandler(async(req,res)=>{

    const {username, password} = req.body

    // check if fields are empty
    if([username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // check if admin exist
    const loggedAdmin = await admin.findOne({username})
    // check if admin exist
    if(!loggedAdmin){
        throw new ApiError(400, "admin does not exist")
    }

    // check if password is correct
    const passwordCheck = await loggedAdmin.isPasswordCorrect(password)

    // check if password is correct
    if(!passwordCheck){
        throw new ApiError(400, "Password is incorrect")
    }

    // generate access and refresh tokens
    const temp_admin = loggedAdmin._id

    // generate access and refresh tokens
    const {Accesstoken, Refreshtoken} =  await generateAccessAndRefreshTokens(temp_admin)

    // get logged in admin
    const loggedadmin = await admin.findById(temp_admin).select("-password -Refreshtoken")

    const options = {
        httpOnly:true,
        secure:true,
    }

    return res 
    .status(200)
    .cookie("Accesstoken", Accesstoken, options)
    .cookie("Refreshtoken", Refreshtoken, options)
    .json(new ApiResponse(200,{admin:loggedadmin}, "logged in successfully"))
})
// Admin logout function
const adminLogout = asyncHandler(async(req,res)=>{

    await admin.findByIdAndUpdate(
        req.Admin._id,
        {
            $set:{
                Refreshtoken:undefined,
            }
        },
        {
            new:true
        }
    )
    const options ={
        httpOnly:true,
        secure:true,
    }

    return res
    .status(200)
    .clearCookie("Accesstoken", options)
    .clearCookie("Refreshtoken",  options)
    .json(new ApiResponse(200, {}, "admin logged out"))
})
// Admin for approval function
const forApproval = asyncHandler(async(req,res)=>{

    const adminID = req.params.adminID

    if(!adminID){
        throw new ApiError(400, "not authorized")
    }

    const loggedAdmin = await admin.findById(adminID)

    if(!loggedAdmin){
        throw new ApiError(400, "admin not found")
    }

    // get students and teachers for approval

    const studentsforApproval = await student.find({
        Isverified: true
    })

    const teachersforApproval = await Teacher.find({
        Isverified: true
    })

    if(!studentsforApproval && !teachersforApproval){
        return res
        .status(200)
        .json(new ApiResponse(200, loggedAdmin, "No pending student or teacher"))
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{admin:loggedAdmin, studentsforApproval
    , teachersforApproval}, "fetched successfully"))
})
// Admin approve student function
const approveStudent = asyncHandler(async(req,res)=>{

    const adminID = req.params.adminID

    // check if admin id is provided
    if(!adminID){
        throw new ApiError(400, "not authorized")
    }

    // check if admin exist
    const loggedAdmin = await admin.findById(adminID)

    // check if admin exist
    if(!loggedAdmin){
        throw new ApiError(400, "admin not found")
    }


    // get student id
    const studentID = req.params.studentID

    if(!studentID){
        throw new ApiError(400, "student id is required")
    }

    // get approval status
    const toApprove = req.body.Isapproved

    const remarks = req.body.remarks || null
    console.log(remarks)
    

    // check if approval status is provided
    if (!toApprove || (toApprove != "approved" && toApprove != "rejected" && toApprove !== "reupload")) {
        throw new ApiError(400, "Please choose 'approve' or 'reject' or 'reupload'");
    }

    // approve or reject student
    const theStudent = await student.findOneAndUpdate({_id: studentID}, {$set: {Isapproved:toApprove, Remarks: remarks}},  { new: true })
    
    if(!theStudent){
        throw new ApiError(400,"faild to approve or reject || student not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, theStudent, `task done successfully`))

})
// Admin approve teacher function
const approveTeacher = asyncHandler(async(req,res)=>{

    // get admin id
    const adminID = req.params.adminID

    // check if admin id is provided
    if(!adminID){
        throw new ApiError(400, "not authorized")
    }

    // check if admin exist
    const loggedAdmin = await admin.findById(adminID)

    // check if admin exist
    if(!loggedAdmin){
        throw new ApiError(400, "admin not found")
    }


    const teacherID = req.params.teacherID

    // get teacher id
    if(!teacherID){
        throw new ApiError(400, "student id is required")
    }


    // get approval status
    const toApprove = req.body.Isapproved

    // check if approval status is provided
    const remarks = req.body.remarks || null

    // check if approval status is provided
    if (!toApprove || (toApprove !== "approved" && toApprove !== "rejected" && toApprove !== "reupload")) {
        throw new ApiError(400, "Please choose 'approve' or 'reject' or 'reupload'");
    }


    // approve or reject teacher
    const theTeacher = await Teacher.findOneAndUpdate({_id: teacherID}, {$set: {Isapproved:toApprove, Remarks: remarks}},  { new: true })
    // approve or reject teacher
    if(!theTeacher){
        throw new ApiError(400,"faild to approve or reject || student not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, theTeacher, `task done successfully`))

})
// Admin check student documents function
const checkStudentDocuments = asyncHandler(async(req,res)=>{
    const adminID = req.params.adminID

    // check if admin id is provided
    if(!adminID){
        throw new ApiError(400, "not authorized")
    }
    // check if admin exist
    const loggedAdmin = await admin.findById(adminID)
    // check if admin exist
    if(!loggedAdmin){
        throw new ApiError(400, "admin not found")
    }
    // get student id
    const studentID = req.params.studentID
    // get student id
    if(!studentID){
        throw new ApiError(400, "no student ID")
    }
    // get student
    const theStudent = await student.findById(studentID)

    // get student
    if(!theStudent){
        throw new ApiError(400, "student not found")
    }
    // get student documents
    const docID = theStudent.Studentdetails

    // get student documents
    if(!docID){
        throw new ApiError(400, "Documents not found, please update")
    }

    // get student documents
    const studentDocs = await studentdocs.findById(docID)
    // get student documents
    if(!studentDocs){
        throw new ApiError(400, "failed to retrieve documents")
    }
    
    return res
    .status(200)
    .json(new ApiResponse(200, {loggedAdmin, theStudent, studentDocs}, "documents retrieved successfully"))


})
// Admin check teacher documents function
const checkTeacherDocuments = asyncHandler(async(req,res)=>{
    const adminID = req.params.adminID

    if(!adminID){
        throw new ApiError(400, "not authorized")
    }

    // check if admin exist
    const loggedAdmin = await admin.findById(adminID)

    if(!loggedAdmin){
        throw new ApiError(400, "admin not found")
    }

    const teacherID = req.params.teacherID

    // get teacher id
    if(!teacherID){
        throw new ApiError(400, "no Teacher ID")
    }

    const theTeacher = await Teacher.findById(teacherID)

    // get teacher
    if(!theTeacher){
        throw new ApiError(400, "Teacher not found")
    }

    const docID = theTeacher.Teacherdetails


    if(!docID){
        throw new ApiError(400, "Documents not found, please update")
    }

    const teacherDocs = await Teacherdocs.findById(docID)
    
    if(!teacherDocs){
        throw new ApiError(400, "failed to retrieve documents")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {loggedAdmin, theTeacher, teacherDocs}, "documents retrieved successfully"))


})

export {adminSignUp, adminLogin, forApproval, approveStudent, approveTeacher, checkStudentDocuments, checkTeacherDocuments, adminLogout}