import dotenv from 'dotenv';
dotenv.config();
import app from "./app.js";
import connectionToDB from "./config/dbConection.js";
import cloudinary from './config/cloudinary.config.js';
import Razorpay from 'razorpay';

const PORT = process.env.PORT || 5000;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});
export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
})

const startServer = async () => {
    try {
     
        await connectionToDB();
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running in mode on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};
console.log("Server is running on port 5000")
startServer();

