import  express  from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";
import './config/passport.js';

import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import courseRoutes from './routes/courseRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    'https://thesisdoc.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['set-cookie', 'Authorization']
}));
app.use(cookieParser())
app.use(express.json())
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/courses', courseRoutes);

app.get("/", (req,res)=>{
 res.send("Learning platform API is livee")
}) 

export default app;