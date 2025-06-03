import { callAimLapi } from '../utils/aiml.js';
import StructuredDoc from '../models/StructuredDoc.js';
export const structureDoc = async (req, res) => {
    const { rawText } = req.body;
    if (!rawText || typeof rawText !== 'string' || rawText.trim().length < 10) {
        return res.status(400).json({
            message: 'Invalid input',
            details: 'Documentation text must be at least 10 characters long',
            timestamp: new Date().toISOString()
        });
    }
    try {
        console.log('Processing document structure request...');
        const aiResponse = await callAimLapi(rawText);
        const structuredDoc = JSON.parse(aiResponse);
        res.status(200).json({
            message: 'Document structured successfully',
            data: structuredDoc,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Document structuring error:', error);
        if (error.message.includes('not in valid JSON format')) {
            return res.status(500).json({
                message: 'Failed to structure document',
                details: 'AI response was not in the expected format',
                timestamp: new Date().toISOString()
            });
        }
        if (error.response?.status === 401) {
            return res.status(500).json({
                message: 'AI service authentication failed',
                details: 'Please check the API key configuration',
                timestamp: new Date().toISOString()
            });
        }
        if (error.response?.status === 429) {
            return res.status(429).json({
                message: 'AI service rate limit exceeded',
                details: 'Please try again in a few moments',
                timestamp: new Date().toISOString()
            });
        }
        res.status(500).json({
            message: 'Failed to structure document',
            error: error.message,
            details: error.response?.data,
            timestamp: new Date().toISOString()
        });
    }
    return;
};
export const saveDoc = async (req, res) => {
    const { structuredDoc } = req.body;
    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({
            message: 'Unauthorized',
            timestamp: new Date().toISOString()
        });
    }
    if (!structuredDoc || !structuredDoc.courseTitle || !Array.isArray(structuredDoc.modules)) {
        return res.status(400).json({
            message: 'Invalid input',
            details: 'Document structure is invalid',
            timestamp: new Date().toISOString()
        });
    }
    try {
        const doc = new StructuredDoc({
            courseTitle: structuredDoc.courseTitle,
            modules: structuredDoc.modules,
            createdBy: userId
        });
        await doc.save();
        res.status(200).json({
            message: 'Document saved successfully',
            data: doc,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Document save error:', error);
        res.status(500).json({
            message: 'Failed to save document',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
    return;
};
export const getUserDocs = async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({
            message: 'Unauthorized',
            timestamp: new Date().toISOString()
        });
    }
    try {
        const docs = await StructuredDoc.find({ createdBy: userId })
            .sort({ createdAt: -1 })
            .select('courseTitle createdAt updatedAt');
        res.status(200).json({
            message: 'Documents retrieved successfully',
            data: docs,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({
            message: 'Failed to retrieve documents',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
    return;
};
export const getDoc = async (req, res) => {
    const { docId } = req.params;
    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({
            message: 'Unauthorized',
            timestamp: new Date().toISOString()
        });
    }
    try {
        const doc = await StructuredDoc.findOne({ _id: docId, createdBy: userId });
        if (!doc) {
            return res.status(404).json({
                message: 'Document not found',
                timestamp: new Date().toISOString()
            });
        }
        res.status(200).json({
            message: 'Document retrieved successfully',
            data: doc,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Get document error:', error);
        res.status(500).json({
            message: 'Failed to retrieve document',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
    return;
};
export const updateDoc = async (req, res) => {
    const { docId } = req.params;
    const { structuredDoc } = req.body;
    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({
            message: 'Unauthorized',
            timestamp: new Date().toISOString()
        });
    }
    if (!structuredDoc || !structuredDoc.courseTitle || !Array.isArray(structuredDoc.modules)) {
        return res.status(400).json({
            message: 'Invalid input',
            details: 'Document structure is invalid',
            timestamp: new Date().toISOString()
        });
    }
    try {
        const doc = await StructuredDoc.findOne({ _id: docId, createdBy: userId });
        if (!doc) {
            return res.status(404).json({
                message: 'Document not found',
                timestamp: new Date().toISOString()
            });
        }
        doc.courseTitle = structuredDoc.courseTitle;
        doc.modules = structuredDoc.modules;
        await doc.save();
        res.status(200).json({
            message: 'Document updated successfully',
            data: doc,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Update document error:', error);
        res.status(500).json({
            message: 'Failed to update document',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
    return;
};
//# sourceMappingURL=aiController.js.map