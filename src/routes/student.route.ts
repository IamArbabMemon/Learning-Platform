import {Router} from 'express';
import { registerStudent ,loginStudent,studentLogout,studentSendOTP,studentSetNewPassword} from '../controllers/student.controller';
import {upload} from '../middlewares/multer.middleware'
import { checkAuthentication } from '../middlewares/checkAuthentication.middleware';

const router = Router();



router.route('/register').post(upload.fields([{name:'image',maxCount:1}]),registerStudent);

router.route('/login').post(loginStudent);

router.route('/logout').get(checkAuthentication,studentLogout);

router.route('/sendOTP').get(checkAuthentication,studentSendOTP);


router.route('/forget-password/:token').post(checkAuthentication,studentSetNewPassword);



export {router};