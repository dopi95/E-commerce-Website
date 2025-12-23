const verifyEmailTemplate = ({ name, otp }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: #d1fae5; border: 2px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .otp-code { font-size: 32px; font-weight: bold; color: #059669; letter-spacing: 8px; margin: 15px 0; }
            .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 Verify Your Email</h1>
                <p>Complete your Fresh Corner registration</p>
            </div>
            <div class="content">
                <div class="otp-box">
                    <h2>✉️ Email Verification Code</h2>
                    <p>Enter this code to verify your email address:</p>
                    <div class="otp-code">${otp}</div>
                </div>

                <h2>Hello ${name}!</h2>
                <p>Thank you for registering with <strong>Fresh Corner</strong> - your trusted partner for fresh groceries!</p>
                
                <p>To complete your registration and start shopping, please enter the verification code above in the app.</p>
                
                <div class="warning">
                    <p><strong>⚠️ Important:</strong></p>
                    <ul>
                        <li>This verification code will expire in 15 minutes</li>
                        <li>If you didn't create this account, please ignore this email</li>
                        <li>For security, don't share this code with anyone</li>
                    </ul>
                </div>

                <p>🎉 <strong>Once verified, you can:</strong></p>
                <ul>
                    <li>🛍️ Browse our fresh products</li>
                    <li>🚚 Get 10-minute delivery</li>
                    <li>💳 Use secure payment options</li>
                    <li>📱 Track your orders in real-time</li>
                </ul>

                <p>Welcome to the Fresh Corner family! 🥬</p>
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

export default verifyEmailTemplate