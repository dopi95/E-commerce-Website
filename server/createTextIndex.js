import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProductModel from './models/product.model.js';
import connectDB from './config/connectDB.js';

dotenv.config();

async function createTextIndex() {
    try {
        await connectDB();
        
        // Create text index for search
        await ProductModel.collection.createIndex({
            name: "text",
            description: "text"
        });
        
        console.log('Text index created successfully for product search!');
        process.exit(0);
        
    } catch (error) {
        console.error('Error creating text index:', error);
        process.exit(1);
    }
}

createTextIndex();