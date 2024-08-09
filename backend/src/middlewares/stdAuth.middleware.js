import {asyncHandler} from "../utils/asyncHandler.js";
import {student} from "../models/student.model.js";
import {ApiError} from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

// Student authentication middleware
const authSTD = asyncHandler(async(req,_,next) =>{

    // get access token
    const accToken = req.cookies?.Accesstoken

    if(!accToken) {
        throw new ApiError(401, "unauthorized req")
    }

    const decodedAccToken = jwt.verify(accToken,
        process.env.ACCESS_TOKEN_SECRET)

    const Student = await student.findById(decodedAccToken?._id).select("-Password -Refreshtoken")

    // check if student exist
    if(!Student){
        throw new ApiError(401, "invalid access token")
    }

    req.Student = Student
    next()

    
})

export { authSTD }