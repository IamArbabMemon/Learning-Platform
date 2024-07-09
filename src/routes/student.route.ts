import {Router} from 'express';
import { registerStudent } from '../controllers/student.controller';



const router = Router();

router.route('/register').post(registerStudent);

export {router};