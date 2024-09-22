import {Router} from 'express';
import { checkAuthentication } from '../middlewares/checkAuthentication.middleware';
import { createCourse ,getAllCourses, getCourseByID,addLesson} from '../controllers/course.controller';
import {upload} from '../middlewares/multerForVideoUpload.middleware'

const router = Router();

router.route('/createCourse').post(checkAuthentication,createCourse);
router.route('/getAllCourses').get(getAllCourses);
router.route('/getCourseByID').get(getCourseByID);
router.route('/addLesson').post(checkAuthentication,upload.fields([{name:'lessonVideo',maxCount:1}]),addLesson);



export {router}