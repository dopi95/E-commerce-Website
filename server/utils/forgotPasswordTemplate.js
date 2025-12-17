const forgotPasswordTemplate = ({ name, otp })=>{
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #22c55e; margin: 0; font-size: 28px;">🥬 Fresh Corner</h1>
                <p style="color: #666; margin: 5px 0 0 0;">Fresh groceries delivered to your door</p>
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">Dear ${name},</p>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">
                You have requested to reset your password. Please use the following verification code to proceed:
            </p>
            
            <div style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; font-size: 32px; padding: 25px; text-align: center; font-weight: bold; border-radius: 8px; margin: 25px 0; letter-spacing: 3px; font-family: 'Courier New', monospace;">
                ${otp}
            </div>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #92400e; font-weight: 500;">
                    ⚠️ <strong>Important:</strong> This verification code is valid for 1 hour only.
                </p>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                Enter this code on the Fresh Corner website to reset your password. If you didn't request this password reset, please ignore this email.
            </p>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
                <p style="color: #888; font-size: 14px; margin: 0;">Thank you for choosing Fresh Corner!</p>
                <p style="color: #22c55e; font-weight: bold; margin: 5px 0 0 0;">Fresh Corner Team</p>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
            <p style="color: #888; font-size: 12px; margin: 0;">
                This email was sent from Fresh Corner. Please do not reply to this email.
            </p>
        </div>
    </div>
    `
}

export default forgotPasswordTemplate