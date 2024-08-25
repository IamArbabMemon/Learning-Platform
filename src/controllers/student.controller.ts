import dotenv from 'dotenv';
import {schema as studentRegistrationSchema} from '../schemas/studentRegisterSchema'
import { uploadFile } from '../utils/cloudinary';
import { studentModel } from '../models/student.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ErrorResponse } from "../utils/ErrorResponse";


dotenv.config({
   path:'./.env'
})

const registerStudent = async(req:any,res:any)=>{
        try{
          
            if(!req.body)
               return res.status(400).json({success:false,message:'request body object is null'});

           const data = req.body;     
           let profilePicUrl;
           console.log(data);
           studentRegistrationSchema.parse(data);


           if(await studentModel.findOne({username:data.username})){
                return res.status(400).json({success:false,message:'user already existed'});
           }

           const hashedPass = await bcrypt.hash(data.password,10);

           data.password = hashedPass;

           if(req.files.image[0])
            profilePicUrl = await uploadFile(req.files.image[0].path);

           data.profile_picture = profilePicUrl;

           const newUser = new studentModel(data);
           await newUser.save();
           
           return res.status(200).json({success:false,message:'STUDENT HAS BEEN REGISTERED SUCCESSFULLY'});

        }catch(error:any){
           console.log(error.message);
           return res.status(500).json({success:false,message:error.message});     
        }

}

const loginStudent = async(req:any,res:any,next:any)=>{
      try{

         // if(!req.body)
         //    throw new ErrorResponse('Request body not available',400);
         
         const {username,password} = req.body;

         if(!username || !password)
            throw new ErrorResponse('login Credentials are missing',400);

         const user = await studentModel.findOne({username});

         if(!user)
            throw new ErrorResponse('User Not Found',404);

         const passIsCorrect = await bcrypt.compare(password,user.password);

         if(!passIsCorrect)
            throw new ErrorResponse('Incorrect password',404);

          if(!process.env.JWT_SECRET_KEY)
            throw new ErrorResponse('ENVIRONMENT VARIABLE ARE NOT LOADED PROPERPLY PLEASE CHECK YOUR .env FILE',500);

         const token = await jwt.sign({username,studentID:user._id}, process.env.JWT_SECRET_KEY);
         
         return res.cookie('token', token, {
            httpOnly: true,
        }).json({message:"Access token has been set",token, userData:{username,studentID:user._id}});
  
      //console.log('After throw');

      //return res.json({message:'happy'});

      }catch(err:any){
         next(err);
      }
}


export {
   registerStudent,
   loginStudent
};

