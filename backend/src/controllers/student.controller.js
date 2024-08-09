import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {student, studentdocs} from "../models/student.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import nodemailer from "nodemailer";

// Verify email function
const verifyEmail = async (Email, Firstname, createdStudent_id) => {
    try {
        const emailsender = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASS,
            }
        });

        // Email data
        const mailOptions = {
            from: "elearningsnu@gmail.com",
            to: Email,
            subject: "Verify your E-mail",
            html: `
            <div style="text-align: center;">
                <p style="margin: 20px;"> Hi ${Firstname}, Please click the button below to verify your E-mail. </p>
                <img src="https://img.freepik.com/free-vector/illustration-e-mail-protection-concept-e-mail-envelope-with-file-document-attach-file-system-security-approved_1150-41788.jpg?size=626&ext=jpg&uid=R140292450&ga=GA1.1.553867909.1706200225&semt=ais" alt="Verification Image" style="width: 100%; height: auto;">
                <br>
                <a href="http://localhost:8000/api/student/verify?id=${createdStudent_id}">
                    <button style="background-color: black; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 10px 0; cursor: pointer;">Verify Email</button>
                </a>
            </div>`
        };

        // Send email
        emailsender.sendMail(mailOptions, function(error) {
            if (error) {
                throw new ApiError(400, "Sending email verification failed");
            } else {
                console.log("Verification mail sent successfully");
            }
        });
    } catch (error) {
        throw new ApiError(400, "Failed to send email verification");
    }
};
// Generate access and refresh tokens
const generateAccessAndRefreshTokens = async (stdID) =>{ 
    try {
        
        const std = await student.findById(stdID)
        
        const Accesstoken = std.generateAccessToken()
        const Refreshtoken = std.generateRefreshToken()

        std.Refreshtoken = Refreshtoken
        await std.save({validateBeforeSave:false})

        return{Accesstoken, Refreshtoken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

// Signup function
const signup = asyncHandler(async (req, res) =>{
    
    const{Firstname, Lastname, Email, Password} = req.body;

    
    if(
        [Firstname, Lastname, Email, Password].some((field)=> 
        field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    
    const existedStudent = await student.findOne({ Email: req.body.Email });

    if(existedStudent){
        throw new ApiError(400, "Student already exist")
    }

    
    const newStudent = await student.create({
        Email,
        Firstname,
        Lastname,
        Password,
        Studentdetails:null,

    })

    const createdStudent = await student.findById(newStudent._id).select(
        "-Password "
    ) 
    
    if(!createdStudent){
        throw new ApiError(501, "Student registration failed")
    }
    

    await verifyEmail(Email, Firstname, newStudent._id);

    return res.status(200).json(
        new ApiResponse(200, createdStudent, "Signup successfull")
    )

})
// Verify email function
const mailVerified = asyncHandler(async(req,res)=>{
        const id = req.query.id;

        const updatedInfo = await student.updateOne({ _id: id }, { $set: { Isverified: true } });

        if (updatedInfo.nModified === 0) {
            throw new ApiError(404, "Student not found or already verified");
        }
        return res.send(`
        <div style="text-align: center; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <img src="https://cdn-icons-png.flaticon.com/128/4436/4436481.png" alt="Verify Email Icon" style="width: 100px; height: 100px;">
            <h1 style="font-size: 36px; font-weight: bold; padding: 20px;">Email Verified</h1>
            <h4>Your email address was successfully verified.</h4>
            <button style="padding: 10px 20px; background-color: #007bff; color: white; border: none; cursor: pointer; margin: 20px;" onclick="window.location.href = 'http://localhost:5173';">Go Back Home</button>
        </div>
        `);
} )
// Login function
const login = asyncHandler(async(req,res) => {

    const Email = req.user.Email
    const Password = req.user.Password


    if([Email, Password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const StdLogin = await student.findOne({
        Email
    })

    if(!StdLogin){
        throw new ApiError(400, "Student does not exist")
    }

    if(!StdLogin.Isverified){
        throw new ApiError(401, "Email is not verified");
    }

    const StdPassCheck = await StdLogin.isPasswordCorrect(Password)

    if(!StdPassCheck){
        throw new ApiError(403,"Password is incorrect",)
    }

    const tempStd = StdLogin._id

    
    const {Accesstoken, Refreshtoken} =  await generateAccessAndRefreshTokens(tempStd)

    const loggedInStd = await student.findById(tempStd).select("-Password -Refreshtoken")

    const options = {
        httpOnly:true,
        secure:true,
    }

    return res
    .status(200)
    .cookie("Accesstoken", Accesstoken, options)
    .cookie("Refreshtoken", Refreshtoken, options)
    .json(
        new ApiResponse(
            200,{
            user:loggedInStd
            }, "logged in"
            )
    )

})
// Logout function
const logout = asyncHandler(async(req,res)=>{
    await student.findByIdAndUpdate(
        req.Student._id,
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
    .json(new ApiResponse(200, {}, "User logged out"))
})
// Get student function
const getStudent = asyncHandler(async(req,res)=>{
    const user = req.Student
    const id = req.params.id
    if(req.Student._id != id){
        throw new ApiError(400, "unauthroized access")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, user, "Student is logged in"))
})
// Add student details function
const addStudentDetails = asyncHandler(async(req, res)=>{

    const id = req.params.id
    if(req.Student._id != id){
        throw new ApiError(400,"not authorized ")
    }

    const {Phone, Address}  = req.body

    if ([Phone, Address].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const alreadyExist = await studentdocs.findOne({Phone})

    if(alreadyExist){
        throw new ApiError(400, "phone number already exists")
    }

    const IdpicLocalPath = req.files?.Idpic?.[0]?.path;

    if(!IdpicLocalPath){
        throw new ApiError(400, "Idpic is required")
    }

    const Idpic = await uploadOnCloudinary(IdpicLocalPath)
 
    const studentdetails = await studentdocs.create({
        Phone,
        Address,
        Idpic: Idpic.url,
    })

    //throw new ApiError(400, "failed to upload documents")
    const theStudent = await student.findOneAndUpdate({_id: id}, {$set: {Isapproved:"pending", Studentdetails: studentdetails._id}},  { new: true }).select("-Password -Refreshtoken")
    
    
    if(!theStudent){
        throw new ApiError(400,"faild to approve or reject || student not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, theStudent, "documents uploaded successfully"))

})



export{
    signup, mailVerified, login, logout, addStudentDetails, getStudent, 
}