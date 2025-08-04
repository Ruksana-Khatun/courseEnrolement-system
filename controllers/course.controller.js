import cloudinary from "../config/cloudinary.config.js";
import fs from "fs";
import Course from "../models/course.model.js";
import ErrorApp from "../utils/error.utils.js";
import path from "path";


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
const createCourse = async (req, res,next) => {
  const { title, description,createdBy, category, thumbnail } = req.body;
  console.log("BODY:", req.body);
  if (!title || !description || !category || !createdBy || !req.file) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }
  try {
    const course = await Course.create({
      title,
      description,
      category,
      createdBy,
      thumbnail:{
        public_id: "DummyId",
        secure_url: "DummyUrl",
      },
    });
    console.log("Course created:");
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course could not be created",
      });
    }
    console.log("Course created successfully:");
  if (req.file) {
      try {
        console.log("Processing course thumbnail:", req.file);

        const filePath = path.join(req.file.destination, req.file.filename);
        const normalizedPath = filePath.replace(/\\/g, '/');

        console.log("Uploading course thumbnail to Cloudinary:", normalizedPath);

        const result = await cloudinary.uploader.upload(normalizedPath, {
          folder: "courses",
          width: 150,
          crop: "scale",
        });

        if (result) {
          course.thumbnail.public_id = result.public_id;
          course.thumbnail.secure_url = result.secure_url;

          fs.unlinkSync(normalizedPath);
          console.log("Local file deleted successfully");
        }
      } catch (uploadError) {
        console.error("Cloudinary Upload Error:", uploadError);
        return next(new ErrorApp(uploadError.message, 500));
      }
    }
  await course.save();
    res.status(200).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    return next(new ErrorApp(error.message, 500));
  }

}
console.log("Course created successfully2:");
const updateCourse = async (req, res,next) => {
  const { title, description, category, thumbnail } = req.body;
  const id = req.params.id;
  try {
    const course = await Course.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        new:true,
        runValidators: true,
      }
    );
    if (!course) {
     return next(new ErrorApp("Course with given id does not", 404));
    }
    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
    } catch (error) {
      return next(new ErrorApp(error.message, 500));
    }
}
const removeCourse = async (req, res,next) => {
  const id = req.params.id;
  try {
    const course = await Course.findById(id);
    if (!course) {
      return next(new ErrorApp("Course with given id does not exist", 404));
    }
    await course.deleteOne();
    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      course,
    });
  } catch (error) {
    return next(new ErrorApp(error.message, 500));
  }
}
const addLectureToCourseBYid = async (req, res,next) => {
  try{
    const { title, description} = req.body;
  const id = req.params.id;
  if (!title || !description) {
    return next(new ErrorApp("Please provide all required fields", 400));
  }
  const course = await Course.findById(id);
  if (!course) {
    return next(new ErrorApp("Course with given id does not exist", 404));
  }
  const lectureData = {
    title,
    description,
    lecture:{}
  }
  if (req.file) {
    try {
      const filePath = path.join(req.file.destination, req.file.filename);
      const normalizedPath = filePath.replace(/\\/g, '/');

      const result = await cloudinary.uploader.upload(normalizedPath, {
        folder: "lectures",
        resource_type: "video",
        width: 150,
        crop: "scale",
      });

      if (result) {
        lectureData.lecture.public_id = result.public_id;
        lectureData.lecture.secure_url = result.secure_url;

        fs.unlinkSync(normalizedPath);
      }
    } catch (uploadError) {
      console.error("Cloudinary Upload Error:", uploadError);
      return next(new ErrorApp(uploadError.message, 500));
    }
  }
  course.lectures.push(lectureData);
  course.numberOfLectures = course.lectures.length;
  await course.save();
  res.status(200).json({
    success: true,
    message: "Lecture added successfully",
    course,
  });

  }catch(e){
    return next(new ErrorApp(e.message, 500));
  }
  
  
}
export{
    getAllCourses,
    getLecturesCourseById,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureToCourseBYid
}