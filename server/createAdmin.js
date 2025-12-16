import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserModel from './models/user.model.js';
import connectDB from './config/connectDB.js';

dotenv.config();

async function createAdmin() {
    try {
        await connectDB();
        
        // Update test user to admin
        const updateUser = await UserModel.updateOne(
            { email: 'test@freshcorner.com' },
            { role: 'ADMIN' }
        );
        
        if (updateUser.modifiedCount > 0) {
            console.log('Admin user created successfully!');
            console.log('Email: test@freshcorner.com');
            console.log('Password: test123');
            console.log('Role: ADMIN');
        } else {
            console.log('User not found or already admin');
        }
        
        process.exit(0);
        
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();