import { config } from 'dotenv';
config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import paymentRoutes from "./routes/payment.routes.js";
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

import userRoutes from './routes/user.routes.js';
import courseRoutes from './routes/course.routes.js';

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);

// Default catch all route - 404
app.all("/*", (req, res) => {
    res.status(404).send('Oops!! 404 Page Not Found');
});
app.use(errorMiddleware);

export default app;

