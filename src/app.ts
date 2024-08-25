  import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import {router as studentRouter } from './routes/student.route'
import {router as teacherRouter} from './routes/teacher.route'
import {errorHandler} from './middlewares/errorHandlingMiddleware'
const app = express();


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/api/v1/student',studentRouter);
app.use('/api/v1/teacher',teacherRouter);

// app.post('/image',upload.fields([{name:'image',maxCount:1}]),async(req:any,res:any)=>{
//     try {
//         const name :string = req.body.name;
//         if(name.includes('x'))
//             throw new Error('name contains x');
        
//         if(name.includes('z'))
//             throw new Error('name contains z');


//         return res.status(200).json({message:"success"});      

//     } catch (error:any) {
//        return res.status(500).json({message:error.message});     
//     }
// })

app.use(errorHandler)
export {app};