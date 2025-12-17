import { Router } from 'express'
import auth from '../middleware/auth.js'
import { 
    CashOnDeliveryOrderController, 
    getOrderDetailsController, 
    getAllOrdersController, 
    telebirrPaymentController, 
    telebirrCallbackController, 
    verifyTelebirrPayment,
    multiBankPaymentController,
    paymentCallbackController,
    verifyPaymentStatus,
    getSupportedBanksController
} from '../controllers/order.controller.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)

// Multi-Bank Payment Routes
orderRouter.post('/payment/initialize', auth, multiBankPaymentController)
orderRouter.post('/payment/callback', paymentCallbackController)
orderRouter.get('/payment/verify/:tx_ref', verifyPaymentStatus)
orderRouter.get('/payment/banks', getSupportedBanksController)

// Legacy Telebirr Routes (for backward compatibility)
orderRouter.post('/telebirr/payment', auth, telebirrPaymentController)
orderRouter.post('/telebirr/callback', telebirrCallbackController)
orderRouter.get('/telebirr/verify/:tx_ref', verifyTelebirrPayment)
orderRouter.get("/order-list",auth,getOrderDetailsController)
orderRouter.get("/all-orders",auth,getAllOrdersController)

export default orderRouter