import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'kris@admin.lms' });
        if (existingAdmin) {
            console.log('Admin account already exists');
            process.exit(0);
        }

        // Create admin user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Kris@lms', salt);

        const admin = new User({
            email: 'kris@admin.lms',
            password: hashedPassword,
            name: 'Admin Kris',
            role: 'admin'
        });

        await admin.save();
        console.log('Admin account created successfully');
        
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

createAdmin(); 