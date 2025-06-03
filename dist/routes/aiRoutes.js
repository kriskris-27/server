import express from 'express';
import { structureDoc, saveDoc, getUserDocs, getDoc, updateDoc } from '../controllers/aiController.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/structure-doc', authenticateUser, authorizeRoles('admin'), structureDoc);
router.post('/save-doc', authenticateUser, authorizeRoles('admin'), saveDoc);
router.get('/user-docs', authenticateUser, authorizeRoles('admin'), getUserDocs);
router.get('/doc/:docId', authenticateUser, authorizeRoles('admin'), getDoc);
router.put('/doc/:docId', authenticateUser, authorizeRoles('admin'), updateDoc);
export default router;
//# sourceMappingURL=aiRoutes.js.map