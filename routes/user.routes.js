
// File: routes/user.routes.js
import express from 'express';
import { register } from '../controllers/user.controller.js'; 

const router = express.Router(); 
router.post('/register', register);
router.post('/login')
router.get('/logout')
router.post('/me')
router.post('/forgot-password')
router.post('/reset-password')

export default router;