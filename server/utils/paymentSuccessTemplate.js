const paymentSuccessTemplate = ({ name, orderId, amount, paymentMethod, transactionId }) => {
    // Format amount in ETB
    const formatETB = (price) => {
        return new Intl.NumberFormat('en-ET', {
            style: 'currency',
            currency: 'ETB'
        }).format(price);
    };

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .success-box { background: #d1fae5; border: 2px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .payment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .amount { font-size: 24px; color: #059669; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Payment Successful!</h1>
                <p>Your payment has been processed</p>
            </div>
            <div class="content">
                <div class="success-box">
                    <h2>🎉 Payment Confirmed!</h2>
                    <p class="amount">${formatETB(amount)}</p>
                    <p>Your payment was successful</p>
                </div>

                <h2>Hello ${name}!</h2>
                <p>Great news! Your payment has been successfully processed and your order is confirmed.</p>
                
                <div class="payment-details">
                    <h3>💳 Payment Details</h3>
                    <p><strong>Order ID:</strong> #${orderId}</p>
                    <p><strong>Transaction ID:</strong> ${transactionId}</p>
                    <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                    <p><strong>Amount Paid:</strong> ${formatETB(amount)}</p>
                    <p><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">✅ Successful</span></p>
                </div>

                <p>🚚 <strong>What happens next?</strong></p>
                <ul>
                    <li>Your order is now being prepared</li>
                    <li>You'll receive delivery updates</li>
                    <li>Expected delivery: Within 10 minutes</li>
                    <li>Keep this email as your payment receipt</li>
                </ul>

                <p>Thank you for your payment and for choosing Fresh Corner! 🛒</p>
            </div>
            <div class="footer">
                <p>Fresh Corner - Secure & Fast Payments! 💳⚡</p>
                <p>© 2024 Fresh Corner. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

export default paymentSuccessTemplate;