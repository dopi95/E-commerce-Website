import chapaAPI from "../config/chapa.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";
import sendEmail from '../config/sendEmail.js';
import orderConfirmationTemplate from '../utils/orderConfirmationTemplate.js';
import paymentSuccessTemplate from '../utils/paymentSuccessTemplate.js';

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

        // Send order confirmation email
        try {
            console.log('🔄 Attempting to send order confirmation email...');
            const user = await UserModel.findById(userId).populate('address_details');
            console.log('📧 Sending email to:', user.email);
            
            const address = user.address_details.find(addr => addr._id.toString() === addressId);
            
            const emailResult = await sendEmail({
                sendTo: user.email,
                subject: "Order Confirmed - Fresh Corner 🎉",
                html: orderConfirmationTemplate({
                    name: user.name,
                    orderId: generatedOrder[0].orderId,
                    items: list_items.map(item => ({
                        name: item.productId.name,
                        quantity: item.quantity,
                        price: item.productId.price
                    })),
                    totalAmount: totalAmt,
                    deliveryAddress: address ? `${address.address_line}, ${address.city}` : 'Default Address'
                })
            });
            console.log('✅ Order confirmation email sent successfully:', emailResult.messageId);
        } catch (emailError) {
            console.error('❌ Order confirmation email failed:', emailError.message);
            console.error('Full error:', emailError);
        }

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

// Multi-Bank Payment Controller (Supports Telebirr + Ethiopian Banks)
export async function multiBankPaymentController(request, response) {
    try {
        const userId = request.userId;
        const { list_items, totalAmt, addressId, subTotalAmt, phone_number, payment_method, bank_account } = request.body;

        const user = await UserModel.findById(userId);
        
        // Generate unique transaction reference based on payment method
        let tx_ref;
        if (payment_method === 'telebirr') {
            tx_ref = `TXN-${Date.now()}-${userId}`;
        } else {
            tx_ref = `BANK-${payment_method.toUpperCase()}-${Date.now()}-${userId}`;
        }
        
        const paymentData = {
            amount: totalAmt,
            currency: 'ETB',
            email: user.email,
            first_name: user.name.split(' ')[0] || 'Customer',
            last_name: user.name.split(' ')[1] || 'User',
            phone_number: phone_number,
            tx_ref: tx_ref,
            payment_method: payment_method,
            callback_url: `${process.env.BACKEND_URL}/api/order/payment/callback`,
            return_url: `${process.env.FRONTEND_URL}/payment/success`,
            customization: {
                title: 'Fresh Corner Payment',
                description: `Payment for your order via ${payment_method.toUpperCase()}`
            },
            meta: {
                userId: userId,
                addressId: addressId,
                payment_method: payment_method,
                bank_account: bank_account || null,
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
                payment_method: payment_method,
                delivery_address: addressId,
                subTotalAmt: pricewithDiscount(item.productId.price, item.productId.discount) * item.quantity,
                totalAmt: totalAmt
            }));
            
            const generatedOrder = await OrderModel.insertMany(orderPayload);
            await CartProductModel.deleteMany({ userId: userId });
            await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });
            
            // Send order confirmation and payment success emails
            try {
                const userWithAddress = await UserModel.findById(userId).populate('address_details');
                const address = userWithAddress.address_details.find(addr => addr._id.toString() === addressId);
                
                const paymentMethodName = getPaymentMethodDisplayName(payment_method);
                console.log(`🔄 Sending ${paymentMethodName} order emails...`);
                console.log('📧 Email address:', user.email);
                
                // Order confirmation email
                const orderEmail = await sendEmail({
                    sendTo: user.email,
                    subject: "Order Confirmed - Fresh Corner 🎉",
                    html: orderConfirmationTemplate({
                        name: user.name,
                        orderId: generatedOrder[0].orderId,
                        items: list_items.map(item => ({
                            name: item.productId.name,
                            quantity: item.quantity,
                            price: pricewithDiscount(item.productId.price, item.productId.discount)
                        })),
                        totalAmount: totalAmt,
                        deliveryAddress: address ? `${address.address_line}, ${address.city}` : 'Default Address'
                    })
                });
                console.log('✅ Order email sent:', orderEmail.messageId);
                
                // Payment success email
                const paymentEmail = await sendEmail({
                    sendTo: user.email,
                    subject: `Payment Successful - ${paymentMethodName} ✅`,
                    html: paymentSuccessTemplate({
                        name: user.name,
                        orderId: generatedOrder[0].orderId,
                        amount: totalAmt,
                        paymentMethod: paymentMethodName,
                        transactionId: tx_ref
                    })
                });
                console.log('✅ Payment email sent:', paymentEmail.messageId);
            } catch (emailError) {
                console.log(`${payment_method} payment emails failed:`, emailError.message);
            }
            
            return response.json({
                message: 'Payment initialized successfully',
                error: false,
                success: true,
                data: {
                    checkout_url: response_data.data.checkout_url,
                    tx_ref: tx_ref,
                    payment_method: payment_method
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

// Legacy Telebirr Payment Controller (for backward compatibility)
export async function telebirrPaymentController(request, response) {
    // Add payment_method to request body for compatibility
    request.body.payment_method = 'telebirr';
    return multiBankPaymentController(request, response);
}

// Helper function to get display name for payment methods
function getPaymentMethodDisplayName(method) {
    const displayNames = {
        'telebirr': 'Telebirr',
        'cbe': 'CBE Birr',
        'boa': 'Bank of Abyssinia',
        'dashen': 'Dashen Bank',
        'zemen': 'Zemen Bank',
        'awash': 'Awash Bank'
    };
    return displayNames[method] || method.toUpperCase();
}

// Multi-Bank Payment Callback Handler
export async function paymentCallbackController(request, response) {
    try {
        const { tx_ref, status, reference, payment_method } = request.body;
        
        if (status === 'success') {
            // Verify the payment
            const verification = await chapaAPI.verify({ tx_ref });
            
            if (verification.status === 'success' && verification.data.status === 'success') {
                const { meta } = verification.data;
                const userId = meta.userId;
                const addressId = meta.addressId;
                const items = JSON.parse(meta.items);
                const paymentMethodUsed = meta.payment_method || payment_method || 'telebirr';
                
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
                    payment_method: paymentMethodUsed,
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
                    data: {
                        orders: generatedOrder,
                        payment_method: paymentMethodUsed,
                        transaction_id: tx_ref
                    }
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

// Legacy Telebirr Callback Handler (for backward compatibility)
export async function telebirrCallbackController(request, response) {
    request.body.payment_method = 'telebirr';
    return paymentCallbackController(request, response);
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

// Verify Payment Status (All Methods)
export async function verifyPaymentStatus(request, response) {
    try {
        const { tx_ref } = request.params;
        
        const verification = await chapaAPI.verify({ tx_ref });
        
        return response.json({
            message: 'Payment status retrieved',
            error: false,
            success: true,
            data: {
                ...verification.data,
                payment_method: verification.data.payment_method || 'telebirr'
            }
        });
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Legacy Telebirr Payment Verification (for backward compatibility)
export async function verifyTelebirrPayment(request, response) {
    return verifyPaymentStatus(request, response);
}

// Get Supported Banks List
export async function getSupportedBanksController(request, response) {
    try {
        const banksData = chapaAPI.getSupportedBanks();
        
        return response.json({
            message: 'Supported banks retrieved successfully',
            error: false,
            success: true,
            data: banksData.data
        });
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
