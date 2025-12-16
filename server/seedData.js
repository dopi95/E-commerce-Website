import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CategoryModel from './models/category.model.js';
import SubCategoryModel from './models/subCategory.model.js';
import ProductModel from './models/product.model.js';
import connectDB from './config/connectDB.js';

dotenv.config();

const sampleCategories = [
    {
        name: "Fruits & Vegetables",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop"
    },
    {
        name: "Dairy & Bakery",
        image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=200&fit=crop"
    },
    {
        name: "Snacks & Beverages",
        image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&h=200&fit=crop"
    },
    {
        name: "Personal Care",
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=200&fit=crop"
    }
];

const sampleSubCategories = [
    { name: "Fresh Fruits", image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300&h=200&fit=crop" },
    { name: "Fresh Vegetables", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop" },
    { name: "Milk & Cream", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=200&fit=crop" },
    { name: "Bread & Bakery", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop" },
    { name: "Chips & Namkeen", image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=200&fit=crop" },
    { name: "Cold Drinks", image: "https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=300&h=200&fit=crop" },
    { name: "Bath & Body", image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300&h=200&fit=crop" },
    { name: "Hair Care", image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=300&h=200&fit=crop" }
];

const sampleProducts = [
    // Fruits & Vegetables
    {
        name: "Fresh Bananas",
        image: ["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop"],
        unit: "1 dozen", stock: 50, price: 40, discount: 5,
        description: "Fresh yellow bananas, rich in potassium.", more_details: { origin: "India" }
    },
    {
        name: "Red Apples",
        image: ["https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop"],
        unit: "1 kg", stock: 30, price: 120, discount: 10,
        description: "Crispy red apples, perfect for snacking.", more_details: { origin: "Kashmir" }
    },
    {
        name: "Fresh Tomatoes",
        image: ["https://images.unsplash.com/photo-1546470427-e5ac89cd0b31?w=400&h=300&fit=crop"],
        unit: "1 kg", stock: 25, price: 60, discount: 0,
        description: "Fresh red tomatoes for cooking.", more_details: { origin: "Local" }
    },
    {
        name: "Green Spinach",
        image: ["https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=300&fit=crop"],
        unit: "500g", stock: 40, price: 30, discount: 0,
        description: "Fresh green spinach leaves.", more_details: { type: "Organic" }
    },
    {
        name: "Orange Carrots",
        image: ["https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400&h=300&fit=crop"],
        unit: "1 kg", stock: 35, price: 45, discount: 8,
        description: "Fresh orange carrots.", more_details: { origin: "Local" }
    },
    {
        name: "Green Broccoli",
        image: ["https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=300&fit=crop"],
        unit: "500g", stock: 20, price: 80, discount: 12,
        description: "Fresh green broccoli.", more_details: { type: "Organic" }
    },
    
    // Dairy & Bakery
    {
        name: "Fresh Milk",
        image: ["https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop"],
        unit: "1 liter", stock: 40, price: 55, discount: 0,
        description: "Fresh full cream milk.", more_details: { fat_content: "3.5%" }
    },
    {
        name: "White Bread",
        image: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop"],
        unit: "1 loaf", stock: 20, price: 25, discount: 0,
        description: "Soft white bread.", more_details: { slices: "20" }
    },
    {
        name: "Greek Yogurt",
        image: ["https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop"],
        unit: "500g", stock: 25, price: 85, discount: 15,
        description: "Creamy Greek yogurt.", more_details: { protein: "High" }
    },
    {
        name: "Fresh Butter",
        image: ["https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=300&fit=crop"],
        unit: "200g", stock: 30, price: 120, discount: 5,
        description: "Fresh creamy butter.", more_details: { type: "Salted" }
    },
    {
        name: "Cheese Slices",
        image: ["https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400&h=300&fit=crop"],
        unit: "200g", stock: 18, price: 150, discount: 10,
        description: "Premium cheese slices.", more_details: { type: "Cheddar" }
    },
    {
        name: "Croissants",
        image: ["https://images.unsplash.com/photo-1555507036-ab794f4afe5e?w=400&h=300&fit=crop"],
        unit: "4 pieces", stock: 15, price: 95, discount: 0,
        description: "Buttery croissants.", more_details: { type: "Fresh baked" }
    },
    
    // Snacks & Beverages
    {
        name: "Potato Chips",
        image: ["https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop"],
        unit: "200g", stock: 35, price: 45, discount: 15,
        description: "Crispy salted potato chips.", more_details: { flavor: "Salted" }
    },
    {
        name: "Coca Cola",
        image: ["https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=400&h=300&fit=crop"],
        unit: "500ml", stock: 60, price: 35, discount: 0,
        description: "Refreshing cola drink.", more_details: { type: "Carbonated" }
    },
    {
        name: "Mixed Nuts",
        image: ["https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop"],
        unit: "250g", stock: 28, price: 180, discount: 20,
        description: "Premium mixed nuts.", more_details: { type: "Roasted" }
    },
    {
        name: "Orange Juice",
        image: ["https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop"],
        unit: "1 liter", stock: 22, price: 75, discount: 8,
        description: "Fresh orange juice.", more_details: { type: "100% Pure" }
    },
    {
        name: "Dark Chocolate",
        image: ["https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=300&fit=crop"],
        unit: "100g", stock: 45, price: 65, discount: 12,
        description: "Premium dark chocolate.", more_details: { cocoa: "70%" }
    },
    {
        name: "Energy Drink",
        image: ["https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop"],
        unit: "250ml", stock: 50, price: 55, discount: 0,
        description: "Energy boost drink.", more_details: { caffeine: "High" }
    },
    
    // Personal Care
    {
        name: "Shampoo",
        image: ["https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=300&fit=crop"],
        unit: "400ml", stock: 15, price: 180, discount: 20,
        description: "Gentle hair shampoo.", more_details: { hair_type: "All types" }
    },
    {
        name: "Body Soap",
        image: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop"],
        unit: "125g", stock: 40, price: 35, discount: 0,
        description: "Moisturizing body soap.", more_details: { type: "Herbal" }
    },
    {
        name: "Toothpaste",
        image: ["https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=300&fit=crop"],
        unit: "100g", stock: 32, price: 45, discount: 10,
        description: "Fluoride toothpaste.", more_details: { type: "Whitening" }
    },
    {
        name: "Face Cream",
        image: ["https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop"],
        unit: "50ml", stock: 25, price: 220, discount: 25,
        description: "Anti-aging face cream.", more_details: { skin_type: "All" }
    },
    {
        name: "Hand Sanitizer",
        image: ["https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=400&h=300&fit=crop"],
        unit: "200ml", stock: 55, price: 65, discount: 15,
        description: "Alcohol-based sanitizer.", more_details: { alcohol: "70%" }
    },
    {
        name: "Conditioner",
        image: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"],
        unit: "300ml", stock: 20, price: 160, discount: 18,
        description: "Hair conditioner.", more_details: { type: "Moisturizing" }
    },
    
    // Additional Fruits & Vegetables
    {
        name: "Green Grapes",
        image: ["https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&h=300&fit=crop"],
        unit: "500g", stock: 35, price: 90, discount: 5,
        description: "Sweet green grapes.", more_details: { type: "Seedless" }
    },
    {
        name: "Fresh Lemons",
        image: ["https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&h=300&fit=crop"],
        unit: "1 kg", stock: 40, price: 70, discount: 0,
        description: "Juicy fresh lemons.", more_details: { origin: "Local" }
    },
    {
        name: "Red Onions",
        image: ["https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop"],
        unit: "1 kg", stock: 50, price: 35, discount: 8,
        description: "Fresh red onions.", more_details: { origin: "Local" }
    },
    {
        name: "Bell Peppers",
        image: ["https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=300&fit=crop"],
        unit: "500g", stock: 25, price: 85, discount: 12,
        description: "Colorful bell peppers.", more_details: { type: "Mixed" }
    },
    
    // Additional Dairy & Bakery
    {
        name: "Fresh Eggs",
        image: ["https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop"],
        unit: "12 pieces", stock: 30, price: 65, discount: 0,
        description: "Farm fresh eggs.", more_details: { type: "Free range" }
    },
    {
        name: "Whole Wheat Bread",
        image: ["https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=300&fit=crop"],
        unit: "1 loaf", stock: 18, price: 35, discount: 0,
        description: "Healthy whole wheat bread.", more_details: { fiber: "High" }
    },
    {
        name: "Mozzarella Cheese",
        image: ["https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop"],
        unit: "250g", stock: 22, price: 180, discount: 15,
        description: "Fresh mozzarella cheese.", more_details: { type: "Italian" }
    },
    {
        name: "Paneer",
        image: ["https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop"],
        unit: "200g", stock: 20, price: 95, discount: 10,
        description: "Fresh cottage cheese.", more_details: { protein: "High" }
    },
    
    // Additional Snacks & Beverages
    {
        name: "Green Tea",
        image: ["https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop"],
        unit: "25 bags", stock: 45, price: 125, discount: 20,
        description: "Premium green tea bags.", more_details: { antioxidants: "High" }
    },
    {
        name: "Cookies",
        image: ["https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop"],
        unit: "200g", stock: 35, price: 55, discount: 0,
        description: "Chocolate chip cookies.", more_details: { type: "Crispy" }
    },
    {
        name: "Mineral Water",
        image: ["https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop"],
        unit: "1 liter", stock: 60, price: 20, discount: 0,
        description: "Pure mineral water.", more_details: { minerals: "Natural" }
    },
    {
        name: "Instant Coffee",
        image: ["https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=300&fit=crop"],
        unit: "100g", stock: 28, price: 145, discount: 18,
        description: "Premium instant coffee.", more_details: { roast: "Medium" }
    },
    
    // Additional Personal Care
    {
        name: "Body Lotion",
        image: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop"],
        unit: "200ml", stock: 30, price: 185, discount: 22,
        description: "Moisturizing body lotion.", more_details: { skin_type: "Dry" }
    },
    {
        name: "Deodorant",
        image: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"],
        unit: "150ml", stock: 25, price: 95, discount: 12,
        description: "Long-lasting deodorant.", more_details: { protection: "24hr" }
    },
    {
        name: "Face Wash",
        image: ["https://images.unsplash.com/photo-1556228578-dd6e4aaad34c?w=400&h=300&fit=crop"],
        unit: "100ml", stock: 35, price: 75, discount: 8,
        description: "Gentle face wash.", more_details: { skin_type: "All" }
    },
    {
        name: "Hair Oil",
        image: ["https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&h=300&fit=crop"],
        unit: "200ml", stock: 22, price: 120, discount: 15,
        description: "Nourishing hair oil.", more_details: { type: "Coconut" }
    }
];

async function seedDatabase() {
    try {
        await connectDB();
        
        // Clear existing data
        await CategoryModel.deleteMany({});
        await SubCategoryModel.deleteMany({});
        await ProductModel.deleteMany({});
        
        console.log("Cleared existing data");
        
        // Insert categories
        const categories = await CategoryModel.insertMany(sampleCategories);
        console.log("Categories inserted:", categories.length);
        
        // Insert subcategories with category references
        const subcategoriesWithRefs = sampleSubCategories.map((subcat, index) => ({
            ...subcat,
            category: [categories[Math.floor(index / 2)]._id]
        }));
        
        const subcategories = await SubCategoryModel.insertMany(subcategoriesWithRefs);
        console.log("Subcategories inserted:", subcategories.length);
        
        // Insert products with category and subcategory references
        const productsWithRefs = sampleProducts.map((product, index) => ({
            ...product,
            category: [categories[Math.floor(index / 10)]._id],
            subCategory: [subcategories[Math.floor(index / 5)]._id]
        }));
        
        const products = await ProductModel.insertMany(productsWithRefs);
        console.log("Products inserted:", products.length);
        
        console.log("Database seeded successfully!");
        process.exit(0);
        
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}

seedDatabase();