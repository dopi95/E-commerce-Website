import mongoose from 'mongoose';
import dotenv from 'dotenv';
import OrderModel from './models/order.model.js';
import connectDB from './config/connectDB.js';

dotenv.config();

async function removeTestOrders() {
    try {
        await connectDB();
        
        // Remove all test orders
        const result = await OrderModel.deleteMany({});
        
        console.log(`Removed ${result.deletedCount} test orders`);
        process.exit(0);
        
    } catch (error) {
        console.error('Error removing orders:', error);
        process.exit(1);
    }
}

removeTestOrders();