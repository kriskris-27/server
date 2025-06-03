import express from 'express';
import { getAvailableCourses, getCourse, getCourseProgress } from '../controllers/courseController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
const router = express.Router();
router.get('/available', authenticateUser, getAvailableCourses);
router.get('/:courseId', authenticateUser, getCourse);
router.get('/:courseId/progress', authenticateUser, getCourseProgress);
export default router;
//# sourceMappingURL=courseRoutes.js.map