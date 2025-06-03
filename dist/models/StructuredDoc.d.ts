import mongoose, { Document } from 'mongoose';
interface Lesson {
    title: string;
    content: string;
    example?: string;
}
interface Module {
    moduleTitle: string;
    lessons: Lesson[];
}
export interface IStructuredDoc extends Document {
    courseTitle: string;
    modules: Module[];
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IStructuredDoc, {}, {}, {}, mongoose.Document<unknown, {}, IStructuredDoc, {}> & IStructuredDoc & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
