import sendEmail from "../utils/sendEmail.js";
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
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  
  if (!email) {
    return next(new ErrorApp('Email is required', 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorApp('User not registered', 404));
  }

 const resetToken = await user.generatePasswordResetToken(); 
  await user.save();
  console.log("Raw reset token sent to user:", resetToken);
  const resetPasswordURL = `${process.env.FRONTEND_URL}/password-reset/${resetToken}`;
    console.log("Reset Password URL:", resetPasswordURL);
    
  try {
    await sendEmail({
      email,
      subject: 'Password reset link',
      message: `Your password reset link is : ${resetPasswordURL}`
    });

    res.status(200).json({
      success: true,
      message: `Reset password token has been sent to ${email} successfully`,
    });
  } catch (e) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiryDate = undefined;
    await user.save();
    console.error('Error sending email:', e);
    return next(new ErrorApp('Email could not be sent', 500));
  }
};

const resetPassword =async (req, res,next) => {
  console.log("🔥 Hit resetPassword route");
  const {resetToken } = req.params;
  const { password } = req.body;
    console.log("Received token:", resetToken);
  console.log("Received password:", password);
    if (!resetToken || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
console.log("🔐 Hashed token from request:", hashedToken);

    const user = await User.findOne({
      forgotPasswordToken: hashedToken,
      forgotPasswordExpiryDate: { $gt: Date.now() },
    });
    
  if (!user) {
      
    return next(new ErrorApp('Token is invalid or has expired please try again', 400));
  }
  console.log("Hashed token saved in DB:", user.forgotPasswordToken);
  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiryDate = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successfully',
  });

}
const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!oldPassword || !newPassword) {
    return next(new ErrorApp('All fields are required', 400));
  }

  const user = await User.findById(userId).select('password');
  if (!user) {
    return next(new ErrorApp('User  does not  exist', 404));
  }

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    return next(new ErrorApp('invalid old password', 400));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
}
const updateUser = async (req, res, next) => {
  const { fullName } = req.body;
  const userId = req.user.id;

  if (!fullName) {
    return next(new ErrorApp('All fields are required', 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorApp('User  does not exists', 404));
  }

if (fullName) {
  user.fullName = fullName;
}

  // Handle file upload if present
  if (req.file) {
     if (user.avatar && user.avatar.public_id) {
      try {
        // Attempt to delete the avatar from Cloudinary
        await cloudinary.uploader.destroy(user.avatar.public_id);
        console.log("Cloudinary public_id deleted:", user.avatar.public_id);
      } catch (deleteError) {
        console.error("Error deleting from Cloudinary:", deleteError);
        return next(new ErrorApp('Error deleting previous avatar from Cloudinary', 500));
      }
    }
    try {
      const filePath = path.join(req.file.destination, req.file.filename);
      const normalizedPath = filePath.replace(/\\/g, '/');

      const result = await cloudinary.uploader.upload(normalizedPath);
      console.log("Cloudinary upload result:", result);

      if (result) {
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        // Delete the local file
        fs.unlinkSync(normalizedPath);
        console.log("Local file deleted successfully");
      }
    } catch (uploadError) {
      console.error("Cloudinary Upload Error:", uploadError);
    }
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    user,
  });
};
 


export{
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    updateUser
 
}