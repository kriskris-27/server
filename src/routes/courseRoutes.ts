import express from 'express';
import type { RequestHandler } from 'express';
import { getAvailableCourses, getCourse, getCourseProgress } from '../controllers/courseController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all available courses (accessible to all authenticated users)
router.get('/available', authenticateUser as RequestHandler, getAvailableCourses as RequestHandler);

// Get a specific course (accessible to all authenticated users)
router.get('/:courseId', authenticateUser as RequestHandler, getCourse as RequestHandler);

// Get course progress (accessible to all authenticated users)
router.get('/:courseId/progress', authenticateUser as RequestHandler, getCourseProgress as RequestHandler);

export default router; 