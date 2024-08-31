import dotenv from 'dotenv'
import { uploadFile } from '../utils/cloudinary';
import { teacherModel } from '../models/teacher.model';
import bcrypt from 'bcrypt';
import { ErrorResponse } from "../utils/ErrorResponse";
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { redisClient } from '../db/redisClient';
import { sendOTPMail } from '../utils/mailer';

dotenv.config({
   path:'./.env'
})


const registerTeacher = async(req:any,res:any)=>{
        try{
          
            if(!req.body)
               return res.status(400).json({success:false,message:'request body object is null'});

           const data = req.body;     
           let profilePicUrl;
           console.log(data);
           
           if(await teacherModel.findOne({username:data.username})){
                return res.status(400).json({success:false,message:'user already existed'});
           }

           const hashedPass = await bcrypt.hash(data.password,10);

           data.password = hashedPass;

           if(req.files.image[0])
            profilePicUrl = await uploadFile(req.files.image[0].path);

           data.profile_picture = profilePicUrl;

           const newUser = new teacherModel(data);
           await newUser.save();
           
           return res.status(200).json({success:true,message:'TEACHER HAS BEEN REGISTERED SUCCESSFULLY'});

        }catch(error:any){
           console.log(error.message);
           return res.status(500).json({success:false,message:error.message});     
        }

}


const loginTeacher = async(req:any,res:any,next:any)=>{
   try{

      // if(!req.body)
      //    throw new ErrorResponse('Request body not available',400);
      
      const {username,password} = req.body;

      if(!username || !password)
         throw new ErrorResponse('login Credentials are missing',400);

      const user = await teacherModel.findOne({username});

      if(!user)
         throw new ErrorResponse('User Not Found',404);

      const passIsCorrect = await bcrypt.compare(password,user.password);

      if(!passIsCorrect)
         throw new ErrorResponse('Incorrect password',404);

       if(!process.env.JWT_SECRET_KEY)
         throw new ErrorResponse('ENVIRONMENT VARIABLE ARE NOT LOADED PROPERPLY PLEASE CHECK YOUR .env FILE',500);

      const token = await jwt.sign({username,userID:user._id,userRole:user.role,userEmail:user.email}, process.env.JWT_SECRET_KEY);
      
      return res.cookie('token', token, {
         httpOnly: true,
     }).json({message:"Access token has been set",token, userData:{username,userID:user._id,userRole:user.role}});

   }catch(err:any){
      next(err);
   }
}

const teacherLogout = async(req:any,res:any,next:any)=>{
   try{

            if(!req.user)
               throw new ErrorResponse('User is not logged in or authenticated',400);

              // Clear the token from the cookie
              res.clearCookie('token', {
               httpOnly: true
           });
   
           // Send response confirming logout
           res.status(200).json({ message: "You have successfully logged out." });


   }catch(err){
      next(err);
   }
};


const teacherSendOTP = async(req:any,res:any,next:any)=>{
   try{
         const user = req.user;
      if(!user)
         throw new ErrorResponse('user is not authenticated',400);

         const token = crypto.randomBytes(32).toString('hex');

      const link = `${req.protocol}://${req.get('host')}/api/v1/teacher/forget-password/${token}`;


   await redisClient.set(`resetToken:${token}`, user.userID, {
         EX: 1800, 
     });


    const result = await sendOTPMail({username:user.username,email:user.userEmail},link);
    console.log(result);       

     return res.json({success:true,message:"otp email has been sent successfully"});

   }catch(err){
      next(err)
   }
}



const teacherSetNewPassword = async(req:any,res:any,next:any)=>{
   try{
      
      const extractedToken = req.params.token;

      const {newPassword} = req.body;

      if(!newPassword)
         throw new ErrorResponse('new password is missing from request body',400);

      if(!extractedToken)
         throw new ErrorResponse('Token is missing from request url',400);

      const userID = await redisClient.get(`resetToken:${extractedToken}`);

      const hashedNewPassword = await bcrypt.hash(newPassword,10);

      //const hashedPass = await bcrypt.hash(data.password,10);

      const result = await teacherModel.findByIdAndUpdate(userID,{password:hashedNewPassword});

      console.log(result);

      return res.json({success:true,message:"PASSWORD HAS BEEN UPDATED SUCCESSFULLY"});

   }catch(err){
      next(err);
   }
}

const getAllTeachers = async(req:any,res:any,next:any)=>{

   try {

      if(!(req.user.role==='Admin'))
         throw new ErrorResponse('unauthorized request',400);
      
      const allTeachers = await teacherModel.find();
      return res.json({success:true,data:allTeachers});

   } catch (error:any) {
      next(error);
   }
}

const getTeacherByID = async(req:any,res:any,next:any)=>{

   try {
      if(!(req.user.role==='Admin'))
         throw new ErrorResponse('unauthorized request',400);

      if(!req.params.teacherID)
         throw new ErrorResponse('teacherID is missing from parameters',400);

      const teacher = await teacherModel.findById(req.params.teacherID);

      return res.json({success:true,data:teacher});

   } catch (error:any) {
      next(error);
   }
}




export {
   registerTeacher,
   loginTeacher,
   teacherSendOTP,
   teacherSetNewPassword,
   teacherLogout,
   getAllTeachers,
   getTeacherByID
};

