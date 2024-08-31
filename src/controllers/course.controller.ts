import courseModel from '../models/courses.model';
import { ErrorResponse } from '../utils/ErrorResponse';


const createCourse = async(req:any,res:any,next:any)=>{
    try{

        if(!(req.user.role==='Teacher'))
            throw new ErrorResponse('Unauthorized Request you must be a teacher to create course',400);

        if(!req.body)
            throw new ErrorResponse('request body is missing ',400);

         const course = await courseModel.create(req.body);
         
         return res.json({success:true,message:"Course has been created successfully"});

    }catch(err:any){
        next(err);
    }
}


export{
    createCourse
}
