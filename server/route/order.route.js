import { Router } from 'express'
import auth from '../middleware/auth.js'
import { CashOnDeliveryOrderController, getOrderDetailsController, getAllOrdersController, paymentController, webhookStripe, telebirrPaymentController, telebirrCallbackController, verifyTelebirrPayment } from '../controllers/order.controller.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.post('/checkout',auth,paymentController)
orderRouter.post('/webhook',webhookStripe)
orderRouter.post('/telebirr/payment',auth,telebirrPaymentController)
orderRouter.post('/telebirr/callback',telebirrCallbackController)
orderRouter.get('/telebirr/verify/:tx_ref',verifyTelebirrPayment)
orderRouter.get("/order-list",auth,getOrderDetailsController)
orderRouter.get("/all-orders",auth,getAllOrdersController)

export default orderRouter