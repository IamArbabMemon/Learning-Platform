import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import {router as studentRouter } from './routes/student.route'
const app = express();

import('dotenv').then(dotenv => {
    dotenv.config({ path: './.env' })
    }
);
  

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/api/v1/student',studentRouter);

export {app};