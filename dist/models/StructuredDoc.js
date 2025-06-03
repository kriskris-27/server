import mongoose, { Document, Schema } from 'mongoose';
const LessonSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    example: { type: String }
});
const ModuleSchema = new Schema({
    moduleTitle: { type: String, required: true },
    lessons: [LessonSchema]
});
const StructuredDocSchema = new Schema({
    courseTitle: { type: String, required: true },
    modules: [ModuleSchema],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
export default mongoose.model('StructuredDoc', StructuredDocSchema);
//# sourceMappingURL=StructuredDoc.js.map