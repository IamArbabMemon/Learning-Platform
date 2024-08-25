import {Router} from 'express';
import { registerStudent ,loginStudent,studentLogout} from '../controllers/student.controller';
import {upload} from '../middlewares/multer.middleware'
import { checkAuthentication } from '../middlewares/checkAuthentication.middleware';

const router = Router();

router.route('/register').post(upload.fields([{name:'image',maxCount:1}]),registerStudent);

router.route('/login').post(loginStudent);

router.route('/logout').get(checkAuthentication,studentLogout);

export {router};