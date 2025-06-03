import StructuredDoc from '../models/StructuredDoc.js';
export const getAvailableCourses = async (req, res) => {
    try {
        const courses = await StructuredDoc.find()
            .select('courseTitle createdAt updatedAt')
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json({
            message: 'Courses retrieved successfully',
            data: courses,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({
            message: 'Failed to retrieve courses',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};
export const getCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
        const course = await StructuredDoc.findById(courseId)
            .select('-__v')
            .lean();
        if (!course) {
            return res.status(404).json({
                message: 'Course not found',
                timestamp: new Date().toISOString()
            });
        }
        res.status(200).json({
            message: 'Course retrieved successfully',
            data: course,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Get course error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid course ID',
                timestamp: new Date().toISOString()
            });
        }
        res.status(500).json({
            message: 'Failed to retrieve course',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
    return;
};
export const getCourseProgress = async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({
            message: 'Unauthorized',
            timestamp: new Date().toISOString()
        });
    }
    try {
        res.status(200).json({
            message: 'Course progress retrieved successfully',
            data: {
                courseId,
                userId,
                lastAccessedModule: 0,
                lastAccessedLesson: 0,
                completedLessons: [],
                progress: 0
            },
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Get course progress error:', error);
        res.status(500).json({
            message: 'Failed to retrieve course progress',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
    return;
};
//# sourceMappingURL=courseController.js.map