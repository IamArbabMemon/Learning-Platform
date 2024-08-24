import { uploadFile } from '../utils/cloudinary';
import { teacherModel } from '../models/teacher.model';
import bcrypt from 'bcrypt';

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

export {registerTeacher};

