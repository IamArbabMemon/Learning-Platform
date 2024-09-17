import {Router} from 'express';
import { checkAuthentication } from '../middlewares/checkAuthentication.middleware';
import { createCourse ,getAllCourses} from '../controllers/course.controller';

const router = Router();

router.route('/createCourse').post(checkAuthentication,createCourse);
router.route('/getAllCourses').get(getAllCourses);

export {router}