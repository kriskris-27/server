import type { Response } from 'express';
import type { AuthRequest } from '../middleware/authMiddleware.js';
export declare const getAvailableCourses: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getCourse: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getCourseProgress: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
