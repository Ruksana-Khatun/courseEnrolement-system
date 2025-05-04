import User from "../models/user.model.js";
import ErrorApp from "../utils/error.utils.js";
const cookieOptions = {
  maxAge:7*24*60*60*1000, 
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  secure:true, 
  sameSite: 'Strict',
}


const register = async (req,res,next)=>{
    const {fullName,email,password} = req.body;
    console.log("Request Body:", req.body);
    if(!fullName || !email || !password){
        return next (new ErrorApp("Please provide all fields",400))
    }
     const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new ErrorApp('Email already exists', 400));
  }

  const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
      public_id: email,
      secure_url:'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
    },
  });
  if (!user) {
    return next(
      new AppError('User registration failed, please try again later', 400)
    );
  }
await user.save();
user.password = undefined;
const token = await user.generateJWTToken();
res.cookie('token', token, cookieOptions);
// Set password to undefined so it does not get sent in the response
res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user,
  }); 
  
}
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