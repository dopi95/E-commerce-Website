import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import UserModel from './models/user.model.js';
import connectDB from './config/connectDB.js';

dotenv.config();

async function createTestUser() {
    try {
        await connectDB();
        
        // Check if test user already exists
        const existingUser = await UserModel.findOne({ email: 'test@freshcorner.com' });
        
        if (existingUser) {
            console.log('Test user already exists!');
            console.log('Email: test@freshcorner.com');
            console.log('Password: test123');
            process.exit(0);
        }
        
        // Create test user
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash('test123', salt);
        
        const testUser = new UserModel({
            name: 'Test User',
            email: 'test@freshcorner.com',
            password: hashPassword,
            verify_email: true,
            role: 'USER'
        });
        
        await testUser.save();
        
        console.log('Test user created successfully!');
        console.log('Email: test@freshcorner.com');
        console.log('Password: test123');
        
        process.exit(0);
        
    } catch (error) {
        console.error('Error creating test user:', error);
        process.exit(1);
    }
}

createTestUser();