import express, { RequestHandler } from 'express';
import { structureDoc, saveDoc, getUserDocs, getDoc, updateDoc } from '../controllers/aiController.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/structure-doc', authenticateUser, authorizeRoles('admin'), structureDoc as RequestHandler);
router.post('/save-doc', authenticateUser, authorizeRoles('admin'), saveDoc as RequestHandler);
router.get('/user-docs', authenticateUser, authorizeRoles('admin'), getUserDocs as RequestHandler);
router.get('/doc/:docId', authenticateUser, authorizeRoles('admin'), getDoc as RequestHandler);
router.put('/doc/:docId', authenticateUser, authorizeRoles('admin'), updateDoc as RequestHandler);

export default router;
