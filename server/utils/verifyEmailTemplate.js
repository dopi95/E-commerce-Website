const verifyEmailTemplate = ({ name, url }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .verify-box { background: #d1fae5; border: 2px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .button { background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-weight: bold; transition: background 0.3s; }
            .button:hover { background: #059669; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 Verify Your Email</h1>
                <p>Complete your Fresh Corner registration</p>
            </div>
            <div class="content">
                <div class="verify-box">
                    <h2>✉️ Email Verification Required</h2>
                    <p>Please verify your email address to activate your account</p>
                </div>

                <h2>Hello ${name}!</h2>
                <p>Thank you for registering with <strong>Fresh Corner</strong> - your trusted partner for fresh groceries!</p>
                
                <p>To complete your registration and start shopping, please verify your email address by clicking the button below:</p>
                
                <div style="text-align: center;">
                    <a href="${url}" class="button">Verify Email Address</a>
                </div>
                
                <div class="warning">
                    <p><strong>⚠️ Important:</strong></p>
                    <ul>
                        <li>This verification link will expire in 24 hours</li>
                        <li>If you didn't create this account, please ignore this email</li>
                        <li>For security, don't share this link with anyone</li>
                    </ul>
                </div>

                <p>🎉 <strong>Once verified, you can:</strong></p>
                <ul>
                    <li>🛒 Browse our fresh products</li>
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