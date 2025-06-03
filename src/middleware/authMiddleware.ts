import type { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET =  process.env.JWT_SECRET!;

export interface AuthRequest extends Request{
    user?:any
}

export const authenticateUser: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    console.log('Auth Middleware - Request cookies:', {
        cookies: req.cookies,
        headers: req.headers,
        cookieHeader: req.headers.cookie,
        url: req.url
    });

    const token = req.cookies.accessToken; 

    if (!token) {
        console.log('Auth Middleware - No token found in cookies');
        res.status(401).json({ 
            message: 'No token provided (cookie authmiddleware X)',
            debug: {
                hasCookies: !!req.cookies,
                cookieKeys: Object.keys(req.cookies),
                cookieHeader: req.headers.cookie
            }
        });
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {id: string; role: string};
        console.log('Auth Middleware - Token decoded successfully:', { id: decoded.id, role: decoded.role });
        
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            console.log('Auth Middleware - User not found for id:', decoded.id);
            res.status(401).json({message: 'Invalid Token (auth)(userX)'});
            return;
        }
        console.log('Auth Middleware - User authenticated successfully:', { id: user._id, role: user.role });
        req.user = user;
        next();
    } catch (err) {
        console.error('Auth Middleware - Token verification failed:', err);
        res.status(401).json({message: 'Token verification failed(auth)'});
    }
};

export const authorizeRoles = (...roles: string[]): RequestHandler => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: 'Forbidden: insufficient permission' });
            return;
        }
        next();
    };
};