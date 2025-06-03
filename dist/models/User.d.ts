import mongoose, { Document } from "mongoose";
export interface IUser extends Document {
    email: string;
    password?: string;
    name: string;
    role: 'student' | 'admin';
    googleId?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
