import {Router} from "express";
import {signup, mailVerified, login, logout, addTeacherDetails, getTeacher} from "../controllers/teacher.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { authTeacher } from "../middlewares/teacherAuth.middleware.js";
import { authSchema } from "../middlewares/joiLogin.middleware.js";

const router = Router()
// Teacher routes for signup
router.route("/signup").post(
    signup
)
// Teacher routes for verifying email
router.route("/verify").get(
    mailVerified
)
// Teacher routes for login
router.route("/login").post(
    authSchema, login
)
// Teacher routes for logout
router.route("/logout").post(
    authTeacher, logout
)
// Teacher routes for adding details
router.route("/verification/:id").post(authTeacher,
    upload.fields([
        {
            name:"Idpic",
            maxCount:1,
        }
    ]) ,
     addTeacherDetails)
// Teacher routes for getting details
router.route("/TeacherDocument/:id").get(authTeacher, getTeacher)

export default router;