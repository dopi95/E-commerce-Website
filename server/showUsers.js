import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserModel from './models/user.model.js';
import connectDB from './config/connectDB.js';

dotenv.config();

async function showAllUsers() {
    try {
        await connectDB();
        
        // Get all users (excluding admins)
        const users = await UserModel.find({ role: { $ne: 'ADMIN' } }).select('name email role createdAt');
        
        console.log('=== ALL USERS (Non-Admin) ===');
        console.log(`Total Users: ${users.length}`);
        console.log('');
        
        users.forEach((user, index) => {
            console.log(`${index + 1}. Name: ${user.name}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Created: ${user.createdAt}`);
            console.log('');
        });
        
        process.exit(0);
        
    } catch (error) {
        console.error('Error fetching users:', error);
        process.exit(1);
    }
}

showAllUsers();