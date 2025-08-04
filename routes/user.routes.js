// File: routes/user.routes.js
import express from 'express';
import { isLoggedIn } from '../middlewares/auth.middlewares.js';
import {login, register, logout, getProfile, forgotPassword, resetPassword, changePassword, updateUser} from '../controllers/user.controller.js'; 
import upload from '../middlewares/multer.middleware.js';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router(); 

// Test route for Cloudinary
router.get('/test-cloudinary', async (req, res) => {
    try {
        const result = await cloudinary.api.ping();
        res.json({ success: true, message: 'Cloudinary connection successful', result });
    } catch (error) {
        console.error('Cloudinary test error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Cloudinary connection failed',
            error: error.message 
        });
    }
});

router.post('/register',upload.single("avatar"), register);
router.post('/login',login)
router.get('/logout',logout)
router.get('/me', isLoggedIn,getProfile)
router.post('/reset',forgotPassword)
router.post('/reset/:resetToken',resetPassword)
router.post('change-password',isLoggedIn,changePassword)
router.post('/update/:id',isLoggedIn,upload.single("avatar"),updateUser)

export default router;