import { Router } from "express";
import { adminLogin, adminLogout, adminSignUp, approveStudent, approveTeacher, checkStudentDocuments, checkTeacherDocuments, forApproval } from "../controllers/admin.controller.js";
import { authAdmin } from "../middlewares/adminAuth.middleware.js";

const router = Router()
// Admin routes for signup
router.route("/signup").post(adminSignUp)
// Admin routes for login
router.route("/login").post(adminLogin)
// Admin routes for approval
router.route("/:adminID/approve").post(authAdmin, forApproval)
// Admin routes for approving student
router.route("/:adminID/approve/student/:studentID").post(authAdmin, approveStudent)
// Admin routes for approving teacher
router.route("/:adminID/approve/teacher/:teacherID").post(authAdmin,approveTeacher)
// Admin routes for checking student documents
router.route("/:adminID/documents/student/:studentID").get(authAdmin, checkStudentDocuments)
// Admin routes for checking teacher documents
router.route("/:adminID/documents/teacher/:teacherID").get(authAdmin, checkTeacherDocuments)
// Admin routes for logout
router.route("/logout").post(authAdmin, adminLogout)

export default router;

