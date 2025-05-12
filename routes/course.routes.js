
import {Router} from 'express';
import { getAllCourses, getLecturesCourseById, createCourse,updateCourse,removeCourse,addLectureToCourseBYid} from '../controllers/course.controller.js';
import { isLoggedIn,authorizedRoles } from '../middlewares/auth.middlewares.js';
import upload from "../middlewares/multer.middleware.js";
const router = Router();
router.route('/')
.get(getAllCourses)
.post(
    upload.single("thumbnail"),
    isLoggedIn,
    authorizedRoles("admin"),
    createCourse
)


router.route('/:id')
.get(isLoggedIn,getLecturesCourseById)
.put(
    isLoggedIn,
   authorizedRoles("admin"),
    updateCourse
)
.delete(isLoggedIn,
    authorizedRoles("admin"), 
    removeCourse
).post(
    isLoggedIn,
    authorizedRoles("admin"),
    upload.single("lecture"),
    addLectureToCourseBYid
)


export default router