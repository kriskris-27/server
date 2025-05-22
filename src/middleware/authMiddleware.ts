import { Request,Response,NextFunction } from "express";
import  jwt  from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET =  process.env.JWT_SECRET!;

export interface AuthRequest extends Request{
    user?:any
}

export const authenticateUser=async(req:AuthRequest,res:Response,next:NextFunction)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer '))
        return res.status(401).json({message: 'No token provided (auth)'});
    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token,JWT_SECRET) as {id:string; role:string}

        const user =await User.findById(decoded.id).select('-password');
        if(!user) return res.status(401).json({message:'Invalid Token (auth)(userX)'});
        req.user=user
        next();
    }catch(err)
    {
        res.status(401).json({message:'Token verification failed(auth)'});
    }
}

export const authorizeRoles = (...roles:string[])=>{
    return (req:AuthRequest,res:Response,next:NextFunction)=>{
        if(!req.user || !roles.includes(req.user.role)){
            return res.status(403).json({message:'Forbidden: insufficient permission'});
        }
        next();
    }
}