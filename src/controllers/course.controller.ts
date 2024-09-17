import { redisClient } from '../db/redisClient';
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

const getCourseByID = async(req:any,res:any,next:any)=>{

       try {
        const {courseID} = req.query;
        
        console.log(courseID);

        if(!courseID)
            throw new ErrorResponse('course id is missing from query parameters',400);

        let getFromCache = await redisClient.get(courseID);
        
        if(getFromCache){
            
            return res.status(200).json(JSON.parse(getFromCache));
        }


        console.log('after');
        const getFromDB = await courseModel.findById(courseID);
    
        if(!getFromDB)
            throw new ErrorResponse('Invalid ID course not found',400);

        await redisClient.set(courseID,JSON.stringify(getFromDB));
        return res.status(200).json(getFromDB);

       

        // course = await courseModel.findById(courseID); // if result is not found in redis then look in database

        // if(course){ // if course found in database note : just to make a check that given id is correct
        
        // await redisClient.set(courseID,course);
        //    return res.status(200).json(course);      
        
        // }else{
        //     throw new ErrorResponse('Invalid course ID . Course not found',400);
        // }


//66e9631e74 34 32 d91 d42 43 10

        // const data = await courseModel.findById(courseID);
        // return res.json(data);

       } catch (error:any) {
        next(error);
       }
             

}



export{
    createCourse,
    getAllCourses,
    getCourseByID
}
