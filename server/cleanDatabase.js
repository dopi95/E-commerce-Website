import mongoose from 'mongoose';
import dotenv from 'dotenv';
import OrderModel from './models/order.model.js';
import UserModel from './models/user.model.js';
import CartProductModel from './models/cartproduct.model.js';
import connectDB from './config/connectDB.js';

dotenv.config();

async function cleanDatabase() {
    try {
        await connectDB();
        
        // Remove all orders
        const ordersResult = await OrderModel.deleteMany({});
        console.log(`Removed ${ordersResult.deletedCount} orders`);
        
        // Remove all cart items
        const cartResult = await CartProductModel.deleteMany({});
        console.log(`Removed ${cartResult.deletedCount} cart items`);
        
        // Remove all users except admins
        const usersResult = await UserModel.deleteMany({ role: { $ne: 'ADMIN' } });
        console.log(`Removed ${usersResult.deletedCount} users (kept admins)`);
        
        console.log('Database cleaned successfully!');
        process.exit(0);
        
    } catch (error) {
        console.error('Error cleaning database:', error);
        process.exit(1);
    }
}

cleanDatabase();