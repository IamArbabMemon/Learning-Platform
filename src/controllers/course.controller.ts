import { redisClient } from '../db/redisClient';
import course from '../models/courses.model';
import courseModel from '../models/courses.model';
import { ErrorResponse } from '../utils/ErrorResponse';
import { uploadVideo } from '../utils/supabaseVideoUploader';


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


       } catch (error:any) {
        next(error);
       }
             

}


const addLesson = async(req:any,res:any,next:any)=>{
    try {
        
//        const {title,content,courseID} = req.body;
        const { title, content, courseID }: { title: string; content: string; courseID: number } = req.body;

        if(!req.files.lessonVideo[0])
            throw new ErrorResponse("video file is missing",400);
  
        const course = await courseModel.findById(courseID);
        
        if(!course)
            throw new ErrorResponse("Invalid courseID , course is not found",400);



  const path = req.files.lessonVideo[0].path;
  const mimeType  =  req.files.lessonVideo[0].mimetype;
  const teacherName = req.user.username;  
  const videoName = `${teacherName}/${course.title}/${title}/${req.files.lessonVideo[0].filename}`
  const result =   await uploadVideo(videoName,mimeType,path);

  if(!result)
    throw new ErrorResponse("Failed to upload video",500);

  course.lessons.push({title,content,videoUrl:result.path}); 
  

  return res.status(200).json({message:"Lesson has been uploaded Successfully",success:true});

    } catch (error:any) {
        next(error);  
    }
}


export{
    createCourse,
    getAllCourses,
    getCourseByID,
    addLesson
}
