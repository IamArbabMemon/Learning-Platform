import {schema as studentRegistrationSchema} from '../schemas/studentRegisterSchema'
import { uploadFile } from '../utils/cloudinary';
import { studentModel } from '../models/student.model';
import bcrypt from 'bcrypt';

const registerStudent = async(req:any,res:any)=>{
        try{
           const data = req.body;     
           console.log(data);
           studentRegistrationSchema.parse(data);


           if(await studentModel.findOne({username:data.username})){
                return res.json({success:false,message:'user already existed',statusCode:400});
           }

           


        }catch(error:any){
           console.log(error.message);
           return res.json({success:false,message:error.message,statusCode:500});     
        }

}

export {registerStudent};

