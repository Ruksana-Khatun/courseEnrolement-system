import jwt from "jsonwebtoken";
import ErrorApp from "../utils/error.utils.js";
const isLoggedIn= async(req,res,next)=>{
    try{
        const token = req.cookies?.token;
    if(!token){
        return next(new ErrorApp('unauthenticated, please login again ',401))
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.log("JWT Error:", err.message); 
          return res.status(401).json({ success: false, message: "Invalid or expired token" });
        }
        req.user = decoded;
        next();
      }); 
    }catch{
        return next(new ErrorApp("Invalid or expired token" ,401))
    }
   
}
export {
    isLoggedIn
};