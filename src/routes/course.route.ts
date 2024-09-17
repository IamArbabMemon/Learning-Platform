import {Router} from 'express';
import { checkAuthentication } from '../middlewares/checkAuthentication.middleware';
import { createCourse ,getAllCourses, getCourseByID} from '../controllers/course.controller';

const router = Router();

router.route('/createCourse').post(checkAuthentication,createCourse);
router.route('/getAllCourses').get(getAllCourses);
router.route('/getCourseByID').get(getCourseByID);


export {router}