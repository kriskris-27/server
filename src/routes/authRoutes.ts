import express from 'express';
import type { RequestHandler } from 'express';
import passport from 'passport';
import { signup, login, getMe, logout } from '../controllers/authController.js';
import { generateToken } from '../utils/jwt.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup as RequestHandler);
router.post('/login', login as RequestHandler);
router.post('/logout', logout as unknown as RequestHandler)

router.get('/me', authenticateUser as RequestHandler, getMe)

router.get('/google',passport.authenticate('google',{scope:['profile','email']}));

router.get('/google/callback',
    passport.authenticate('google',{failureRedirect:'/login',session:false}),
    (req,res)=>{
        const user = req.user as any;
        const token = generateToken({id:user._id,role:user.role});

        // Updated cookie settings to match login
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            domain: '.onrender.com'
        });

        res.redirect('https://thesisdoc.vercel.app/oauth-success');
    }
);


export default router;
