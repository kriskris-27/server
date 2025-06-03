import mongoose, { Document, Schema } from "mongoose";
const UserSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    name: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    googleId: { type: String },
}, { timestamps: true });
export default mongoose.model('User', UserSchema);
//# sourceMappingURL=User.js.map