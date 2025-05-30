import mongoose,{Document,Schema} from "mongoose";

export interface IUser extends Document{
    email:string;
    password?:string;
    name:string;
    role:'student' | 'admin';
    googleId?:string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true 
    },
    password: { 
        type: String,
        required: function() {
            return !this.googleId; // Password required only if not using Google auth
        }
    },
    name: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['student', 'admin'], 
        default: 'student'
    },
    googleId: { 
        type: String,
        unique: true,
        sparse: true // Allows null/undefined values while maintaining uniqueness
    }
}, { 
    timestamps: true 
});

// Pre-save middleware to ensure role is 'student' for new users
// Commenting this out temporarily for first admin creation
// UserSchema.pre('save', function(next) {
//     if (this.isNew) {
//         this.role = 'student';
//     }
//     next();
// });

export default mongoose.model<IUser>('User',UserSchema);