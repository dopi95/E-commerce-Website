# Fresh Corner - E-Commerce Platform

A modern, full-stack e-commerce platform for fresh groceries and food items built with React.js and Node.js.

## 🚀 Features

### Customer Features
- **User Authentication**: Registration, login, email verification, password reset
- **Product Browsing**: Category-wise product display, search functionality
- **Shopping Cart**: Add/remove items, quantity management, real-time price calculation
- **Order Management**: Place orders, order history, order tracking
- **Address Management**: Multiple delivery addresses, address CRUD operations
- **Payment Integration**: Chapa/Telebirr payment gateway for Ethiopian market
- **Responsive Design**: Mobile-first design with Tailwind CSS

### Admin Features
- **Dashboard**: Comprehensive admin panel
- **Product Management**: Add, edit, delete products with image upload
- **Category Management**: Manage product categories and subcategories
- **Order Management**: View and manage customer orders
- **User Management**: View customer details and order history

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and development server
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **React Icons** - Icon library
- **Axios** - HTTP client
- **SweetAlert2** - Beautiful alerts

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage and management
- **Chapa** - Ethiopian payment gateway (Telebirr integration)
- **Resend** - Email service
- **Multer** - File upload handling

## 📁 Project Structure

```
Fresh-Corner/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── assets/        # Images and static files
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store and slices
│   │   ├── utils/         # Utility functions
│   │   ├── hooks/         # Custom React hooks
│   │   ├── layouts/       # Layout components
│   │   ├── provider/      # Context providers
│   │   └── route/         # Route configurations
│   └── package.json
└── server/                # Backend Node.js application
    ├── config/            # Database and service configurations
    ├── controllers/       # Route handlers
    ├── middleware/        # Custom middleware
    ├── models/           # MongoDB schemas
    ├── route/            # API routes
    ├── utils/            # Utility functions
    └── package.json
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Cloudinary account
- Chapa account (for Ethiopian Telebirr payments)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Fresh-Corner
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

### Environment Variables

#### Server (.env)
```env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
JWT_REFRESH_SECRET_KEY=your_refresh_secret
FRONTEND_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service (Resend)
RESEND_API=your_resend_api_key

# Payment Gateway
CHAPA_SECRET_KEY=your_chapa_secret_key
```

#### Client (.env)
```env
VITE_BACKEND_URL=http://localhost:8080

```

### Running the Application

1. **Start the server**
```bash
cd server
npm run dev
```

2. **Start the client**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:8080

## 📊 Database Models

### User Model
- Personal information (name, email, mobile)
- Authentication (password, verification status)
- Role-based access (USER, ADMIN)
- Profile management

### Product Model
- Product details (name, description, price)
- Category and subcategory relationships
- Image management
- Stock tracking
- Pricing with discount support

### Category & SubCategory Models
- Hierarchical category structure
- Image support for categories
- SEO-friendly URL generation

### Order Model
- Order tracking and status management
- Payment information
- Delivery address
- Order items with pricing history

### Cart Model
- User-specific cart items
- Quantity management
- Real-time price calculation

## 🔐 Authentication & Authorization

- **JWT-based authentication** with access and refresh tokens
- **Role-based access control** (User/Admin)
- **Email verification** for new registrations
- **Password reset** functionality with secure tokens
- **Protected routes** on both frontend and backend

## 💳 Payment Integration

### Chapa/Telebirr Integration
- Ethiopian payment gateway
- Telebirr mobile money integration
- Local payment methods for Ethiopian market
- Demo mode for testing purposes

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Components**: Hover effects, animations, loading states
- **Search Functionality**: Real-time product search
- **Infinite Scroll**: Efficient product loading
- **Toast Notifications**: User feedback for actions
- **Modal Components**: Clean popup interfaces

## 🔧 API Endpoints

### Authentication
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/user/logout` - User logout
- `POST /api/user/forgot-password` - Password reset request
- `POST /api/user/verify-forgot-password-otp` - Verify reset OTP

### Products
- `GET /api/product/get` - Get all products
- `POST /api/product/create` - Create product (Admin)
- `PUT /api/product/update` - Update product (Admin)
- `DELETE /api/product/delete` - Delete product (Admin)

### Categories
- `GET /api/category/get` - Get all categories
- `POST /api/category/create` - Create category (Admin)
- `PUT /api/category/update` - Update category (Admin)
- `DELETE /api/category/delete` - Delete category (Admin)

### Cart
- `GET /api/cart/get` - Get user cart
- `POST /api/cart/create` - Add to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/delete` - Remove from cart

### Orders
- `GET /api/order/get` - Get user orders
- `POST /api/order/create` - Create new order
- `GET /api/order/order-list` - Get all orders (Admin)

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the client application
```bash
cd client
npm run build
```
2. Deploy the `dist` folder to your hosting platform

### Backend (Heroku/Railway/Vercel)
1. Set up environment variables on your hosting platform
2. Deploy the server directory
3. Ensure MongoDB connection is configured

## 🧪 Testing

### Demo Mode
The application runs in demo mode with:
- Sample product data
- Mock payment processing
- Test user accounts

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- React.js community for excellent documentation
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible database solution
- Stripe and Chapa for payment processing solutions

## 📞 Support

For support, email [elyasyenealem@gmail.com] or create an issue in the repository.

---

**Fresh Corner** - Bringing fresh groceries to your doorstep! 🥬🍎🥕