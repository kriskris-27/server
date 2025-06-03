import express from 'express';
import passport from 'passport';
import { signup, login, getMe, logout } from '../controllers/authController.js';
import { generateToken } from '../utils/jwt.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticateUser, getMe);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), (req, res) => {
    const user = req.user;
    const token = generateToken({ id: user._id, role: user.role });
    res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.redirect('https://thesisdoc.vercel.app/oauth-success');
});
export default router;
//# sourceMappingURL=authRoutes.js.map