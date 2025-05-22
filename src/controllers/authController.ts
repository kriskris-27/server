import { Request,Response } from "express";
import bcrypt from 'bcryptjs'
import User from '../models/User';
import { generateToken } from "../utils/jwt";

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
        res.status(200).json({token,user:{id:user._id,name:user.name,email:user.email,role:user.role}})
    }
    catch(err){
        res.status(500).json({message:'Server error X login'});
    }
}

