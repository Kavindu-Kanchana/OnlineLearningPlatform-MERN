import {asyncHandler} from "../utils/asyncHandler.js";
import { admin } from "../models/admin.model.js";
import {ApiError} from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

// Admin authentication middleware
const authAdmin = asyncHandler(async(req,_,next) =>{

    const accToken = req.cookies?.Accesstoken

    if(!accToken) {
        throw new ApiError(401, "unauthorized req")
    }

    // verify access token
    const decodedAccToken = jwt.verify(accToken,
        process.env.ACCESS_TOKEN_SECRET)
        // check if admin exist
    const Admin = await admin.findById(decodedAccToken?._id).select("-password -Refreshtoken")

    if(!Admin){
        throw new ApiError(401, "invalid access token")
    }

    req.Admin = Admin
    next()

    
})

export { authAdmin }