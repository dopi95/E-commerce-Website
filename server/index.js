import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import connectDB from './config/connectDB.js'
import userRouter from './routes/user.route.js'
import categoryRouter from './routes/category.route.js'
import uploadRouter from './routes/upload.route.js'
import subCategoryRouter from './routes/subCategory.route.js'
import productRouter from './routes/product.route.js'
import cartRouter from './routes/cart.route.js'
import addressRouter from './routes/address.route.js'
import orderRouter from './routes/order.route.js'
import contactRouter from './routes/contact.route.js'
import healthRouter from './routes/health.route.js'

const app = express()
app.use(compression())
const allowedOrigins = [
    'https://freshcorner.vercel.app',
    'https://fresh-corner-backend.onrender.com',
    process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
    credentials : true,
    origin : allowedOrigins
}))
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet({
    crossOriginResourcePolicy : false
}))

const PORT = process.env.PORT || 8080 

app.get("/",(request,response)=>{
    response.json({
        message : "Server is running " + PORT
    })
})

app.use('/api/user',userRouter)
app.use("/api/category",categoryRouter)
app.use("/api/file",uploadRouter)
app.use("/api/subcategory",subCategoryRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/address",addressRouter)
app.use('/api/order',orderRouter)
app.use('/api/contact',contactRouter)
app.use('/api',healthRouter)

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("Fresh Corner Backend Server is running on port",PORT)
    })
})

