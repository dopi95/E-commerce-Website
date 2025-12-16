import mongoose from 'mongoose';
import dotenv from 'dotenv';
import OrderModel from './models/order.model.js';
import UserModel from './models/user.model.js';
import connectDB from './config/connectDB.js';

dotenv.config();

async function showAllOrders() {
    try {
        await connectDB();
        
        // Get all orders with user details
        const orders = await OrderModel.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
        
        console.log('=== ALL ORDERS ===');
        console.log(`Total Orders: ${orders.length}`);
        console.log('');
        
        if (orders.length === 0) {
            console.log('No orders found in database.');
        } else {
            orders.forEach((order, index) => {
                console.log(`${index + 1}. Order ID: ${order._id}`);
                console.log(`   Customer: ${order.userId?.name || 'Unknown'}`);
                console.log(`   Email: ${order.userId?.email || 'No email'}`);
                console.log(`   Product: ${order.product_details?.name || 'Unknown product'}`);
                console.log(`   Amount: $${order.totalAmt || 0}`);
                console.log(`   Payment: ${order.payment_status || 'Unknown'}`);
                console.log(`   Date: ${order.createdAt}`);
                console.log('');
            });
        }
        
        process.exit(0);
        
    } catch (error) {
        console.error('Error fetching orders:', error);
        process.exit(1);
    }
}

showAllOrders();