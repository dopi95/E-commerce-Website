import Stripe from "../config/stripe.js";
import chapaAPI from "../config/chapa.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";

 export async function CashOnDeliveryOrderController(request,response){
    try {
        const userId = request.userId // auth middleware 
        const { list_items, totalAmt, addressId,subTotalAmt } = request.body 

        const payload = list_items.map(el => {
            return({
                userId : userId,
                orderId : `ORD-${new mongoose.Types.ObjectId()}`,
                productId : el.productId._id, 
                product_details : {
                    name : el.productId.name,
                    image : el.productId.image
                } ,
                paymentId : "",
                payment_status : "CASH ON DELIVERY",
                delivery_address : addressId ,
                subTotalAmt  : subTotalAmt,
                totalAmt  :  totalAmt,
            })
        })

        const generatedOrder = await OrderModel.insertMany(payload)

        ///remove from the cart
        const removeCartItems = await CartProductModel.deleteMany({ userId : userId })
        const updateInUser = await UserModel.updateOne({ _id : userId }, { shopping_cart : []})

        return response.json({
            message : "Order successfully",
            error : false,
            success : true,
            data : generatedOrder
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error ,
            error : true,
            success : false
        })
    }
}

export const pricewithDiscount = (price,dis = 1)=>{
    const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}

export async function paymentController(request,response){
    try {
        const userId = request.userId // auth middleware 
        const { list_items, totalAmt, addressId,subTotalAmt } = request.body 

        const user = await UserModel.findById(userId)

        const line_items  = list_items.map(item =>{
            return{
               price_data : {
                    currency : 'inr',
                    product_data : {
                        name : item.productId.name,
                        images : item.productId.image,
                        metadata : {
                            productId : item.productId._id
                        }
                    },
                    unit_amount : pricewithDiscount(item.productId.price,item.productId.discount) * 100   
               },
               adjustable_quantity : {
                    enabled : true,
                    minimum : 1
               },
               quantity : item.quantity 
            }
        })

        const params = {
            submit_type : 'pay',
            mode : 'payment',
            payment_method_types : ['card'],
            customer_email : user.email,
            metadata : {
                userId : userId,
                addressId : addressId
            },
            line_items : line_items,
            success_url : `${process.env.FRONTEND_URL}/success`,
            cancel_url : `${process.env.FRONTEND_URL}/cancel`
        }

        const session = await Stripe.checkout.sessions.create(params)

        return response.status(200).json(session)

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


const getOrderProductItems = async({
    lineItems,
    userId,
    addressId,
    paymentId,
    payment_status,
 })=>{
    const productList = []

    if(lineItems?.data?.length){
        for(const item of lineItems.data){
            const product = await Stripe.products.retrieve(item.price.product)

            const paylod = {
                userId : userId,
                orderId : `ORD-${new mongoose.Types.ObjectId()}`,
                productId : product.metadata.productId, 
                product_details : {
                    name : product.name,
                    image : product.images
                } ,
                paymentId : paymentId,
                payment_status : payment_status,
                delivery_address : addressId,
                subTotalAmt  : Number(item.amount_total / 100),
                totalAmt  :  Number(item.amount_total / 100),
            }

            productList.push(paylod)
        }
    }

    return productList
}

//http://localhost:8080/api/order/webhook
export async function webhookStripe(request,response){
    const event = request.body;
    const endPointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY

    console.log("event",event)

    // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
      const userId = session.metadata.userId
      const orderProduct = await getOrderProductItems(
        {
            lineItems : lineItems,
            userId : userId,
            addressId : session.metadata.addressId,
            paymentId  : session.payment_intent,
            payment_status : session.payment_status,
        })
    
      const order = await OrderModel.insertMany(orderProduct)

        console.log(order)
        if(Boolean(order[0])){
            const removeCartItems = await  UserModel.findByIdAndUpdate(userId,{
                shopping_cart : []
            })
            const removeCartProductDB = await CartProductModel.deleteMany({ userId : userId})
        }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
}


export async function getOrderDetailsController(request,response){
    try {
        const userId = request.userId // order id

        const orderlist = await OrderModel.find({ userId : userId }).sort({ createdAt : -1 }).populate('delivery_address')

        return response.json({
            message : "order list",
            data : orderlist,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export async function getAllOrdersController(request,response){
    try {
        const orderlist = await OrderModel.find({}).sort({ createdAt : -1 }).populate('userId', 'name email').populate('delivery_address')

        return response.json({
            message : "all orders list",
            data : orderlist,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

// Telebirr Payment Controller
export async function telebirrPaymentController(request, response) {
    try {
        const userId = request.userId;
        const { list_items, totalAmt, addressId, subTotalAmt, phone_number } = request.body;

        const user = await UserModel.findById(userId);
        
        // Generate unique transaction reference
        const tx_ref = `TXN-${Date.now()}-${userId}`;
        
        const paymentData = {
            amount: totalAmt,
            currency: 'ETB',
            email: user.email,
            first_name: user.name.split(' ')[0] || 'Customer',
            last_name: user.name.split(' ')[1] || 'User',
            phone_number: phone_number,
            tx_ref: tx_ref,
            callback_url: `${process.env.BACKEND_URL}/api/order/telebirr/callback`,
            return_url: `${process.env.FRONTEND_URL}/payment/success`,
            customization: {
                title: 'Fresh Corner Payment',
                description: 'Payment for your order'
            },
            meta: {
                userId: userId,
                addressId: addressId,
                items: JSON.stringify(list_items.map(item => ({
                    productId: item.productId._id,
                    name: item.productId.name,
                    quantity: item.quantity,
                    price: pricewithDiscount(item.productId.price, item.productId.discount)
                })))
            }
        };

        const response_data = await chapaAPI.initialize(paymentData);
        
        if (response_data.status === 'success') {
            // For demo: Create order and clear cart immediately
            const orderPayload = list_items.map(item => ({
                userId: userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                productId: item.productId._id,
                product_details: {
                    name: item.productId.name,
                    image: item.productId.image
                },
                paymentId: `REF-${Date.now()}`,
                payment_status: 'PAID',
                delivery_address: addressId,
                subTotalAmt: pricewithDiscount(item.productId.price, item.productId.discount) * item.quantity,
                totalAmt: totalAmt
            }));
            
            await OrderModel.insertMany(orderPayload);
            await CartProductModel.deleteMany({ userId: userId });
            await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });
            
            return response.json({
                message: 'Payment initialized successfully',
                error: false,
                success: true,
                data: {
                    checkout_url: response_data.data.checkout_url,
                    tx_ref: tx_ref
                }
            });
        } else {
            throw new Error('Failed to initialize payment');
        }

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Telebirr Payment Callback Handler
export async function telebirrCallbackController(request, response) {
    try {
        const { tx_ref, status, reference } = request.body;
        
        if (status === 'success') {
            // Verify the payment
            const verification = await chapaAPI.verify({ tx_ref });
            
            if (verification.status === 'success' && verification.data.status === 'success') {
                const { meta } = verification.data;
                const userId = meta.userId;
                const addressId = meta.addressId;
                const items = JSON.parse(meta.items);
                
                // Create order records
                const orderPayload = items.map(item => ({
                    userId: userId,
                    orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                    productId: item.productId,
                    product_details: {
                        name: item.name,
                        image: []
                    },
                    paymentId: reference || verification.data.reference,
                    payment_status: 'PAID',
                    delivery_address: addressId,
                    subTotalAmt: item.price * item.quantity,
                    totalAmt: verification.data.amount
                }));
                
                const generatedOrder = await OrderModel.insertMany(orderPayload);
                
                // Clear cart
                await CartProductModel.deleteMany({ userId: userId });
                await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });
                
                return response.json({
                    message: 'Payment verified and order created',
                    error: false,
                    success: true,
                    data: generatedOrder
                });
            }
        }
        
        return response.status(400).json({
            message: 'Payment verification failed',
            error: true,
            success: false
        });
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Handle demo payment completion
export async function handleDemoPaymentCompletion(userId, addressId, cartItems, totalAmount, tx_ref) {
    try {
        // Create order records
        const orderPayload = cartItems.map(item => ({
            userId: userId,
            orderId: `ORD-${new mongoose.Types.ObjectId()}`,
            productId: item.productId._id,
            product_details: {
                name: item.productId.name,
                image: item.productId.image
            },
            paymentId: `REF-${Date.now()}`,
            payment_status: 'PAID',
            delivery_address: addressId,
            subTotalAmt: pricewithDiscount(item.productId.price, item.productId.discount) * item.quantity,
            totalAmt: totalAmount
        }));
        
        const generatedOrder = await OrderModel.insertMany(orderPayload);
        
        // Clear cart
        await CartProductModel.deleteMany({ userId: userId });
        await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });
        
        return generatedOrder;
    } catch (error) {
        throw error;
    }
}

// Verify Telebirr Payment Status
export async function verifyTelebirrPayment(request, response) {
    try {
        const { tx_ref } = request.params;
        
        const verification = await chapaAPI.verify({ tx_ref });
        
        return response.json({
            message: 'Payment status retrieved',
            error: false,
            success: true,
            data: verification.data
        });
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
