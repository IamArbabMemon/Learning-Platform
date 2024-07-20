import {schema as studentRegistrationSchema} from '../schemas/studentRegisterSchema'
import { uploadFile } from '../utils/cloudinary';
import { studentModel } from '../models/student.model';
import bcrypt from 'bcrypt';

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
           
           return res.status(200).json({success:false,message:'USER HAS BEEN REGISTERED SUCCESSFULLY'});

        }catch(error:any){
           console.log(error.message);
           return res.status(500).json({success:false,message:error.message});     
        }

}

export {registerStudent};

