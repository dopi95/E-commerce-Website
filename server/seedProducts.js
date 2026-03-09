import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProductModel from './models/product.model.js';
import { sampleProducts } from './data/sampleProducts.js';

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const count = await ProductModel.countDocuments();
    
    if (count === 0) {
      await ProductModel.insertMany(sampleProducts);
      console.log('✅ Sample products seeded successfully!');
    } else {
      console.log('⚠️ Products already exist. Skipping seed.');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedProducts();
