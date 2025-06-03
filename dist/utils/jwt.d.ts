import jwt from 'jsonwebtoken';
export declare const generateToken: (payload: object, expiresIn?: string) => string;
export declare const verifyToken: (token: string) => string | jwt.JwtPayload | null;
