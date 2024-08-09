import {Router} from "express";
import {signup, mailVerified, login,logout, addStudentDetails, getStudent, } from "../controllers/student.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import {authSTD} from "../middlewares/stdAuth.middleware.js"
import { authSchema } from "../middlewares/joiLogin.middleware.js";

const router = Router()
// Student routes for signup
router.route("/signup").post(
    signup
)
// Student routes for verifying email
router.route("/verify").get(
    mailVerified
)
// Student routes for login
router.route("/login").post(
    authSchema, login
)
// Student routes for logout
router.route("/logout").post(authSTD, logout)
// Student routes for adding details
router.route("/Verification/:id").post(authSTD,
    upload.fields([
        {
            name:"Idpic",
            maxCount:1,
        }
    ]) ,
    addStudentDetails)
// Student routes for getting details
router.route("/StudentDocument/:id").get(authSTD, getStudent)

export default router;