import course from '../models/courses.model';
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

const getAllCourses = async(req:any,res:any,next:any)=>{
    try {
        
        // const allCourses = await courseModel.find().populate({
        //        path:'teacher',
        //        select:'firstName lastName bio profilePictureUrl' 
        // });

        const allCourses = await courseModel.aggregate([{
        
        $lookup:{
            from:'teachers',
            localField:'teacher',
            foreignField:'_id',
            as:'myTeacher'
        }
},

    {
        $project:{
            title:1,
            description:1,
            lessons:1,
            level:1,
            category:1,
            price:1,
            "myTeacher.firstName":1,
            "myTeacher.lastName":1,
            "myTeacher.email":1,

        }
    }

        ]);



        return res.status(200).json(allCourses);


    } catch (error:any) {
        next(error);
    }
}


export{
    createCourse,
    getAllCourses
}
