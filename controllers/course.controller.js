import Course from "../models/course.model.js";
import ErrorApp from "../utils/error.utils.js";

const getAllCourses= async (req, res,next) => {
    try{
  
           const courses = await Course.find({}).select("-lectures");
            res.status(200).json({
             success: true,
             message: "All courses fetched successfully",
             courses,
    });

    }catch(e){
        return next(new ErrorApp(e.message, 500));

    }
}


const getLecturesCourseById = async (req, res) => {
  try{
    const id = req.params.id;
    const course = await Course.findById(id)
    res.status(200).json({
        success: true,
        message: "All lectures fetched successfully",
        course,
    });

  }catch(e){
    return next(new ErrorApp(e.message, 500));
  }
 
}
export{
    getAllCourses,
    getLecturesCourseById
}