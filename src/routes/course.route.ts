import {Router} from 'express';
import { checkAuthentication } from '../middlewares/checkAuthentication.middleware';
import { createCourse } from '../controllers/course.controller';

const router = Router();

router.route('/createCourse').post(checkAuthentication,createCourse);

export {router}