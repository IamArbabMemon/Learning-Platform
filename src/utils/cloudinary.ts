import dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

dotenv.config({
    path:'./.env'
})

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET
    
})

const uploadFile = async(localFilePath:string):Promise<string | null> =>{
      if(!localFilePath)
         return null;

        try{
        const response = await cloudinary.uploader.upload(localFilePath,{ resource_type: "auto" });
        fs.unlinkSync(localFilePath);
        return response.url;
       
         }catch(error){
            fs.unlinkSync(localFilePath);
            console.log(error)
            return null;
        }   
};

export {
    uploadFile
}
