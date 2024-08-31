  import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import {router as studentRouter } from './routes/student.route'
import {router as teacherRouter} from './routes/teacher.route'
import {router as courseRouter} from './routes/course.route'

import {errorHandler} from './middlewares/errorHandlingMiddleware'
import course from './models/courses.model';
const app = express();


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/api/v1/student',studentRouter);
app.use('/api/v1/teacher',teacherRouter);
app.use('/api/v1/course',courseRouter);


app.use(errorHandler)
export {app};