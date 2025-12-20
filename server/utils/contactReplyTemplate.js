const contactReplyTemplate = ({ customerName, customerMessage, adminReply, adminName }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .reply-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
            .original-message { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📧 Reply from Fresh Corner</h1>
                <p>We've responded to your inquiry</p>
            </div>
            <div class="content">
                <h2>Hello ${customerName}!</h2>
                <p>Thank you for contacting <strong>Fresh Corner</strong>. We've reviewed your message and here's our response:</p>
                
                <div class="reply-box">
                    <h3>💬 Our Response:</h3>
                    <p style="white-space: pre-wrap;">${adminReply}</p>
                    <p style="margin-top: 15px; font-size: 14px; color: #666;">
                        - ${adminName}<br>
                        Fresh Corner Support Team
                    </p>
                </div>

                <div class="original-message">
                    <h4>📝 Your Original Message:</h4>
                    <p style="white-space: pre-wrap; font-style: italic;">${customerMessage}</p>
                </div>

                <p>If you have any additional questions, please don't hesitate to contact us again!</p>
                
                <p>Best regards,<br>
                <strong>Fresh Corner Support Team</strong> 🥬</p>
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

export default contactReplyTemplate;