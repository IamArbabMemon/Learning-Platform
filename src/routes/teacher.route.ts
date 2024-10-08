import {Router} from 'express';
import { registerTeacher ,loginTeacher, teacherLogout, teacherSendOTP, teacherSetNewPassword, getAllTeachers, getTeacherByID} from '../controllers/teacher.controller';
import {upload} from '../middlewares/multer.middleware'
import { checkAuthentication } from '../middlewares/checkAuthentication.middleware';


const router = Router();

router.route('/register').post(upload.fields([{name:'image',maxCount:1}]),registerTeacher);
router.route('/login').post(loginTeacher);
router.route('/logout').get(checkAuthentication,teacherLogout);
router.route('/sendOTP').get(teacherSendOTP);
router.route('/forget-password/:token').post(teacherSetNewPassword);

router.route('/getAllTeachers').get(checkAuthentication,getAllTeachers);
router.route('/getTeacherByID/:teacherID').get(checkAuthentication,getTeacherByID);

export {router};