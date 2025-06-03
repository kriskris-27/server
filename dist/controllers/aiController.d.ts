import type { Response } from 'express';
import type { AuthRequest } from '../middleware/authMiddleware.js';
export declare const structureDoc: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const saveDoc: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getUserDocs: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getDoc: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateDoc: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
