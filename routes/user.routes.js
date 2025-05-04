
// File: routes/user.routes.js
import express from 'express';
import { isLoggedIn } from '../middlewares/auth.middlewares.js';
import {login, register, logout, getProfile} from '../controllers/user.controller.js'; 

const router = express.Router(); 
router.post('/register', register);
router.post('/login',login)
router.get('/logout',logout)
router.get('/me', isLoggedIn,getProfile)
// router.get('/forgot-password')
// router.post('/reset-password')

export default router;