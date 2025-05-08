import User from "../models/user.model.js";
import ErrorApp from "../utils/error.utils.js";
import path from 'path';
import cloudinary from '../config/cloudinary.config.js';
import fs from 'fs';
import crypto from 'crypto';
const cookieOptions = {
  maxAge:7*24*60*60*1000, 
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  secure:true, 
  sameSite: 'Strict',
}


const register = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;
        console.log("Request Body:", req.body);

        if (!fullName || !email || !password) {
            return next(new ErrorApp("Please provide all fields", 400));
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return next(new ErrorApp('Email already exists', 400));
        }

        // Create user with default avatar
        const user = await User.create({
            fullName,
            email,
            password,
            avatar: {
                public_id: email,
                secure_url: '',
            },
        });

        if (!user) {
            return next(new ErrorApp('User registration failed, please try again later', 400));
        }

        // Handle file upload if present
        if (req.file) {
            try {
                console.log("Processing file upload:", req.file);
                
                const filePath = path.join(req.file.destination, req.file.filename);
                const normalizedPath = filePath.replace(/\\/g, '/');
                
                console.log("Uploading to Cloudinary:", normalizedPath);

                // Basic upload with minimal options
                const result = await cloudinary.uploader.upload(normalizedPath);
                console.log("Uploaded =>", result);
                console.log("Cloudinary upload result:", result);

                if (result) {
                    user.avatar.public_id = result.public_id;
                    user.avatar.secure_url = result.secure_url;
                    
                    // Delete the local file
                    fs.unlinkSync(normalizedPath);
                    console.log("Local file deleted successfully");
                    try {
                      await user.save();
                      console.log("User saved with updated avatar:", user);
                  } catch (error) {
                      console.error("Error saving user:", error);  // Log any errors during save
                  }
                  
                }
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                // Continue with default avatar
            }
        }
        user.password = undefined;
        const token = await user.generateJWTToken();
        res.cookie('token', token, cookieOptions);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user,
        });
    } catch (error) {
        console.error("Registration error:", error);
        return next(new ErrorApp(error.message || 'Registration failed', 500));
    }
};

const login = async(req,res)=>{
  try{
    const {email ,password}=req.body;
   if(!email || !password){
    return next( new ErrorApp ('All field are required',400))
   }
   const user=await User.findOne ({
      email

   }).select('+password');
   const isMatch = await user.comparePassword(password);

   if (!user || !isMatch) {
     return next(new ErrorApp('Email or password does not match', 400));
   }
   
  const token=await user.generateJWTToken();
  user.password=undefined;
  res.cookie('token',token,cookieOptions);
  res.status(200).json({
    success:true,
    message:'User logged in  successfully',
    user,
  })
  }catch(e){
    return next( new ErrorApp(e.message,500));

  }
  
}

const logout = (req,res)=>{
    res.cookie('token',null,{
      secure:true,
      maxAge:0,
      httpOnly:true
    });
    res.status(200).json({
      success:true,
      message:'User logged out successfully'
    })
    }

const getProfile = async(req,res,next)=>{
  try{
    const userId=req.user.id;
  const user=await User.findById(userId)
  if (!user) {
    return next(new ErrorApp("User not found", 404));  
  }


  res.status(200).json({
    success:true,
    message:'User details',
    user
  })
  }catch(e){
    return next(new ErrorApp('fail to fetched to profile details',500))

  }
  
}


export{
    register,
    login,
    logout,
    getProfile,
 
}