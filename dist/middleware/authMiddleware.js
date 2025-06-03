import jwt from "jsonwebtoken";
import User from "../models/User.js";
const JWT_SECRET = process.env.JWT_SECRET;
export const authenticateUser = async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        res.status(401).json({ message: 'No token provided (cookie authmiddleware X)' });
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            res.status(401).json({ message: 'Invalid Token (auth)(userX)' });
            return;
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Token verification failed(auth)' });
    }
};
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: 'Forbidden: insufficient permission' });
            return;
        }
        next();
    };
};
//# sourceMappingURL=authMiddleware.js.map