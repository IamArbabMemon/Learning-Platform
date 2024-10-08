import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import {schema as studentRegistrationSchema} from '../schemas/studentRegisterSchema'
import { uploadFile } from '../utils/cloudinary';
import { studentModel } from '../models/student.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ErrorResponse } from "../utils/ErrorResponse";
import crypto from 'crypto'
import { sendOTPMail } from '../utils/mailer';
import { redisClient } from '../db/redisClient';
import { Queue } from 'bullmq';

// const queue = new Queue('mailQue', {
//   connection: {
//     host: 'localhost',
//     port: 6379,
//   },
// });

// async function addJobs() {
//   for (let i = 0; i < 10; i++) {
//     await queue.add('myJob', { jobData: `Job ${i}` });
//   }
// }

//addJobs();



dotenv.config({
   path:'./.env'
})

const registerStudent = async(req:any,res:any,next:any)=>{
        try{
            
          

            if(!req.body)
               return res.status(400).json({success:false,message:'request body object is null'});

            const data = req.body;     
            console.log(data);

           
           let profilePicUrl;

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
           
         
            return res.status(200).json({success:true,message:'STUDENT HAS BEEN REGISTERED SUCCESSFULLY'});

        }catch(error:any){
           console.log(error)
           return res.status(500).json({success:false,message:error.message});     
        }

}

const loginStudent = async(req:any,res:any,next:any)=>{
      try{
         
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

         const token = await jwt.sign({username,userID:user._id,role:user.role,userEmail:user.email}, process.env.JWT_SECRET_KEY);
         
         return res.cookie('token', token, {
            httpOnly: true,
        }).json({message:"Access token has been set",token, userData:{username,userID:user._id,role:user.role}});


      }catch(err:any){
         next(err);
      }
};



const studentLogout = async(req:any,res:any,next:any)=>{
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


const studentSendOTP = async(req:any,res:any,next:any)=>{
   try{

      console.log(req.body);

      //    const user = req.user;
      if(!req.body.username)
         throw new ErrorResponse('username is missing from request body',400);

      const user = await studentModel.findOne({username:req.body.username});
        
      if(!user)
         throw new ErrorResponse('user not found',400);
        
        const token = crypto.randomBytes(32).toString('hex');

      const link = `${req.protocol}://${req.get('host')}/api/v1/student/forget-password/${token}`;

         

   

      //await redisClient.set(`resetToken:${token}`, user._id.toString(), 'EX', 3600);
   //    await redisClient.set('resetToken:' + token, 'id5454', {
   //       EX: 3600, // Expiration time in seconds (1 hour)
   //   });
console.log(link)
      if(typeof user._id ==='string')
         
   await redisClient.set(`resetToken:${token}`, user._id, {
         EX: 1800, // Expiration time in seconds (1 hour)
     });


    const result = await sendOTPMail({username:user.username,email:user.email},link); //await queue.add('myJob', { jobData:{ username:user.username,email:user.email,link:link}} ); 
    console.log(result);       

     return res.json({success:true,message:"otp email has been sent successfully"});

   }catch(err){
      //console.log(err);
      next(err)
   }
}


const studentSetNewPassword = async(req:any,res:any,next:any)=>{
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

      const result = await studentModel.findByIdAndUpdate(userID,{password:hashedNewPassword});

      console.log(result);

      return res.json({success:true,message:"PASSWORD HAS BEEN UPDATED SUCCESSFULLY"});

   }catch(err){
      next(err);
   }
}

const getAllStudents = async(req:any,res:any,next:any)=>{

   try {

      if(!(req.user.role==='Teacher'))
         throw new ErrorResponse('unauthorized request',400);
      
      const allStudents = await studentModel.find().select('-password');
      return res.json({success:true,data:allStudents});

   } catch (error:any) {
      next(error);
   }
}

const getStudentByID = async(req:any,res:any,next:any)=>{

   try {
      if(!(req.user.role==='Teacher'))
         throw new ErrorResponse('unauthorized request',400);

      if(!req.params.studentID)
         throw new ErrorResponse('studentID is missing from parameters',400);

      const student = await studentModel.findById(req.params.studentID);

      return res.json({success:true,data:student});

   } catch (error:any) {
      next(error);
   }
}





export {
   registerStudent,
   loginStudent,
   studentLogout,
   studentSendOTP,
   studentSetNewPassword,
   getAllStudents,
   getStudentByID
};

