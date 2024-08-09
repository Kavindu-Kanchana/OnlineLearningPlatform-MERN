import { ApiError } from "../utils/ApiError.js";
import {Teacher} from "../models/teacher.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// Teacher authentication middleware
const authTeacher = asyncHandler(async(req,_,next)=>{
    const accToken = req.cookies?.Accesstoken

    // check if access token exist
    if(!accToken){
        throw new ApiError(401, "unauthorized req")
    }

    // verify access token
    const decodedAccToken = jwt.verify(accToken,
        process.env.ACCESS_TOKEN_SECRET)

        // check if teacher exist
    const teacher = await Teacher.findById(decodedAccToken?._id).select("-Password -Refreshtoken")

    if(!teacher){
        throw new ApiError(401, "invalid access token")
    }


    req.teacher = teacher
    next()
})

export {authTeacher}