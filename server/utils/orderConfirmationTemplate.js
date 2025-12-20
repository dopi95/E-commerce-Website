const orderConfirmationTemplate = ({ name, orderId, items, totalAmount, deliveryAddress }) => {
    // Format amount in ETB
    const formatETB = (price) => {
        return new Intl.NumberFormat('en-ET', {
            style: 'currency',
            currency: 'ETB'
        }).format(price);
    };

    const itemsHtml = items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatETB(item.price)}</td>
        </tr>
    `).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .order-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
            .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .table th { background: #10b981; color: white; padding: 12px; text-align: left; }
            .total { background: #10b981; color: white; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Order Confirmed!</h1>
                <p>Thank you for your order</p>
            </div>
            <div class="content">
                <h2>Hello ${name}!</h2>
                <p>Great news! Your order has been confirmed and is being prepared for delivery.</p>
                
                <div class="order-box">
                    <h3>📋 Order Details</h3>
                    <p><strong>Order ID:</strong> #${orderId}</p>
                    <p><strong>Delivery Time:</strong> 10 minutes ⚡</p>
                    <p><strong>Delivery Address:</strong> ${deliveryAddress}</p>
                </div>

                <table class="table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th style="text-align: center;">Quantity</th>
                            <th style="text-align: right;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                        <tr class="total">
                            <td colspan="2" style="padding: 15px; text-align: right;"><strong>Total Amount:</strong></td>
                            <td style="padding: 15px; text-align: right;"><strong>${formatETB(totalAmount)}</strong></td>
                        </tr>
                    </tbody>
                </table>

                <p>🚚 <strong>What's next?</strong></p>
                <ul>
                    <li>Your order is being prepared</li>
                    <li>You'll receive delivery updates via SMS/Email</li>
                    <li>Expected delivery: Within 10 minutes</li>
                </ul>

                <p>Thank you for choosing Fresh Corner! 🥬</p>
            </div>
            <div class="footer">
                <p>Fresh Corner - 10 Minute Delivery Guaranteed! 🚚💨</p>
                <p>© 2024 Fresh Corner. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

export default orderConfirmationTemplate;