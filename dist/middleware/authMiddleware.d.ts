import type { Request, RequestHandler } from "express";
export interface AuthRequest extends Request {
    user?: any;
}
export declare const authenticateUser: RequestHandler;
export declare const authorizeRoles: (...roles: string[]) => RequestHandler;
