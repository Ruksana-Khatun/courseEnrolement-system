import { config } from 'dotenv';
config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import ErrorApp from "./utils/error.utils.js"; // custom error class
import { errorMiddleware } from "./middlewares/error.Middleware.js"; 
const app = express();
//middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());


// Third-Party
app.use(
    cors({
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(morgan("dev"));

// Server Status Check Route

app.get("/api", (req, res) => {
    res.send("API is running...");
    console.log("API is running")
});
app.post("/api/vi",(req,res)=>{
    res.send("post api is running on port well it working properly")
})
app.get("/api/v1",(req,res)=>{
    res.send("get api is running on port well it working properly")
})
// app.post("/api/v1/user/login",(req,res)=>{
//     res.send("post login api is running on port well it working properly")
//     })
// Import all routes
import userRoutes from './routes/user.routes.js';

app.use("/api/v1/user", userRoutes);

// Default catch all route - 404
app.all("/*", (req, res) => {
    res.status(404).send('Oops!! 404 Page Not Found');
});
app.use(errorMiddleware);

export default app;

