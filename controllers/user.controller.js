import User from "../models/user.model.js";
import ErrorApp from "../utils/error.utils.js";
const register = async (error,req,res,next)=>{
    const {fullname,email,password} = req.body;
    if(!fullname || !email || !password){
        return next (new ErrorApp("Please provide all fields",400))
    }
     const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new AppError('Email already exists', 400));
  }

  const user = await User.create({
    fullname,
    email,
    password,
    avatar: {
      public_id: email,
      secure_url:'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
    },
  });

  // If user not created send message response
  if (!user) {
    return next(
      new AppError('User registration failed, please try again later', 400)
    );
  }
await user.save();
user.password = undefined;
const token = await user.generateJWTToken();
// Set password to undefined so it does not get sent in the response
res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user,
  }); 
  // Run only if user sends a file
  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'lms', // Save files in a folder named lms
        width: 250,
        height: 250,
        gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
        crop: 'fill',
      });

      // If success
      if (result) {
        // Set the public_id and secure_url in DB
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        // After successful upload remove the file from local storage
        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(
        new AppError(error || 'File not uploaded, please try again', 400)
      );
    }
  }

  // Save the user object
  await user.save();

  // Generating a JWT token
  token = await user.generateJWTToken();

  // Setting the password to undefined so it does not get sent in the response
  user.password = undefined;

  // Setting the token in the cookie with name token along with cookieOptions
  res.cookie('token', token, cookieOptions);

  // If all good send the response to the frontend
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user,
  });
};

const login = (req,res)=>{

}

const logout = (req,res)=>{
    
    }

const getProfile = (req,res)=>{
}


export{
    register,
    login,
    logout,
    getProfile,
 
}