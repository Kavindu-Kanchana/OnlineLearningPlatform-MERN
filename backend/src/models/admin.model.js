import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"



const adminSchema =  new mongoose.Schema({

    username:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    
    password:{
        type:String,
        required: true,
    },

    Refreshtoken:{
        type:String,
    },

}) 

// Hash password before saving
adminSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next(); 
      this.password = await bcrypt.hash(this.password, 10)
    next()
})
// Check if password is correct
adminSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)
}
// Generate access token
adminSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id:this._id,
        Email:this.Email,
    },
    process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}
// Generate refresh token
adminSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id:this._id,
        Email:this.Email,
    },
    process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}

const admin = mongoose.model("admin",adminSchema);

export {admin}