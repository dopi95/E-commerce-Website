const welcomeEmailTemplate = ({ name }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🥬 Welcome to Fresh Corner!</h1>
                <p>Your journey to fresh groceries starts here</p>
            </div>
            <div class="content">
                <h2>Hello ${name}! 👋</h2>
                <p>Welcome to <strong>Fresh Corner</strong> - your trusted partner for fresh groceries and quality food items!</p>
                
                <p>🎉 <strong>What you can do now:</strong></p>
                <ul>
                    <li>🛒 Browse our fresh products</li>
                    <li>🚚 Get 10-minute delivery</li>
                    <li>💳 Secure payment options</li>
                    <li>📱 Track your orders</li>
                </ul>
                
                <div style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL}" class="button">Start Shopping Now</a>
                </div>
                
                <p>Need help? Our support team is always ready to assist you!</p>
                <p>Happy Shopping! 🛍️</p>
            </div>
            <div class="footer">
                <p>Fresh Corner - Bringing fresh groceries to your doorstep! 🥬🍎🥕</p>
                <p>© 2024 Fresh Corner. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

export default welcomeEmailTemplate;