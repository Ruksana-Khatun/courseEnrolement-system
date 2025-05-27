import jwt from "jsonwebtoken";
import ErrorApp from "../utils/error.utils.js";
import User from "../models/user.model.js";
const isLoggedIn= async(req,res,next)=>{
    try{
        const token = req.cookies?.token;
    if(!token){
        return next(new ErrorApp('unauthenticated, please login again ',401))
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          console.log("JWT Error:", err.message); 
          return res.status(401).json({ success: false, message: "Invalid or expired token" });
        }
        const user = await User.findById(decoded.id); // ✅ fetch full user from DB

      if (!user) {
        return next(new ErrorApp("User not found", 401));
      }

      req.user = user; // ✅ Attach full user to request
      next();
        // req.user = decoded;
        // next();
      }); 
     
    }catch{
        return next(new ErrorApp("Invalid or expired token" ,401))
    }
   
}

 const authorizedRoles=(...roles)=> {
        return (req, res, next) => {
            const currentUserRole = req.user.role;
          if (!roles.includes(currentUserRole)) {
            return next(new ErrorApp('you do not have permission to access this route',403));
          }
          next();
        };
      };
export {
    isLoggedIn,
    authorizedRoles
};