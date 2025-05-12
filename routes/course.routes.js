import {Router} from 'express';
import { getAllCourses, getLecturesCourseById} from '../controllers/course.controller.js';
import { isLoggedIn } from '../middlewares/auth.middlewares.js';


const router = Router();
router.route('/').get(getAllCourses);
router.route('/:id').get(isLoggedIn,getLecturesCourseById);


export default router