import  express  from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";
import './config/passport';

import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(cookieParser())
app.use(express.json())
app.use(passport.initialize());


app.use('/api/auth',authRoutes)

app.get("/", (req,res)=>{
 res.send("Learning platform API is livee")
}) 

export default app;