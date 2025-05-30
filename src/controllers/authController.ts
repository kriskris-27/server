import { Request,Response } from "express";
import bcrypt from 'bcryptjs'
import User from '../models/User';
import { generateToken } from "../utils/jwt";
import { AuthRequest } from "../middleware/authMiddleware";

const SALT_ROUNDS=10;

export const signup = async(req:Request , res:Response)=>{
    const {name,email,password} = req.body;
    try{
        const existingUser=await User.findOne({email});
        if(existingUser) return res.status(400).json({message:'User already exist try loggin'});
        
        const hashedpass=await bcrypt.hash(password,SALT_ROUNDS);
        
        const user = new User({
            name,
            email,
            password:hashedpass,
            role:'student'
        })

        await user.save();
        const token=generateToken({id:user._id,role:user.role});
        res.status(201).json({token,user:{id:user._id,name:user.name,email:user.email,role:user.role}})

    }catch(err){
        res.status(500).json({message:'Server error (X sign up)'});
    }
};

export const login= async(req:Request,res:Response)=>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user || !user.password) return res.status(400).json({message:'Invalid credentials'})
        
        const isMatch =await  bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({message:'Invalid credentials'});
         const token = generateToken({id:user._id,role:user.role});
        res
  .cookie("accessToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax", // 'strict' or 'none' (CORS) as needed
    maxAge: 7 * 24 * 60 * 60 * 1000, // 15 min
  })
  .status(200)
  .json({
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }).redirect("http://localhost:5173/oauth-success");

    }
    catch(err){
        res.status(500).json({message:'Server error X login'});
    }
}

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createAdmin = async (req: AuthRequest, res: Response) => {
    try {
        // Check if the requesting user is an admin
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can create admin accounts' });
        }

        const { email, password, name } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new admin user
        const newAdmin = new User({
            email,
            password,
            name,
            role: 'admin'
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        newAdmin.password = await bcrypt.hash(password, salt);

        await newAdmin.save();

        res.status(201).json({ 
            message: 'Admin account created successfully',
            user: {
                id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
                role: newAdmin.role
            }
        });
    } catch (err) {
        console.error('Admin creation error:', err);
        res.status(500).json({ message: 'Server error during admin creation' });
    }
};


