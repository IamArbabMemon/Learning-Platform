import {Router} from 'express';
import { registerTeacher ,loginTeacher} from '../controllers/teacher.controller';
import {upload} from '../middlewares/multer.middleware'


const router = Router();

router.route('/register').post(upload.fields([{name:'image',maxCount:1}]),registerTeacher);
router.route('/login').post(loginTeacher);

export {router};