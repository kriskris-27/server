import  express, { RequestHandler }  from 'express';
import passport from 'passport';
import { signup,login } from '../controllers/authController';
import { generateToken } from '../utils/jwt';

const router = express.Router();

router.post('/signup', signup as RequestHandler);
router.post('/login', login as RequestHandler);

router.get('/google',passport.authenticate('google',{scope:['profile','email']}));

router.get('/google/callback',passport.authenticate('google',{failureRedirect:'/login',session:false}),(req,res)=>{
    const user =  req.user as any;
    const token = generateToken({id:user._id,role:user.role});

    res.redirect(`http://localhost:5173/oauth-success?token=${token}`)
})


export default router;
