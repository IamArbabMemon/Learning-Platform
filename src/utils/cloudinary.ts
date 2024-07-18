import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

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
