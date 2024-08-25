import {Router} from 'express';
import { registerStudent ,loginStudent} from '../controllers/student.controller';
import {upload} from '../middlewares/multer.middleware'


const router = Router();

router.route('/register').post(upload.fields([{name:'image',maxCount:1}]),registerStudent);

router.route('/login').post(loginStudent);

export {router};