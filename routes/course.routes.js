import {Router} from 'express';
import { getAllCourses, getLecturesCourseById} from '../controllers/course.controller.js';


const router = Router();
router.get('/', getAllCourses);
router.get('/:id', getLecturesCourseById);


export default router